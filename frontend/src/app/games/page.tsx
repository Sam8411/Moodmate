"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import {
  Gamepad2,
  Award,
  Play,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  Smile,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

// Card templates for Memory Match
const MEMORY_CARDS = [
  { icon: "🌸", name: "Flower" },
  { icon: "🧘", name: "Zen" },
  { icon: "🍃", name: "Leaf" },
  { icon: "☀️", name: "Sun" },
  { icon: "🌊", name: "Wave" },
  { icon: "🎵", name: "Music" },
  { icon: "🍵", name: "Tea" },
  { icon: "✨", name: "Star" }
];

export default function Games() {
  const router = useRouter();
  const { user, loading: authLoading, updateUserPoints } = useAuth();
  
  const [activeGame, setActiveGame] = useState<"memory" | "bubble" | "clicker" | null>(null);
  const [myHighScores, setMyHighScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // General score submitter state
  const [scoreFeedback, setScoreFeedback] = useState("");

  // Memory Game states
  const [cards, setCards] = useState<any[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [memoryCompleted, setMemoryCompleted] = useState(false);

  // Breathing bubble states
  const [breathingPhase, setBreathingPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Hold Empty">("Inhale");
  const [breathingSeconds, setBreathingSeconds] = useState(4);
  const [breathingCycles, setBreathingCycles] = useState(0);
  const [breathingRunning, setBreathingRunning] = useState(false);
  const breathingInterval = useRef<any>(null);

  // Clicker Game states
  const [bubbles, setBubbles] = useState<any[]>([]);
  const [clickerScore, setClickerScore] = useState(0);
  const [clickerTimeLeft, setClickerTimeLeft] = useState(20);
  const [clickerRunning, setClickerRunning] = useState(false);
  const clickerInterval = useRef<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadHighScores();
    }
  }, [user]);

  const loadHighScores = async () => {
    setLoading(true);
    try {
      const data = await api.games.myScores();
      setMyHighScores(data.slice(0, 10));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScore = async (gameName: string, finalScore: number) => {
    try {
      const saved = await api.games.saveScore(gameName, finalScore);
      setScoreFeedback(`Saved! Earned +${Math.max(5, finalScore / 10)} Wellness Points.`);
      // Update local context score immediately
      updateUserPoints(Math.max(5, finalScore / 10));
      loadHighScores();
      setTimeout(() => setScoreFeedback(""), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // 1. MEMORY MATCH INITS
  const startMemoryGame = () => {
    // Duplicate cards and shuffle
    const duplicated = [...MEMORY_CARDS, ...MEMORY_CARDS]
      .map((card, index) => ({ ...card, id: index }))
      .sort(() => Math.random() - 0.5);

    setCards(duplicated);
    setFlippedIndexes([]);
    setMatchedPairs([]);
    setMoves(0);
    setMemoryCompleted(false);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndexes.length === 2 || flippedIndexes.includes(index) || matchedPairs.includes(cards[index].name)) {
      return;
    }

    const nextFlipped = [...flippedIndexes, index];
    setFlippedIndexes(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;

      if (cards[firstIdx].name === cards[secondIdx].name) {
        // Match!
        const newMatches = [...matchedPairs, cards[firstIdx].name];
        setMatchedPairs(newMatches);
        setFlippedIndexes([]);

        if (newMatches.length === MEMORY_CARDS.length) {
          // Completed
          setMemoryCompleted(true);
          const finalScore = Math.max(10, 200 - moves * 5);
          handleSaveScore("Memory Match", finalScore);
        }
      } else {
        // No match, flip back
        setTimeout(() => {
          setFlippedIndexes([]);
        }, 1000);
      }
    }
  };

  // 2. BREATHING BUBBLE INITS
  const startBreathingBubble = () => {
    setBreathingRunning(true);
    setBreathingPhase("Inhale");
    setBreathingSeconds(4);
    setBreathingCycles(0);

    if (breathingInterval.current) clearInterval(breathingInterval.current);

    breathingInterval.current = setInterval(() => {
      setBreathingSeconds((prev) => {
        if (prev <= 1) {
          // Phase swap
          setBreathingPhase((phase) => {
            if (phase === "Inhale") {
              return "Hold";
            } else if (phase === "Hold") {
              return "Exhale";
            } else if (phase === "Exhale") {
              return "Hold Empty";
            } else {
              setBreathingCycles((c) => {
                const next = c + 1;
                // Save score after 3 cycles (1 minute)
                if (next === 3) {
                  handleSaveScore("Breathing Bubble", 80);
                }
                return next;
              });
              return "Inhale";
            }
          });
          return 4; // Reset to 4s Box Breathing duration
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopBreathingBubble = () => {
    if (breathingInterval.current) clearInterval(breathingInterval.current);
    setBreathingRunning(false);
  };

  // 3. CLICKER POP INITS
  const startClickerGame = () => {
    setClickerRunning(true);
    setClickerScore(0);
    setClickerTimeLeft(20);
    setBubbles([]);

    if (clickerInterval.current) clearInterval(clickerInterval.current);

    // Spawn loop
    clickerInterval.current = setInterval(() => {
      setClickerTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(clickerInterval.current);
          setClickerRunning(false);
          // Complete
          handleSaveScore("Relaxation Clicker", clickerScore * 10);
          return 0;
        }
        return time - 1;
      });

      // Spawn bubbles
      setBubbles((prev) => {
        const id = Date.now() + Math.random();
        const top = Math.random() * 70 + 10; // clamp within board
        const left = Math.random() * 80 + 10;
        const color = ["bg-softBlue", "bg-lavender", "bg-mintGreen"][Math.floor(Math.random() * 3)];
        const newBubble = { id, top, left, color };
        return [...prev, newBubble].slice(-10); // cap active items count
      });
    }, 1000);
  };

  const handlePopBubble = (id: number) => {
    setClickerScore((s) => s + 1);
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  useEffect(() => {
    return () => {
      if (breathingInterval.current) clearInterval(breathingInterval.current);
      if (clickerInterval.current) clearInterval(clickerInterval.current);
    };
  }, []);

  if (authLoading || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-softBlue border-t-transparent mx-auto"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Polishing the games console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 text-left">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-outfit">Stress Relief Games</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Take a mental break with responsive activities designed to enhance focus, pop stress, and reward mindfulness.
          </p>
        </div>
        {activeGame && (
          <button
            onClick={() => {
              setActiveGame(null);
              stopBreathingBubble();
              if (clickerInterval.current) clearInterval(clickerInterval.current);
              setClickerRunning(false);
            }}
            className="flex items-center space-x-1 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-slate-50 text-slate-500"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Games Menu</span>
          </button>
        )}
      </div>

      {scoreFeedback && (
        <div className="bg-mintGreen-light border border-mintGreen/30 text-mintGreen-dark p-3.5 rounded-2xl text-xs font-bold flex items-center space-x-2 w-fit">
          <CheckCircle2 className="h-4 w-4" />
          <span>{scoreFeedback}</span>
        </div>
      )}

      {/* GAMES MENU SCREEN */}
      {!activeGame && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* List of Game Cards */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* 1. Memory Match */}
            <div className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-850 flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-2xl bg-softBlue/10 text-softBlue flex items-center justify-center font-bold">
                  🧩
                </div>
                <h3 className="text-sm font-bold font-outfit">Memory Match</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Flip tiles, find matches, and clear the board to boost cognitive focus and pop positive points.
                </p>
              </div>
              <button
                onClick={() => { setActiveGame("memory"); startMemoryGame(); }}
                className="w-full rounded-xl bg-softBlue text-white text-xs font-semibold py-2.5 hover:bg-softBlue-dark"
              >
                Launch Game
              </button>
            </div>

            {/* 2. Breathing Bubble */}
            <div className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-850 flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-2xl bg-mintGreen/15 text-mintGreen-dark flex items-center justify-center font-bold">
                  🎈
                </div>
                <h3 className="text-sm font-bold font-outfit">Breathing Bubble</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Breathe in sync with our pulsing visual guides. Helps lower heart rates and restore calm.
                </p>
              </div>
              <button
                onClick={() => { setActiveGame("bubble"); startBreathingBubble(); }}
                className="w-full rounded-xl bg-mintGreen text-slate-900 text-xs font-semibold py-2.5 hover:bg-mintGreen-dark"
              >
                Launch Guide
              </button>
            </div>

            {/* 3. Clicker Pop */}
            <div className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-850 flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-2xl bg-lavender/20 text-lavender-dark flex items-center justify-center font-bold">
                  🧼
                </div>
                <h3 className="text-sm font-bold font-outfit">Relax Clicker</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Relieve stress by clicking bubble pods as they spawn on the dashboard canvas!
                </p>
              </div>
              <button
                onClick={() => { setActiveGame("clicker"); startClickerGame(); }}
                className="w-full rounded-xl bg-lavender text-slate-900 text-xs font-semibold py-2.5 hover:bg-lavender-dark"
              >
                Launch Clicker
              </button>
            </div>
          </div>

          {/* User Score Stats pane */}
          <div className="md:col-span-1 glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Award className="h-5 w-5 text-mintGreen" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Game High Scores</h3>
            </div>
            <div className="space-y-2.5">
              {myHighScores.length > 0 ? (
                myHighScores.map((score) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between text-xs border-b border-slate-50 dark:border-slate-900 pb-2"
                  >
                    <div>
                      <div className="font-bold truncate max-w-[120px]">{score.gameName}</div>
                      <div className="text-[9px] text-slate-400">{new Date(score.timestamp).toLocaleDateString()}</div>
                    </div>
                    <span className="font-extrabold text-softBlue">{score.score} pts</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No scores stored yet. Play a game to record!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GAME WINDOW: MEMORY MATCH */}
      {activeGame === "memory" && (
        <div className="glass-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 max-w-xl mx-auto space-y-6 text-center">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-base font-bold font-outfit">Memory Match</h3>
              <p className="text-xs text-slate-400">Moves: {moves} | Matches: {matchedPairs.length}/{MEMORY_CARDS.length}</p>
            </div>
            <button
              onClick={startMemoryGame}
              className="p-2.5 rounded-xl border hover:bg-slate-50 text-slate-500"
              title="Reset Board"
            >
              <RotateCcw className="h-4.5 w-4.5" />
            </button>
          </div>

          {memoryCompleted ? (
            <div className="py-12 space-y-4">
              <div className="text-4xl">🏆</div>
              <h4 className="text-lg font-bold font-outfit text-mintGreen-dark">Victory! Board Cleared</h4>
              <p className="text-xs text-slate-500">Completed in {moves} moves. You have earned points!</p>
              <button
                onClick={startMemoryGame}
                className="rounded-xl bg-softBlue text-white text-xs font-semibold px-6 py-2.5"
              >
                Play Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 py-4">
              {cards.map((card, idx) => {
                const isFlipped = flippedIndexes.includes(idx);
                const isMatched = matchedPairs.includes(card.name);
                const show = isFlipped || isMatched;

                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    className={`h-16 rounded-2xl flex items-center justify-center text-2xl transition-all border duration-300 ${show ? "bg-white dark:bg-slate-900 border-softBlue transform rotate-180 scale-105" : "bg-gradient-to-tr from-softBlue/20 to-lavender/30 border-slate-100 hover:scale-103"}`}
                  >
                    {show ? card.icon : ""}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* GAME WINDOW: BREATHING BUBBLE */}
      {activeGame === "bubble" && (
        <div className="glass-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 max-w-xl mx-auto space-y-6 text-center">
          <div className="border-b pb-4">
            <h3 className="text-base font-bold font-outfit">Box Breathing Bubble</h3>
            <p className="text-xs text-slate-400">Cycles Completed: {breathingCycles}/3</p>
          </div>

          <div className="py-16 flex items-center justify-center">
            <div
              className={`rounded-full flex items-center justify-center text-white font-extrabold transition-all duration-4000 relative ${breathingRunning ? "shadow-lg bg-softBlue" : "bg-slate-200 dark:bg-slate-800 text-slate-400"}`}
              style={{
                width: breathingRunning && (breathingPhase === "Inhale" || breathingPhase === "Hold") ? "160px" : "100px",
                height: breathingRunning && (breathingPhase === "Inhale" || breathingPhase === "Hold") ? "160px" : "100px",
              }}
            >
              {/* Pulsing outer ring */}
              {breathingRunning && (
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/35 animate-spin duration-8000" />
              )}
              <div className="text-center relative z-10">
                <div className="text-sm font-outfit leading-none">{breathingRunning ? breathingPhase : "Bubble Ready"}</div>
                <div className="text-xl mt-1 leading-none">{breathingRunning ? `${breathingSeconds}s` : ""}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl text-[11px] text-slate-500 max-w-xs mx-auto">
              Follow the instructions: Inhale when the bubble expands, Hold, Exhale when it contracts, and Hold empty.
            </div>
            {breathingRunning ? (
              <button
                onClick={stopBreathingBubble}
                className="rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 px-6 py-2.5 text-xs font-semibold"
              >
                Stop Guide
              </button>
            ) : (
              <button
                onClick={startBreathingBubble}
                className="rounded-xl bg-softBlue text-white px-6 py-2.5 text-xs font-semibold"
              >
                Start Breathing Cycle
              </button>
            )}
          </div>
        </div>
      )}

      {/* GAME WINDOW: CLICKER POP */}
      {activeGame === "clicker" && (
        <div className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 max-w-xl mx-auto space-y-6 text-center">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-base font-bold font-outfit">Relaxation Clicker</h3>
              <p className="text-xs text-slate-400">Score: {clickerScore} pops | Time Left: {clickerTimeLeft}s</p>
            </div>
          </div>

          {clickerRunning ? (
            /* Pop container viewport */
            <div className="h-64 w-full bg-slate-50 dark:bg-slate-900 rounded-2xl relative border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner">
              {bubbles.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handlePopBubble(b.id)}
                  style={{ top: `${b.top}%`, left: `${b.left}%` }}
                  className={`absolute h-8 w-8 rounded-full border border-white/20 shadow-md ${b.color} animate-ping duration-10000`}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 space-y-4">
              <div className="text-4xl">🧼</div>
              <h4 className="text-lg font-bold font-outfit text-mintGreen-dark">Session Concluded!</h4>
              <p className="text-xs text-slate-500">You popped {clickerScore} stress bubbles and earned points.</p>
              <button
                onClick={startClickerGame}
                className="rounded-xl bg-softBlue text-white text-xs font-semibold px-6 py-2.5"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
