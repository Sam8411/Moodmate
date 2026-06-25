"use client";
export const dynamic = "force-dynamic";
import React, { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import {
  Music,
  BookOpen,
  Activity,
  Play,
  Pause,
  ChevronRight,
  Sparkles,
  Volume2,
  Clock,
  Compass,
  FileText,
  Award
} from "lucide-react";

function ActivitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, updateUserPoints } = useAuth();

  const [activeTab, setActiveTab] = useState<"music" | "stories" | "exercises">("music");
  const [loading, setLoading] = useState(true);

  // Data lists
  const [musicList, setMusicList] = useState<any[]>([]);
  const [storiesList, setStoriesList] = useState<any[]>([]);
  const [exercisesList, setExercisesList] = useState<any[]>([]);

  // Music Player state
  const [currentTrack, setCurrentTrack] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Story Reader Modal
  const [activeStory, setActiveStory] = useState<any | null>(null);

  // Exercise Timer state
  const [activeExercise, setActiveExercise] = useState<any | null>(null);
  const [timerLeft, setTimerLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerIntervalRef = useRef<any>(null);

  // Filters and Loading Substates
  const [musicMoodFilter, setMusicMoodFilter] = useState<string>("all");
  const [musicCatFilter, setMusicCatFilter] = useState<string>("all");
  const [storyMoodFilter, setStoryMoodFilter] = useState<string>("all");
  const [storyCatFilter, setStoryCatFilter] = useState<string>("all");

  const [musicLoading, setMusicLoading] = useState(false);
  const [storiesLoading, setStoriesLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "music" || tabParam === "stories" || tabParam === "exercises") {
      setActiveTab(tabParam);
    }
    const moodParam = searchParams.get("mood");
    if (moodParam) {
      const capitalizedMood = moodParam.charAt(0).toUpperCase() + moodParam.slice(1).toLowerCase();
      if (tabParam === "stories") {
        setStoryMoodFilter(capitalizedMood);
      } else {
        setMusicMoodFilter(capitalizedMood);
      }
    }
    loadExercises();
  }, [searchParams]);

  const loadExercises = async () => {
    setLoading(true);
    try {
      const exercises = await api.exercises.all();
      setExercisesList(exercises);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMusic = async (mood: string, cat: string) => {
    setMusicLoading(true);
    try {
      let data = [];
      if (mood !== "all") {
        data = await api.music.byMood(mood);
      } else if (cat !== "all") {
        data = await api.music.byCategory(cat);
      } else {
        data = await api.music.all();
      }
      setMusicList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setMusicLoading(false);
    }
  };

  const loadStories = async (mood: string, cat: string) => {
    setStoriesLoading(true);
    try {
      let data = [];
      if (mood !== "all") {
        data = await api.stories.byMood(mood);
      } else if (cat !== "all") {
        data = await api.stories.byCategory(cat);
      } else {
        data = await api.stories.all();
      }
      setStoriesList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setStoriesLoading(false);
    }
  };

  useEffect(() => {
    loadMusic(musicMoodFilter, musicCatFilter);
  }, [musicMoodFilter, musicCatFilter]);

  useEffect(() => {
    loadStories(storyMoodFilter, storyCatFilter);
  }, [storyMoodFilter, storyCatFilter]);

  // Audio Play controls
  const handlePlayTrack = (track: any) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.play();
      }
    }
  };

  // Exercise Timer Controls
  const handleStartExercise = (exercise: any) => {
    setActiveExercise(exercise);
    setTimerLeft(exercise.duration);
    setTimerRunning(true);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setTimerLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          setTimerRunning(false);
          handleExerciseComplete(exercise);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancelTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimerRunning(false);
    setActiveExercise(null);
  };

  const handleExerciseComplete = (exercise: any) => {
    updateUserPoints(15); // Large point reward for mindfulness completion
    alert(`Great job! You have completed the ${exercise.title} exercise and earned 15 Wellness Points!`);
    setActiveExercise(null);
  };

  // Audio elements helper
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false);
    });
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  if (authLoading || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-softBlue border-t-transparent mx-auto"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Arranging therapeutic collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold font-outfit">Wellness Activities Shelf</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Listen to comforting melodies, review inspiration stories, or start timed breathing and yoga sessions.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-sm">
        <button
          onClick={() => setActiveTab("music")}
          className={`pb-3 font-semibold transition-all flex items-center space-x-1.5 ${activeTab === "music" ? "border-b-2 border-softBlue text-softBlue" : "text-slate-400 hover:text-slate-600"}`}
        >
          <Music className="h-4.5 w-4.5" />
          <span>Music Therapy</span>
        </button>
        <button
          onClick={() => setActiveTab("stories")}
          className={`pb-3 font-semibold transition-all flex items-center space-x-1.5 ${activeTab === "stories" ? "border-b-2 border-softBlue text-softBlue" : "text-slate-400 hover:text-slate-600"}`}
        >
          <BookOpen className="h-4.5 w-4.5" />
          <span>Story Therapy</span>
        </button>
        <button
          onClick={() => setActiveTab("exercises")}
          className={`pb-3 font-semibold transition-all flex items-center space-x-1.5 ${activeTab === "exercises" ? "border-b-2 border-softBlue text-softBlue" : "text-slate-400 hover:text-slate-600"}`}
        >
          <Activity className="h-4.5 w-4.5" />
          <span>Mindfulness Timers</span>
        </button>
      </div>

      {/* Main active window */}
      <div className="grid grid-cols-1 gap-6">
        {/* A. MUSIC THERAPY TAB */}
        {activeTab === "music" && (
          <div className="space-y-6">
            {/* Filter controls */}
            <div className="flex flex-wrap gap-4 items-center bg-slate-50 dark:bg-slate-900/40 p-4 rounded-3xl border border-slate-100 dark:border-slate-850">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter Melodies:</span>
              <div className="flex flex-wrap gap-2">
                <select
                  value={musicMoodFilter}
                  onChange={(e) => { setMusicMoodFilter(e.target.value); setMusicCatFilter("all"); }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 focus:outline-none"
                >
                  <option value="all">All Moods</option>
                  <option value="Happy">Happy</option>
                  <option value="Sad">Sad</option>
                  <option value="Calm">Calm</option>
                  <option value="Stressed">Stressed</option>
                  <option value="Angry">Angry</option>
                  <option value="Excited">Excited</option>
                </select>
                <select
                  value={musicCatFilter}
                  onChange={(e) => { setMusicCatFilter(e.target.value); setMusicMoodFilter("all"); }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Acoustic">Acoustic</option>
                  <option value="Nature Sounds">Nature Sounds</option>
                  <option value="Lo-Fi Beats">Lo-Fi Beats</option>
                  <option value="Ambient Pad">Ambient Pad</option>
                  <option value="Uplifting Synth">Uplifting Synth</option>
                  <option value="Classical Solace">Classical Solace</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Play widget */}
              <div className="md:col-span-1 glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 text-center flex flex-col justify-between h-fit min-h-[300px]">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Now Playing</h3>
                  <div className="h-24 w-24 bg-gradient-to-tr from-softBlue to-lavender rounded-3xl flex items-center justify-center text-white mx-auto my-6 shadow-md">
                    <Music className="h-10 w-10 animate-float" />
                  </div>
                  {currentTrack ? (
                    <div className="space-y-1">
                      <div className="text-sm font-bold truncate">{currentTrack.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{currentTrack.artist}</div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Select a melody from the list</p>
                  )}
                </div>

                {currentTrack && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={() => handlePlayTrack(currentTrack)}
                        className="h-12 w-12 rounded-full bg-softBlue text-white hover:bg-softBlue-dark flex items-center justify-center shadow-md active:scale-95 transition-all"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 pl-0.5" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400">
                      <Volume2 className="h-4 w-4" />
                      <span>Streaming active</span>
                    </div>
                  </div>
                )}
              </div>

              {/* List */}
              <div className="md:col-span-3 glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 space-y-4 h-[55vh] overflow-y-auto">
                <h3 className="text-base font-bold font-outfit">Melodies Collection</h3>
                {musicLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-softBlue border-t-transparent mx-auto"></div>
                  </div>
                ) : musicList.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400">
                    No melodies found for your selection. Try relaxing your filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {musicList.map((track) => (
                      <div
                        key={track.id}
                        onClick={() => handlePlayTrack(track)}
                        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer hover:shadow-sm transition-all ${currentTrack?.id === track.id ? "bg-softBlue/5 border-softBlue dark:bg-softBlue/10" : "bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-850 hover:bg-slate-100/50"}`}
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${currentTrack?.id === track.id && isPlaying ? "bg-softBlue text-white animate-pulse" : "bg-slate-100 dark:bg-slate-850"}`}>
                            {currentTrack?.id === track.id && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold truncate max-w-[150px]">{track.title}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{track.artist}</div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          {track.moodType}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* B. STORY THERAPY TAB */}
        {activeTab === "stories" && (
          <div className="space-y-6">
            {activeStory ? (
              /* Story detailed reader panel */
              <div className="glass-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 space-y-6 animate-fadeIn max-w-2xl mx-auto">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
                  <div>
                    <h2 className="text-xl font-bold font-outfit">{activeStory.title}</h2>
                    <span className="text-[10px] font-semibold bg-lavender/25 text-lavender-dark dark:text-lavender px-2.5 py-0.5 rounded-full capitalize mt-1 inline-block">
                      {activeStory.category.toLowerCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveStory(null)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full"
                  >
                    Close Story
                  </button>
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-light tracking-wide text-justify whitespace-pre-wrap">
                  {activeStory.content}
                </div>
                <div className="bg-gradient-to-tr from-lavender/10 to-softBlue/5 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-start space-x-2 text-xs text-slate-500">
                  <Sparkles className="h-4.5 w-4.5 text-lavender-dark flex-shrink-0 mt-0.5" />
                  <span>We hope this story was comforting. Take a minute to absorb its message and relax.</span>
                </div>
              </div>
            ) : (
              /* Stories Shelf list */
              <div className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-base font-bold font-outfit">Therapeutic Library</h3>
                  {/* Filters */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-slate-400">Filter:</span>
                    <select
                      value={storyMoodFilter}
                      onChange={(e) => { setStoryMoodFilter(e.target.value); setStoryCatFilter("all"); }}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 focus:outline-none"
                    >
                      <option value="all">All Moods</option>
                      <option value="Happy">Happy</option>
                      <option value="Sad">Sad</option>
                      <option value="Calm">Calm</option>
                      <option value="Stressed">Stressed</option>
                      <option value="Angry">Angry</option>
                      <option value="Excited">Excited</option>
                    </select>
                    <select
                      value={storyCatFilter}
                      onChange={(e) => { setStoryCatFilter(e.target.value); setStoryMoodFilter("all"); }}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 focus:outline-none"
                    >
                      <option value="all">All Categories</option>
                      <option value="Motivation">Motivation</option>
                      <option value="Success">Success</option>
                      <option value="Self Confidence">Self Confidence</option>
                      <option value="Depression Recovery">Depression Recovery</option>
                      <option value="Positive Thinking">Positive Thinking</option>
                      <option value="Inspiration">Inspiration</option>
                    </select>
                  </div>
                </div>

                {storiesLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-softBlue border-t-transparent mx-auto"></div>
                  </div>
                ) : storiesList.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400">
                    No stories found for your selection. Try relaxing your filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {storiesList.map((story) => (
                      <div
                        key={story.id}
                        onClick={() => setActiveStory(story)}
                        className="p-5 rounded-2xl border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100/50 hover:shadow-sm cursor-pointer transition-all space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="text-xs font-bold truncate max-w-[200px]">{story.title}</h4>
                            <span className="text-[9px] font-semibold bg-lavender/25 text-lavender-dark px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {story.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                            {story.content}
                          </p>
                        </div>
                        <div className="text-[10px] font-bold text-softBlue flex items-center space-x-1 hover:underline">
                          <span>Read Story</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* C. MINDFULNESS TIMERS TAB */}
        {activeTab === "exercises" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Timer Controller */}
            <div className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 text-center flex flex-col justify-between h-fit min-h-[320px]">
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Mindfulness Session</h3>
                {activeExercise ? (
                  <div className="my-6">
                    <div className="text-3xl font-extrabold font-outfit text-softBlue dark:text-softBlue-light animate-pulse-slow">
                      {Math.floor(timerLeft / 60)}:{(timerLeft % 60).toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs font-bold mt-2 truncate max-w-[150px] mx-auto">{activeExercise.title}</div>
                    <div className="text-[10px] text-slate-400 mt-1 capitalize">{activeExercise.category.toLowerCase()} timer</div>
                  </div>
                ) : (
                  <div className="my-8 text-slate-400 text-xs space-y-2">
                    <Clock className="h-10 w-10 mx-auto text-slate-300" />
                    <p>Select a mindfulness timer from the collection to begin.</p>
                  </div>
                )}
              </div>

              {activeExercise && (
                <div className="space-y-4">
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-softBlue transition-all duration-1000"
                      style={{ width: `${(timerLeft / activeExercise.duration) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={handleCancelTimer}
                    className="w-full rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 p-2.5 text-xs font-semibold transition-all"
                  >
                    Cancel Session
                  </button>
                </div>
              )}
            </div>

            {/* List */}
            <div className="md:col-span-2 glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 space-y-4 h-[55vh] overflow-y-auto">
              <h3 className="text-base font-bold font-outfit">Mindfulness Routines (+15 pts)</h3>
              <div className="space-y-3">
                {exercisesList.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100/50 hover:shadow-sm transition-all space-y-3 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold">{ex.title}</h4>
                        <span className="text-[9px] font-semibold bg-mintGreen/25 text-mintGreen-dark dark:text-mintGreen px-2 py-0.5 rounded-full capitalize inline-block mt-1">
                          {ex.category.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-400 text-xs">
                        <Clock className="h-4 w-4" />
                        <span>{Math.round(ex.duration / 60)} mins</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {ex.description}
                    </p>
                    <button
                      onClick={() => handleStartExercise(ex)}
                      disabled={timerRunning && activeExercise?.id === ex.id}
                      className="rounded-xl bg-softBlue text-white px-4 py-2 text-[10px] font-semibold hover:bg-softBlue-dark transition-all disabled:opacity-50"
                    >
                      Start Routine
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default function Activities() {
  return (
    <Suspense fallback={<div>Loading activities...</div>}>
      <ActivitiesContent />
    </Suspense>
  );
}