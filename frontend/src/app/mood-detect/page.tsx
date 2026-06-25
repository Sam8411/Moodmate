"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import {
  Brain,
  Mic,
  Webcam,
  Music,
  BookOpen,
  Activity,
  Smile,
  Send,
  Loader2,
  CheckCircle,
  Video,
  Play,
  Volume2
} from "lucide-react";

export default function MoodDetect() {
  const { user, updateUserPoints } = useAuth();
  const [activeTab, setActiveTab] = useState<"text" | "voice" | "face">("text");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  // Text analysis state
  const [textInput, setTextInput] = useState("");

  // Voice analysis state
  const [recording, setRecording] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);

  // Face analysis state
  const [scanning, setScanning] = useState(false);

  const handleTextAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await api.mood.analyze(textInput);
      setResult(res);
      updateUserPoints(5, user?.badges); // Award points
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceRecord = () => {
    setRecording(true);
    setResult(null);
    setVoiceDuration(0);
    
    // Simulate recording for 3 seconds
    const interval = setInterval(() => {
      setVoiceDuration((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          setRecording(false);
          analyzeVoiceMock();
          return 3;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const analyzeVoiceMock = async () => {
    setLoading(true);
    setTimeout(async () => {
      // Pick a semi-random voice sentiment output
      const sentiments = ["Calm", "Happy", "Stressed", "Sad"];
      const chosen = sentiments[Math.floor(Math.random() * sentiments.length)];
      
      try {
        const res = await api.mood.analyze("I am feeling " + chosen.toLowerCase() + " today in my voice check.");
        setResult({
          mood: chosen,
          score: 82.5,
          voiceStats: { stress: "Low", energy: chosen === "Happy" ? "High" : "Moderate", anxiety: chosen === "Stressed" ? "High" : "Low" },
          musicRecommendations: res.musicRecommendations,
          storyRecommendations: res.storyRecommendations,
          exerciseRecommendations: res.exerciseRecommendations,
        });
        updateUserPoints(5);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const handleFaceScan = () => {
    setScanning(true);
    setResult(null);

    // Simulate webcam facial coordinate scanner running
    setTimeout(async () => {
      setScanning(false);
      const faceMoods = ["Happy", "Neutral", "Sad", "Angry"];
      const chosen = faceMoods[Math.floor(Math.random() * faceMoods.length)];
      
      try {
        const res = await api.mood.analyze("My face scan shows " + chosen.toLowerCase());
        setResult({
          mood: chosen === "Neutral" ? "Calm" : chosen,
          score: 91.0,
          faceStats: { confidence: 96.5, eyeContact: "Direct", facialTenseness: chosen === "Angry" ? "Tense" : "Relaxed" },
          musicRecommendations: res.musicRecommendations,
          storyRecommendations: res.storyRecommendations,
          exerciseRecommendations: res.exerciseRecommendations,
        });
        updateUserPoints(5);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto text-left">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold font-outfit">AI Mood Analyzer</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Understand your emotional state using textual sentiment, vocal stresses, or facial expression webcam scans.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-sm">
        <button
          onClick={() => { setActiveTab("text"); setResult(null); }}
          className={`pb-3 font-semibold transition-all flex items-center space-x-1.5 ${activeTab === "text" ? "border-b-2 border-softBlue text-softBlue" : "text-slate-400 hover:text-slate-600"}`}
        >
          <Brain className="h-4.5 w-4.5" />
          <span>Text Sentiment</span>
        </button>
        <button
          onClick={() => { setActiveTab("voice"); setResult(null); }}
          className={`pb-3 font-semibold transition-all flex items-center space-x-1.5 ${activeTab === "voice" ? "border-b-2 border-softBlue text-softBlue" : "text-slate-400 hover:text-slate-600"}`}
        >
          <Mic className="h-4.5 w-4.5" />
          <span>Vocal Analysis</span>
        </button>
        <button
          onClick={() => { setActiveTab("face"); setResult(null); }}
          className={`pb-3 font-semibold transition-all flex items-center space-x-1.5 ${activeTab === "face" ? "border-b-2 border-softBlue text-softBlue" : "text-slate-400 hover:text-slate-600"}`}
        >
          <Webcam className="h-4.5 w-4.5" />
          <span>Facial expression</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Active Analysis Module */}
        <div className="md:col-span-3 glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 space-y-6">
          {activeTab === "text" && (
            <form onSubmit={handleTextAnalyze} className="space-y-4">
              <h3 className="text-base font-bold font-outfit">How are you feeling today?</h3>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Write honestly about your day, worries, or happy moments. Our AI will analyze your sentiment..."
                rows={6}
                required
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-softBlue text-sm transition-all resize-none"
              />
              <button
                type="submit"
                disabled={loading || !textInput.trim()}
                className="w-full rounded-2xl bg-softBlue py-3 text-sm font-semibold text-white hover:bg-softBlue-dark shadow-sm disabled:opacity-50 transition-all flex items-center justify-center space-x-1.5"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span>Analyze Sentiment</span>
              </button>
            </form>
          )}

          {activeTab === "voice" && (
            <div className="flex flex-col items-center justify-center text-center py-6 space-y-6">
              <h3 className="text-base font-bold font-outfit">Vocal stress analyzer</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Speak for 3 seconds. The analyzer reviews frequencies to score anxiety and excitement levels.
              </p>

              <button
                onClick={handleVoiceRecord}
                disabled={recording || loading}
                className={`h-24 w-24 rounded-full flex items-center justify-center shadow-lg transition-all ${recording ? "bg-rose-500 text-white animate-pulse" : "bg-softBlue/10 hover:bg-softBlue/20 text-softBlue dark:bg-softBlue/20"}`}
              >
                <Mic className="h-10 w-10" />
              </button>

              {recording && (
                <div className="text-xs font-semibold text-rose-500 animate-pulse">
                  Recording audio... {voiceDuration}s
                </div>
              )}

              {loading && (
                <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing speech stress points...</span>
                </div>
              )}
            </div>
          )}

          {activeTab === "face" && (
            <div className="flex flex-col items-center justify-center text-center py-4 space-y-6">
              <h3 className="text-base font-bold font-outfit">Facial Landmark scan</h3>
              
              {/* Webcam viewport box */}
              <div className="h-48 w-64 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                {scanning ? (
                  <>
                    <div className="absolute inset-x-0 h-1 bg-mintGreen top-0 animate-bounce duration-3000" />
                    <Video className="h-10 w-10 text-mintGreen animate-pulse" />
                    <span className="text-[10px] text-mintGreen font-semibold mt-2 animate-pulse">Mapping landmarks...</span>
                  </>
                ) : (
                  <>
                    <Video className="h-10 w-10 text-slate-400" />
                    <span className="text-[10px] text-slate-400 mt-2">Camera stream ready</span>
                  </>
                )}
              </div>

              <button
                onClick={handleFaceScan}
                disabled={scanning || loading}
                className="rounded-xl bg-softBlue px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-softBlue-dark transition-all"
              >
                {scanning ? "Scanning..." : "Activate Camera Scan"}
              </button>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 h-full flex flex-col justify-between space-y-6">
            <h3 className="text-base font-bold font-outfit">Analysis Results</h3>

            {result ? (
              <div className="space-y-6 flex-grow">
                {/* Result header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-mintGreen bg-mintGreen-light dark:bg-mintGreen-dark/15 px-3 py-1 rounded-full border border-mintGreen/30">
                    <CheckCircle className="h-4 w-4" />
                    <span>Analysis Complete (+5 pts)</span>
                  </div>
                  <div className="text-3xl font-extrabold font-outfit bg-gradient-to-r from-softBlue to-lavender-dark bg-clip-text text-transparent">
                    {result.mood}
                  </div>
                  <p className="text-xs text-slate-400">Confidence Match: {result.score.toFixed(1)}%</p>
                </div>

                {/* Substats */}
                {(result.voiceStats || result.faceStats) && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl text-[11px] space-y-1.5 border border-slate-100 dark:border-slate-850">
                    {result.voiceStats && (
                      <>
                        <div className="flex justify-between"><span>Vocal Stress:</span> <span className="font-semibold">{result.voiceStats.stress}</span></div>
                        <div className="flex justify-between"><span>Speech Energy:</span> <span className="font-semibold">{result.voiceStats.energy}</span></div>
                      </>
                    )}
                    {result.faceStats && (
                      <>
                        <div className="flex justify-between"><span>Eye Contact:</span> <span className="font-semibold">{result.faceStats.eyeContact}</span></div>
                        <div className="flex justify-between"><span>Facial Tenseness:</span> <span className="font-semibold">{result.faceStats.facialTenseness}</span></div>
                      </>
                    )}
                  </div>
                )}

                {/* Micro recommendations */}
                <div className="space-y-3 pt-2 text-left">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Suggestions</h4>
                  <div className="flex flex-col space-y-2 text-xs">
                    {result.musicRecommendations?.slice(0, 1).map((track: any) => (
                      <div key={track.id} className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                        <Music className="h-4 w-4 text-softBlue" />
                        <span className="truncate flex-grow font-semibold">{track.title}</span>
                      </div>
                    ))}
                    {result.exerciseRecommendations?.slice(0, 1).map((ex: any) => (
                      <div key={ex.id} className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                        <Activity className="h-4 w-4 text-mintGreen" />
                        <span className="truncate flex-grow font-semibold">{ex.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 py-12 space-y-2">
                <Smile className="h-10 w-10 animate-float" />
                <p className="text-xs">No analysis logged yet. Use any of the inputs to log.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
