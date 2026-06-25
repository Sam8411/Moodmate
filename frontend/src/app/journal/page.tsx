"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import {
  BookOpen,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Clock,
  Search,
  Tag,
  Sparkles,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function Journal() {
  const router = useRouter();
  const { user, loading: authLoading, updateUserPoints } = useAuth();
  
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [moodTag, setMoodTag] = useState("Neutral");
  const [category, setCategory] = useState("Daily"); // Gratitude, Goal, Daily
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Daily", "Gratitude", "Goal"];
  const moodTags = ["Happy", "Sad", "Stressed", "Angry", "Calm", "Excited", "Neutral"];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadJournals();
    }
  }, [user]);

  const loadJournals = async () => {
    setLoading(true);
    try {
      const data = await api.journal.list();
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedEntry(null);
    setTitle("");
    setContent("");
    setMoodTag("Neutral");
    setCategory("Daily");
    setIsEditing(true);
  };

  const handleSave = async (isDraft: boolean) => {
    if (!title.trim() || !content.trim()) return;

    try {
      const payload = {
        title,
        content: `[${category}] ${content}`, // prepend category
        moodTag,
        isDraft,
      };

      if (selectedEntry) {
        // Update
        const updated = await api.journal.update(selectedEntry.id, payload);
        setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        setSelectedEntry(updated);
      } else {
        // Create
        const created = await api.journal.create(payload);
        setEntries((prev) => [created, ...prev]);
        setSelectedEntry(created);
        if (!isDraft) {
          updateUserPoints(10); // Award journaling points
        }
      }
      setIsEditing(false);
      loadJournals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      await api.journal.delete(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectEntry = (entry: any) => {
    setSelectedEntry(entry);
    
    // Parse category prepended in content if exists
    let cleanContent = entry.content;
    let parsedCat = "Daily";
    if (entry.content.startsWith("[")) {
      const closeBracket = entry.content.indexOf("]");
      if (closeBracket !== -1) {
        parsedCat = entry.content.substring(1, closeBracket);
        cleanContent = entry.content.substring(closeBracket + 1).trim();
      }
    }

    setTitle(entry.title);
    setContent(cleanContent);
    setMoodTag(entry.moodTag);
    setCategory(parsedCat);
    setIsEditing(false);
  };

  const filteredEntries = entries.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-softBlue border-t-transparent mx-auto"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Opening your wellness journal shelf...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-4 h-[78vh]">
      {/* Left panel: List */}
      <div className="md:col-span-2 flex flex-col space-y-4 h-full border border-slate-100 dark:border-slate-800 glass-card rounded-[2rem] p-5 overflow-hidden text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold font-outfit">
            <BookOpen className="h-5 w-5 text-softBlue" />
            <span>Journal Logs</span>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center space-x-1 bg-softBlue text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-softBlue-dark shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Write</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search journals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-softBlue transition-all"
          />
        </div>

        {/* Entries stream */}
        <div className="flex-grow overflow-y-auto space-y-3 pr-1">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((e) => {
              const isDraft = e.isDraft;
              return (
                <div
                  key={e.id}
                  onClick={() => selectEntry(e)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative ${selectedEntry?.id === e.id ? "bg-softBlue/5 border-softBlue dark:bg-softBlue/10" : "bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-850 hover:bg-slate-100/50"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold truncate max-w-[150px]">{e.title}</h3>
                    {isDraft ? (
                      <span className="flex items-center space-x-0.5 text-[9px] font-semibold text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full">
                        <Clock className="h-3 w-3" />
                        <span>Draft</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-0.5 text-[9px] font-semibold text-mintGreen-dark bg-mintGreen-light dark:bg-mintGreen-dark/20 px-2 py-0.5 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        <span>Published</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(e.createdAt).toLocaleDateString()}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {e.content.startsWith("[") ? e.content.substring(e.content.indexOf("]") + 1).trim() : e.content}
                  </p>
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="text-[9px] font-bold bg-slate-200 dark:bg-slate-850 px-2.5 py-0.5 rounded-full text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {e.moodTag}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-slate-400 py-12 text-xs">
              No journal logs found. Add one!
            </div>
          )}
        </div>
      </div>

      {/* Right panel: Editor / View */}
      <div className="md:col-span-3 h-full border border-slate-100 dark:border-slate-800 glass-card rounded-[2rem] p-6 overflow-hidden flex flex-col justify-between text-left">
        {isEditing ? (
          <div className="flex-grow flex flex-col space-y-4 overflow-y-auto">
            <h3 className="text-base font-bold font-outfit">
              {selectedEntry ? "Edit Entry" : "Write Wellness Journal (+10 pts)"}
            </h3>

            {/* Title */}
            <input
              type="text"
              placeholder="Entry Title... e.g. 'Finding Peace Today'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-softBlue text-sm transition-all"
            />

            {/* Selects: Category and Mood */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category Tag</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat} Journal</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Feeling</label>
                <select
                  value={moodTag}
                  onChange={(e) => setMoodTag(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-xs focus:outline-none"
                >
                  {moodTags.map((mood) => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content */}
            <textarea
              placeholder="Write your logs, gratitude, or goals here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full flex-grow p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-softBlue text-sm transition-all resize-none"
            />

            {/* Controls */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => handleSave(true)}
                disabled={!title.trim() || !content.trim()}
                className="flex-grow rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 p-2.5 text-xs font-semibold transition-all flex items-center justify-center space-x-1.5"
              >
                <Clock className="h-4 w-4" />
                <span>Save Draft</span>
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={!title.trim() || !content.trim()}
                className="flex-grow rounded-xl bg-softBlue hover:bg-softBlue-dark text-white p-2.5 text-xs font-semibold shadow-sm transition-all flex items-center justify-center space-x-1.5"
              >
                <Save className="h-4 w-4" />
                <span>Publish Entry</span>
              </button>
            </div>
          </div>
        ) : selectedEntry ? (
          <div className="flex-grow flex flex-col justify-between h-full overflow-hidden">
            <div className="space-y-4 overflow-y-auto pr-1">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-outfit">{selectedEntry.title}</h2>
                  <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
                    <span className="font-semibold bg-softBlue/10 text-softBlue px-2 py-0.5 rounded-full capitalize">
                      {category} log
                    </span>
                    <span className="font-semibold bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {selectedEntry.moodTag}
                    </span>
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(selectedEntry.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2.5 rounded-xl border border-slate-250 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-slate-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selectedEntry.id)}
                    className="p-2.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-850 pt-4 text-slate-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {content}
              </div>
            </div>

            {/* Gratitude Prompts Fallback helper */}
            <div className="bg-gradient-to-tr from-lavender/10 to-softBlue/5 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 mt-4 text-[11px] text-slate-500 leading-normal flex items-start space-x-2.5">
              <Sparkles className="h-4.5 w-4.5 text-lavender-dark flex-shrink-0 mt-0.5" />
              <span>
                <strong>Gratitude Pro Tip:</strong> Writing down three small things that brought you peace or a smile today can immediately boost positive sentiment scores by up to 25%.
              </span>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-16 w-16 bg-softBlue/10 text-softBlue rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-base font-bold font-outfit">Open Your Wellness Diary</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select an entry from the list to view detailed logs, or create a new journal entry to write your thoughts.
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="rounded-xl bg-softBlue px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-softBlue-dark transition-all flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Write New Journal</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
