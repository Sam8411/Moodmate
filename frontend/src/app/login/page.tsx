"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const { user, loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.auth.login({ email, password });
      loginUser(res, res.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      // Simulate Google token verification
      const mockGoogleToken = "google_token_" + Math.random().toString(36).substring(7);
      const res = await api.auth.googleLogin(mockGoogleToken);
      loginUser(res, res.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google connection failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-100 dark:border-slate-800 text-center space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-outfit">Welcome Back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Log in to continue your mental wellness journey
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50 p-3 rounded-2xl text-xs text-rose-500 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 dark:bg-slate-900 bg-white/50 focus:outline-none focus:ring-2 focus:ring-softBlue text-sm transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              <Link href="/forgot-password" className="text-xs font-medium text-softBlue hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 dark:bg-slate-900 bg-white/50 focus:outline-none focus:ring-2 focus:ring-softBlue text-sm transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-2xl bg-softBlue py-3 text-sm font-semibold text-white shadow-md hover:bg-softBlue-dark disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="h-4.5 w-4.5" />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-850"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-wider font-semibold">Or</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-850"></div>
        </div>

        {/* Google Login button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-3 text-sm font-semibold hover:bg-slate-50 transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="h-4.5 w-4.5 text-lavender-dark" />
          <span>{googleLoading ? "Connecting Google..." : "Sign In with Google"}</span>
        </button>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-softBlue hover:underline">
            Sign up for free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
