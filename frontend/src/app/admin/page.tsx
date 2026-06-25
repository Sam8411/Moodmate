"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import {
  ShieldAlert,
  Users,
  Music,
  BookOpen,
  Activity,
  Plus,
  Trash2,
  Lock,
  Loader2,
  TrendingUp,
  BarChart,
  CheckCircle2
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [stats, setStats] = useState<any | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<"stats" | "users" | "add-content">("stats");

  // Add Content form states
  const [contentType, setContentType] = useState<"music" | "story" | "exercise">("music");
  const [musicForm, setMusicForm] = useState({ title: "", artist: "", category: "Lo-Fi Beats", moodType: "Calm", audioUrl: "" });
  const [storyForm, setStoryForm] = useState({ title: "", content: "", category: "Motivation", moodType: "Calm" });
  const [exerciseForm, setExerciseForm] = useState({ title: "", description: "", duration: 180, category: "Breathing" });

  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "ADMIN") {
        // Redirect standard users from admin console
        router.push("/dashboard");
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      loadAdminDetails();
    }
  }, [user]);

  const loadAdminDetails = async () => {
    setLoading(true);
    try {
      const statsData = await api.admin.stats();
      setStats(statsData);

      const usersData = await api.admin.users();
      setUsersList(usersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.admin.deleteUser(id);
      setUsersList((prev) => prev.filter((u) => u.id !== id));
      setFeedback("User deleted successfully.");
      setTimeout(() => setFeedback(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.addMusic(musicForm);
      setFeedback("Music track added successfully to recommendation library!");
      setMusicForm({ title: "", artist: "", category: "Lo-Fi Beats", moodType: "Calm", audioUrl: "" });
      loadAdminDetails();
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.addStory(storyForm);
      setFeedback("Therapeutic story added successfully!");
      setStoryForm({ title: "", content: "", category: "Motivation", moodType: "Calm" });
      loadAdminDetails();
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.addExercise(exerciseForm);
      setFeedback("Mindfulness exercise timer added successfully!");
      setExerciseForm({ title: "", description: "", duration: 180, category: "Breathing" });
      loadAdminDetails();
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-softBlue border-t-transparent mx-auto"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  // Security guard
  if (user?.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 max-w-sm mx-auto space-y-4">
        <Lock className="h-12 w-12 text-rose-500" />
        <h2 className="text-lg font-bold font-outfit">Unauthorized Access</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          You do not have permission to view the administrator controls panel. Re-verify your credentials or sign in as an Admin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 text-left">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-3.5 py-1.5 rounded-full border border-rose-250 dark:border-rose-900 w-fit text-xs font-semibold">
          <ShieldAlert className="h-4.5 w-4.5" />
          <span>System Administration Dashboard</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-outfit">MoodMate AI Admin</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage user logs, review platform usage growth stats, and modify wellness content recommendations libraries.
        </p>
      </div>

      {feedback && (
        <div className="bg-mintGreen-light border border-mintGreen/30 text-mintGreen-dark p-3.5 rounded-2xl text-xs font-bold flex items-center space-x-2 w-fit">
          <CheckCircle2 className="h-4.5 w-4.5" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Admin Subtabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-sm">
        <button
          onClick={() => setActiveSubTab("stats")}
          className={`pb-3 font-semibold transition-all flex items-center space-x-1.5 ${activeSubTab === "stats" ? "border-b-2 border-softBlue text-softBlue" : "text-slate-400 hover:text-slate-600"}`}
        >
          <TrendingUp className="h-4.5 w-4.5" />
          <span>Platform Stats</span>
        </button>
        <button
          onClick={() => setActiveSubTab("users")}
          className={`pb-3 font-semibold transition-all flex items-center space-x-1.5 ${activeSubTab === "users" ? "border-b-2 border-softBlue text-softBlue" : "text-slate-400 hover:text-slate-600"}`}
        >
          <Users className="h-4.5 w-4.5" />
          <span>User Accounts</span>
        </button>
        <button
          onClick={() => setActiveSubTab("add-content")}
          className={`pb-3 font-semibold transition-all flex items-center space-x-1.5 ${activeSubTab === "add-content" ? "border-b-2 border-softBlue text-softBlue" : "text-slate-400 hover:text-slate-600"}`}
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Library Content</span>
        </button>
      </div>

      {/* SUBTAB WINDOWS */}
      {/* 1. STATS */}
      {activeSubTab === "stats" && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-100 dark:border-slate-850">
            <Users className="h-6 w-6 text-softBlue mb-4" />
            <div className="text-xs text-slate-400">Total Registered Users</div>
            <div className="text-3xl font-extrabold font-outfit mt-1">{stats.totalUsers}</div>
          </div>
          <div className="glass-card rounded-3xl p-6 border border-slate-100 dark:border-slate-850">
            <BookOpen className="h-6 w-6 text-mintGreen mb-4" />
            <div className="text-xs text-slate-400">Diary Entries Written</div>
            <div className="text-3xl font-extrabold font-outfit mt-1">{stats.totalJournals}</div>
          </div>
          <div className="glass-card rounded-3xl p-6 border border-slate-100 dark:border-slate-850">
            <Activity className="h-6 w-6 text-lavender-dark mb-4" />
            <div className="text-xs text-slate-400">Sentiment Logs Scanned</div>
            <div className="text-3xl font-extrabold font-outfit mt-1">{stats.totalMoodRecords}</div>
          </div>
          <div className="glass-card rounded-3xl p-6 border border-slate-100 dark:border-slate-850">
            <ShieldAlert className="h-6 w-6 text-rose-500 mb-4" />
            <div className="text-xs text-slate-400">Relaxation Games Played</div>
            <div className="text-3xl font-extrabold font-outfit mt-1">{stats.totalGamesPlayed}</div>
          </div>
        </div>
      )}

      {/* 2. USERS MANAGEMENT */}
      {activeSubTab === "users" && (
        <div className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 overflow-hidden">
          <h3 className="text-base font-bold font-outfit mb-4">Platform Users Listing</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Points</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((usr) => (
                  <tr key={usr.id} className="border-b border-slate-50 dark:border-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                    <td className="py-3.5 px-4 font-semibold text-slate-400">#{usr.id}</td>
                    <td className="py-3.5 px-4 font-bold">{usr.name}</td>
                    <td className="py-3.5 px-4 text-slate-500">{usr.email}</td>
                    <td className="py-3.5 px-4"><span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-850 rounded-full font-bold text-[10px] uppercase">{usr.role}</span></td>
                    <td className="py-3.5 px-4 text-softBlue font-extrabold">{usr.points}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDeleteUser(usr.id)}
                        disabled={usr.id === user.id} // prevent self delete
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 disabled:opacity-30"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ADD CONTENT FORM */}
      {activeSubTab === "add-content" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Subtab selection sidebar */}
          <div className="lg:col-span-1 glass-card rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 h-fit space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Library Target</h4>
            <div className="flex flex-col space-y-2 text-xs font-semibold">
              <button
                onClick={() => setContentType("music")}
                className={`text-left p-2.5 rounded-xl transition-all flex items-center space-x-1.5 ${contentType === "music" ? "bg-softBlue/10 text-softBlue" : "hover:bg-slate-50 dark:hover:bg-slate-900/50"}`}
              >
                <Music className="h-4 w-4" />
                <span>Music Recommendation</span>
              </button>
              <button
                onClick={() => setContentType("story")}
                className={`text-left p-2.5 rounded-xl transition-all flex items-center space-x-1.5 ${contentType === "story" ? "bg-softBlue/10 text-softBlue" : "hover:bg-slate-50 dark:hover:bg-slate-900/50"}`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Story Therapy</span>
              </button>
              <button
                onClick={() => setContentType("exercise")}
                className={`text-left p-2.5 rounded-xl transition-all flex items-center space-x-1.5 ${contentType === "exercise" ? "bg-softBlue/10 text-softBlue" : "hover:bg-slate-50 dark:hover:bg-slate-900/50"}`}
              >
                <Activity className="h-4 w-4" />
                <span>Mindfulness Routine</span>
              </button>
            </div>
          </div>

          {/* Form body */}
          <div className="lg:col-span-3 glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800">
            {contentType === "music" && (
              <form onSubmit={handleAddMusic} className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Add Music Recommendation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Track Title"
                    required
                    value={musicForm.title}
                    onChange={(e) => setMusicForm({ ...musicForm, title: e.target.value })}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Artist Name"
                    required
                    value={musicForm.artist}
                    onChange={(e) => setMusicForm({ ...musicForm, artist: e.target.value })}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs focus:outline-none"
                  />
                  <select
                    value={musicForm.moodType}
                    onChange={(e) => setMusicForm({ ...musicForm, moodType: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs"
                  >
                    {["Happy", "Sad", "Stressed", "Angry", "Calm", "Excited"].map((mood) => (
                      <option key={mood} value={mood}>{mood} Mood</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Audio URL Link (mp3)"
                    required
                    value={musicForm.audioUrl}
                    onChange={(e) => setMusicForm({ ...musicForm, audioUrl: e.target.value })}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-softBlue text-white text-xs font-semibold px-6 py-2.5 hover:bg-softBlue-dark"
                >
                  Save Track
                </button>
              </form>
            )}

            {contentType === "story" && (
              <form onSubmit={handleAddStory} className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Add Therapeutic Story</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Story Title"
                    required
                    value={storyForm.title}
                    onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs focus:outline-none"
                  />
                  <select
                    value={storyForm.category}
                    onChange={(e) => setStoryForm({ ...storyForm, category: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs"
                  >
                    {["Motivation", "Success", "Self Confidence", "Depression Recovery", "Positive Thinking", "Inspiration"].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <select
                  value={storyForm.moodType}
                  onChange={(e) => setStoryForm({ ...storyForm, moodType: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs"
                >
                  {["Happy", "Sad", "Stressed", "Angry", "Calm", "Excited"].map((mood) => (
                    <option key={mood} value={mood}>{mood} Target</option>
                  ))}
                </select>
                <textarea
                  placeholder="Story content paragraphs..."
                  required
                  value={storyForm.content}
                  onChange={(e) => setStoryForm({ ...storyForm, content: e.target.value })}
                  rows={5}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-softBlue text-white text-xs font-semibold px-6 py-2.5 hover:bg-softBlue-dark"
                >
                  Save Story
                </button>
              </form>
            )}

            {contentType === "exercise" && (
              <form onSubmit={handleAddExercise} className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Add Mindfulness Exercise Routine</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Routine Title"
                    required
                    value={exerciseForm.title}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, title: e.target.value })}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Timer Duration (seconds)"
                    required
                    value={exerciseForm.duration}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, duration: parseInt(e.target.value) || 0 })}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs focus:outline-none"
                  />
                </div>
                <select
                  value={exerciseForm.category}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs"
                >
                  {["Breathing", "Yoga", "Meditation"].map((cat) => (
                    <option key={cat} value={cat}>{cat} Category</option>
                  ))}
                </select>
                <textarea
                  placeholder="Steps instructions..."
                  required
                  value={exerciseForm.description}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, description: e.target.value })}
                  rows={4}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-softBlue text-white text-xs font-semibold px-6 py-2.5 hover:bg-softBlue-dark"
                >
                  Save Exercise
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
