"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import {
  Brain,
  MessageSquare,
  BookOpen,
  Music,
  Gamepad2,
  CalendarDays,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  ListRestart
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestMood, setLatestMood] = useState<string>("Calm");
  const [latestScore, setLatestScore] = useState<number>(75.0);

  // Recommendations state
  const [musicRecs, setMusicRecs] = useState<any[]>([]);
  const [storyRecs, setStoryRecs] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const history = await api.mood.history();
      setMoodHistory(history);
      
      if (history.length > 0) {
        const latest = history[0];
        setLatestMood(latest.mood);
        setLatestScore(latest.score);

        // Fetch tailored suggestions based on user's last mood
        const music = await api.music.byMood(latest.mood);
        setMusicRecs(music.slice(0, 3));

        const stories = await api.stories.byMood(latest.mood);
        setStoryRecs(stories.slice(0, 2));
      } else {
        // Default seed recommendation fetches if user hasn't tracked yet
        const music = await api.music.byMood("Calm");
        setMusicRecs(music.slice(0, 3));

        const stories = await api.stories.byMood("Calm");
        setStoryRecs(stories.slice(0, 2));
      }
    } catch (err) {
      console.error("Error loading dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-softBlue border-t-transparent mx-auto"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Restoring your wellness desk...</p>
        </div>
      </div>
    );
  }

  // Calculate mood counts for distribution graphics
  const moodCounts: Record<string, number> = { Happy: 0, Sad: 0, Stressed: 0, Angry: 0, Calm: 0, Excited: 0 };
  moodHistory.forEach((log) => {
    if (moodCounts[log.mood] !== undefined) {
      moodCounts[log.mood]++;
    }
  });

  const quickActions = [
    { name: "Detect Mood", href: "/mood-detect", color: "bg-softBlue text-white hover:bg-softBlue-dark", desc: "Scan sentiment", icon: Brain },
    { name: "Support Chat", href: "/chat", color: "bg-lavender text-slate-900 hover:bg-lavender-dark", desc: "Chat with AI bot", icon: MessageSquare },
    { name: "Digital Diary", href: "/journal", color: "bg-mintGreen text-slate-900 hover:bg-mintGreen-dark", desc: "Gratitude & Goals", icon: BookOpen },
    { name: "Relax Music", href: "/activities?tab=music", color: "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-350", desc: "Acoustic & Nature", icon: Music },
    { name: "Mind Games", href: "/games", color: "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-350", desc: "Stress Relief", icon: Gamepad2 }
  ];

  return (
    <div className="space-y-10 py-4 text-left">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-outfit">Hello, {user?.name}!</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Welcome to your mental wellness desk. Remember to take a mindful breath today.
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-800/80">
          <div className="h-10 w-10 rounded-2xl bg-mintGreen/15 flex items-center justify-center text-mintGreen-dark dark:text-mintGreen">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-lg font-bold font-outfit leading-tight">{user?.points} Points</div>
            <div className="text-xs text-slate-400 truncate max-w-[200px]">{user?.badges || "Explorer"}</div>
          </div>
        </div>
      </div>

      {/* Mood Score Ring Card & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Mood Card */}
        <div className="glass-card rounded-[2rem] p-8 flex flex-col justify-between border border-slate-100 dark:border-slate-800 lg:col-span-1 text-center">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-500 uppercase tracking-wider">Current Mood Status</h2>
            <p className="text-xs text-slate-400">Based on your latest sentiment assessment</p>
          </div>

          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Animated rings */}
              <div className="absolute h-36 w-36 rounded-full border-4 border-dashed border-softBlue/25 animate-spin duration-10000" />
              <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-softBlue/10 to-lavender/20 dark:from-softBlue/20 dark:to-lavender/30 flex flex-col items-center justify-center shadow-inner relative z-10">
                <span className="text-2xl font-extrabold font-outfit text-softBlue dark:text-softBlue-light">{latestMood}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{latestScore.toFixed(0)}% score</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl text-xs text-slate-500 leading-relaxed">
              Feeling <strong>{latestMood.toLowerCase()}</strong>? We've updated your daily recommendations with matching therapeutic items.
            </div>
            <Link
              href="/mood-detect"
              className="w-full inline-flex justify-center items-center rounded-2xl bg-softBlue py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-softBlue-dark transition-all space-x-1.5"
            >
              <ListRestart className="h-4 w-4" />
              <span>Log New Mood</span>
            </Link>
          </div>
        </div>

        {/* Quick Actions & Analytics summary */}
        <div className="lg:col-span-2 flex flex-col justify-between space-y-8">
          {/* Quick Actions Panel */}
          <div className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold font-outfit pl-2">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-md hover:scale-[1.03] transition-all group"
                >
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-softBlue/10 group-hover:text-softBlue transition-all mb-3">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-center leading-none">{action.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1">{action.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mood breakdown */}
          <div className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pl-2">
              <h3 className="text-lg font-bold font-outfit">Mood Log Distribution</h3>
              <Link href="/analytics" className="text-xs font-bold text-softBlue flex items-center hover:underline">
                <span>View Analytics</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(moodCounts).map((mood) => {
                const count = moodCounts[mood];
                const total = moodHistory.length || 1;
                const pct = Math.round((count / total) * 100);
                
                let color = "bg-softBlue";
                if (mood === "Calm") color = "bg-mintGreen";
                if (mood === "Sad") color = "bg-indigo-400";
                if (mood === "Stressed") color = "bg-amber-400";
                if (mood === "Angry") color = "bg-rose-400";
                if (mood === "Excited") color = "bg-lavender-dark";

                return (
                  <div key={mood} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{mood}</span>
                      <span className="text-slate-400">{count} logs ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                      <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations shelf */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recommended Music */}
        <div className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Music className="h-5 w-5 text-softBlue" />
              <h3 className="text-lg font-bold font-outfit">Music Therapy Shelf</h3>
            </div>
            <Link href="/activities?tab=music" className="text-xs font-bold text-softBlue hover:underline">
              Listen All
            </Link>
          </div>

          <div className="space-y-3">
            {musicRecs.length > 0 ? (
              musicRecs.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-850 hover:bg-slate-100/50 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 bg-softBlue/10 text-softBlue rounded-xl flex items-center justify-center">
                      <Music className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold truncate max-w-[180px]">{track.title}</div>
                      <div className="text-[10px] text-slate-400">{track.artist}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold bg-softBlue/10 dark:bg-softBlue/25 text-softBlue px-2.5 py-1 rounded-full capitalize">
                    {track.moodType.toLowerCase()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No track recomendations found. Log mood to generate.</p>
            )}
          </div>
        </div>

        {/* Recommended Stories */}
        <div className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-lavender" />
              <h3 className="text-lg font-bold font-outfit">Therapeutic Stories</h3>
            </div>
            <Link href="/activities?tab=stories" className="text-xs font-bold text-softBlue hover:underline">
              Read All
            </Link>
          </div>

          <div className="space-y-3">
            {storyRecs.length > 0 ? (
              storyRecs.map((story) => (
                <div
                  key={story.id}
                  className="flex flex-col bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-850 hover:bg-slate-100/50 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold truncate max-w-[200px]">{story.title}</div>
                    <span className="text-[10px] font-semibold bg-lavender/25 text-lavender-dark dark:text-lavender px-2 py-0.5 rounded-full capitalize">
                      {story.category.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {story.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No story recommendations found. Log mood to generate.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
