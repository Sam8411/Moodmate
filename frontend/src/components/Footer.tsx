"use client";

import Link from "next/link";
import { BrainCircuit, Heart, AlertOctagon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-950/40 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="flex flex-col space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 text-xl font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-softBlue to-lavender text-white">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-softBlue to-lavender-dark bg-clip-text text-transparent dark:from-softBlue-light dark:to-lavender">
                MoodMate AI
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Your intelligent mental wellness companion. Empowering you to understand your emotional states, build resilience, and discover personalized activities.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Features</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/mood-detect" className="text-slate-500 hover:text-softBlue dark:text-slate-400 dark:hover:text-softBlue-light">
                  Mood Detection
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-slate-500 hover:text-softBlue dark:text-slate-400 dark:hover:text-softBlue-light">
                  Wellness Chatbot
                </Link>
              </li>
              <li>
                <Link href="/journal" className="text-slate-500 hover:text-softBlue dark:text-slate-400 dark:hover:text-softBlue-light">
                  Digital Journal
                </Link>
              </li>
              <li>
                <Link href="/games" className="text-slate-500 hover:text-softBlue dark:text-slate-400 dark:hover:text-softBlue-light">
                  Relaxation Games
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Resources & Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <span className="text-slate-400 cursor-not-allowed">Helpline Directory</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Terms of Use</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Contact Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Alert */}
        <div className="mt-10 rounded-2xl bg-amber-50/50 p-4 border border-amber-200/50 dark:bg-amber-950/10 dark:border-amber-900/30 flex items-start space-x-3">
          <AlertOctagon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <strong>Disclaimer:</strong> MoodMate AI is a support tool and does not provide professional medical diagnosis, treatment, or therapy. It is not a crisis helpline. If you are experiencing an emotional emergency or thinking about self-harm, please contact your local emergency services or dial 988 immediately.
          </p>
        </div>

        {/* Bottom Panel */}
        <div className="mt-10 border-t border-slate-200/60 dark:border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} MoodMate AI Inc. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>for mental wellness.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
