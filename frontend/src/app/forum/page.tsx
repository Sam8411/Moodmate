"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  Tag
} from "lucide-react";

type ForumPost = {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  date: string;
  replies: number;
};

export default function Forum() {
  const router = useRouter();
  const { user, loading: authLoading, updateUserPoints } = useAuth();
  
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = ["All", "General", "Anxiety Support", "Meditation Tips", "Inspiration"];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Initial mock forum topics
    setPosts([
      {
        id: 1,
        title: "How do you manage morning anxiety?",
        content: "I've been waking up with a heavy chest. What are some box-breathing routines or meditation tips that work for you?",
        category: "Anxiety Support",
        author: "CalmSeeker",
        date: "2026-06-22",
        replies: 12
      },
      {
        id: 2,
        title: "Loving the new Memory Match game!",
        content: "Cleared it in 18 moves today. It really helps divert my mind from work stressors. Highly recommended!",
        category: "General",
        author: "JoyfulPanda",
        date: "2026-06-21",
        replies: 5
      },
      {
        id: 3,
        title: "Daily positive affirmation thread",
        content: "Let's list one thing we are grateful for today. I am grateful for a quiet morning walk and hot herbal tea.",
        category: "Inspiration",
        author: "ZenWanderer",
        date: "2026-06-20",
        replies: 28
      }
    ]);
  }, []);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPost: ForumPost = {
      id: Date.now(),
      title,
      content,
      category,
      author: user?.name ? user.name.toString() : "Anonymous",
      date: new Date().toISOString().split("T")[0],
      replies: 0
    };

    setPosts((prev) => [newPost, ...prev]);
    setTitle("");
    setContent("");
    setCategory("General");
    setShowAddForm(false);
    updateUserPoints(8); // Award points for community interaction
  };

  const filteredPosts = activeCategory === "All"
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  if (authLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-softBlue border-t-transparent mx-auto"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Connecting to forum channels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-outfit">Community Forum</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Share advice, find support channels, and interact with fellow wellness seekers.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 rounded-2xl bg-softBlue text-white hover:bg-softBlue-dark shadow-sm text-xs font-semibold px-4 py-3"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Discussion Topic</span>
        </button>
      </div>

      {/* Write New Topic Form */}
      {showAddForm && (
        <form onSubmit={handleCreatePost} className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Post New Discussion (+8 pts)</h3>
          
          <input
            type="text"
            placeholder="Topic Title... e.g. 'Yoga routines for office breaks'"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 focus:outline-none text-sm transition-all"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs focus:outline-none"
          >
            {categories.slice(1).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <textarea
            placeholder="Write your discussion content here..."
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 focus:outline-none text-sm transition-all resize-none"
          />

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-xl border hover:bg-slate-50 px-5 py-2.5 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-softBlue text-white hover:bg-softBlue-dark px-5 py-2.5 text-xs font-semibold shadow-sm transition-all flex items-center space-x-1"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Post Topic</span>
            </button>
          </div>
        </form>
      )}

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Col: Channel filters */}
        <div className="lg:col-span-1 glass-card rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 h-fit space-y-4">
          <div className="flex items-center space-x-1.5 pb-2 pl-1 border-b border-slate-100 dark:border-slate-850">
            <Users className="h-5 w-5 text-softBlue" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-outfit">Wellness Channels</h3>
          </div>
          <div className="flex flex-col space-y-2 text-xs font-medium">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-left p-2.5 rounded-xl transition-all ${activeCategory === cat ? "bg-softBlue/10 text-softBlue" : "hover:bg-slate-50 dark:hover:bg-slate-900/50"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right Col: Posts Stream */}
        <div className="lg:col-span-3 space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100/30 transition-all text-left space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold font-outfit hover:text-softBlue cursor-pointer">{post.title}</h3>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-500">By {post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="font-semibold bg-lavender/25 text-lavender-dark px-2 py-0.5 rounded-full capitalize">
                      {post.category.toLowerCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-slate-400 text-xs font-semibold">
                  <MessageCircle className="h-4.5 w-4.5" />
                  <span>{post.replies} replies</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-light">
                {post.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
