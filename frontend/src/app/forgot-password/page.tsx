"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { motion } from "framer-motion"; // Let's check, wait, Framer Motion imports "motion" from "framer-motion", not "react-frame-motion". I will fix that!
import { Mail, Lock, KeyRound, ArrowLeft, ShieldAlert } from "lucide-react";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP + New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const msg = await api.auth.forgotPassword(email);
      setSuccess("OTP sent! Check your Spring Boot server console output for the 6-digit code.");
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to request recovery code. Check your email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.auth.resetPassword({ email, otp, newPassword });
      setSuccess("Password has been successfully updated!");
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6 px-4">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-100 dark:border-slate-800 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-outfit">Reset Password</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {step === 1 ? "Enter your email to receive a recovery OTP" : "Enter the OTP printed in backend logs to reset"}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50 p-3 rounded-2xl text-xs text-rose-500 font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-mintGreen-light border border-mintGreen/30 dark:bg-mintGreen-dark/10 dark:border-mintGreen-dark/30 p-3 rounded-2xl text-xs text-mintGreen-dark font-medium">
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-softBlue py-3 text-sm font-semibold text-white shadow-md hover:bg-softBlue-dark disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Sending Code..." : "Send Reset Code"}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4 text-left">
            {/* OTP Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">6-Digit OTP</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 dark:bg-slate-900 bg-white/50 focus:outline-none focus:ring-2 focus:ring-softBlue text-sm font-semibold tracking-widest text-center transition-all"
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 dark:bg-slate-900 bg-white/50 focus:outline-none focus:ring-2 focus:ring-softBlue text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-softBlue py-3 text-sm font-semibold text-white shadow-md hover:bg-softBlue-dark disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Updating Password..." : "Update Password"}</span>
            </button>
          </form>
        )}

        <div className="flex items-center justify-center pt-2">
          <Link href="/login" className="flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
