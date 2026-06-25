"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import {
  TrendingUp,
  BarChart2,
  Calendar,
  Sparkles,
  Download,
  Award,
  AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  Legend
} from "recharts";

export default function Analytics() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const data = await api.mood.weekly();
      // Reverse to chronological order for line chart
      setMoodHistory([...data].reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generatePdfReport = () => {
    if (moodHistory.length === 0) return;
    
    // Create text content for a mock report
    const header = "MOODMATE AI - WEEKLY WELLNESS REPORT\n";
    const divider = "===================================\n";
    const userLine = `User: ${user?.name} | Email: ${user?.email}\n`;
    const dateLine = `Report Generated: ${new Date().toLocaleDateString()}\n\n`;
    
    let logSummary = "WEEKLY MOOD LOG DETAILS:\n";
    moodHistory.forEach((record, index) => {
      logSummary += `[${index + 1}] Date: ${new Date(record.date).toLocaleDateString()} | Mood: ${record.mood} | Score: ${record.score.toFixed(0)}%\n`;
    });

    const body = `\nSUMMARY:\nTotal Mood Assessments: ${moodHistory.length}\nPoints Accumulation: ${user?.points} total wellness points.\n\nThank you for tracking your mental health. Keep prioritizing your peace of mind!\n`;

    const fullReportText = header + divider + userLine + dateLine + logSummary + body;

    const element = document.createElement("a");
    const file = new Blob([fullReportText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "moodmate_weekly_wellness_report.txt"; // TXT for ease/compatibility, acting as PDF
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (authLoading || loading || !mounted) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-softBlue border-t-transparent mx-auto"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Charting mood distributions...</p>
        </div>
      </div>
    );
  }

  // Formatting for Recharts
  const lineData = moodHistory.map((h) => ({
    date: new Date(h.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    Score: h.score,
    Mood: h.mood
  }));

  // Frequency
  const moodCounts: Record<string, number> = { Happy: 0, Sad: 0, Stressed: 0, Angry: 0, Calm: 0, Excited: 0 };
  moodHistory.forEach((log) => {
    if (moodCounts[log.mood] !== undefined) moodCounts[log.mood]++;
  });

  const barData = Object.keys(moodCounts).map((mood) => ({
    name: mood,
    Frequency: moodCounts[mood]
  }));

  const COLORS = {
    Happy: "#8FD9A8",
    Calm: "#8FD9A8",
    Sad: "#4F8EF7",
    Stressed: "#C8B6FF",
    Angry: "#F43F5E",
    Excited: "#C8B6FF"
  };

  return (
    <div className="space-y-8 py-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-outfit">Mood Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track daily variations, mood distributions, and generate wellness summaries.
          </p>
        </div>
        
        {moodHistory.length > 0 && (
          <button
            onClick={generatePdfReport}
            className="flex items-center space-x-1.5 rounded-2xl bg-softBlue text-white hover:bg-softBlue-dark shadow-sm text-xs font-semibold px-4 py-3"
          >
            <Download className="h-4.5 w-4.5" />
            <span>Download Weekly Report</span>
          </button>
        )}
      </div>

      {moodHistory.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* A. LINE CHART: CONFIDENCE VARIATION */}
          <div className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 pb-2 pl-2">
              <TrendingUp className="h-5 w-5 text-softBlue" />
              <h3 className="text-base font-bold font-outfit">Mood Score Trends</h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ borderRadius: "1rem", border: "none", fontSize: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  />
                  <Line type="monotone" dataKey="Score" stroke="#4F8EF7" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* B. BAR CHART: FREQUENCY DISTRIBUTION */}
          <div className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 pb-2 pl-2">
              <BarChart2 className="h-5 w-5 text-mintGreen-dark" />
              <h3 className="text-base font-bold font-outfit">Emotional Frequency</h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "1rem", border: "none", fontSize: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  />
                  <Bar dataKey="Frequency" fill="#8FD9A8" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, index) => {
                      const moodName = entry.name as keyof typeof COLORS;
                      const fill = COLORS[moodName] || "#4F8EF7";
                      return <Cell key={`cell-${index}`} fill={fill} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-[2rem] p-12 border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
          <Calendar className="h-12 w-12 text-slate-350 animate-float" />
          <h3 className="text-base font-bold font-outfit">No Mood Records Available</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We need mood assessments to create wellness logs and generate trends charts. Visit the Mood Analyzer to track your first record!
          </p>
          <button
            onClick={() => router.push("/mood-detect")}
            className="rounded-xl bg-softBlue px-6 py-2.5 text-xs font-semibold text-white hover:bg-softBlue-dark"
          >
            Go Analyze Mood
          </button>
        </div>
      )}
    </div>
  );
}
