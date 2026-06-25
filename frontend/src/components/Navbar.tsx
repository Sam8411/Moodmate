"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Menu, X, ShieldAlert, Award, LogOut, BrainCircuit } from "lucide-react";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", authRequired: true },
    { name: "Mood Analyzer", href: "/mood-detect", authRequired: true },
    { name: "AI Support Chat", href: "/chat", authRequired: true },
    { name: "Wellness Shelf", href: "/activities", authRequired: true },
    { name: "Gratitude Journal", href: "/journal", authRequired: true },
    { name: "Stress Relief Games", href: "/games", authRequired: true },
    { name: "Forum", href: "/forum", authRequired: true },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-softBlue to-lavender text-white shadow-md">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <span className="bg-gradient-to-r from-softBlue to-lavender-dark bg-clip-text text-transparent dark:from-softBlue-light dark:to-lavender">
                MoodMate AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => {
              if (link.authRequired && !user) return null;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-softBlue dark:text-slate-300 dark:hover:text-softBlue-light transition-colors"
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                {/* Admin dashboard indicator */}
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 rounded-full border border-rose-200 dark:border-rose-900 transition-all hover:scale-105"
                  >
                    <ShieldAlert className="h-4.5 w-4.5" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* Score */}
                <div className="flex items-center space-x-1.5 rounded-full bg-mintGreen-light dark:bg-mintGreen-dark/10 px-3 py-1.5 border border-mintGreen/30 text-mintGreen-dark font-semibold text-sm">
                  <Award className="h-4 w-4" />
                  <span>{user.points} pts</span>
                </div>

                {/* User Dropdown Profile */}
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-softBlue text-white font-bold shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold max-w-[100px] truncate leading-tight">{user.name}</span>
                    <span className="text-[10px] text-slate-400 truncate leading-none capitalize">{user.role.toLowerCase()}</span>
                  </div>
                  <button
                    onClick={logoutUser}
                    className="rounded-xl p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-softBlue dark:text-slate-300 transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-softBlue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-softBlue-dark hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2 text-slate-500 dark:text-slate-400"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-xl p-2 text-slate-600 dark:text-slate-300"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 border-t glass-panel animate-fadeIn">
          <div className="flex flex-col space-y-3 mt-2">
            {navLinks.map((link) => {
              if (link.authRequired && !user) return null;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-slate-700 hover:text-softBlue dark:text-slate-200"
                >
                  {link.name}
                </Link>
              );
            })}

            {user ? (
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-3 flex flex-col space-y-3">
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center space-x-2 text-rose-500 font-semibold text-sm"
                  >
                    <ShieldAlert className="h-5 w-5" />
                    <span>Admin Panel Dashboard</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-mintGreen" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{user.points} Wellness Points</span>
                </div>
                <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-softBlue text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logoutUser();
                      setMobileOpen(false);
                    }}
                    className="flex items-center space-x-1.5 text-sm font-medium text-rose-500"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-3 flex flex-col space-y-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center font-semibold text-slate-700 dark:text-slate-200 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-center font-semibold text-white bg-softBlue p-2.5 rounded-xl shadow-sm hover:bg-softBlue-dark"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
