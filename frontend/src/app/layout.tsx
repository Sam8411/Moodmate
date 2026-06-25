import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MoodMate AI – Your AI Companion for Mental Wellness",
  description: "Track emotions, improve mood, reduce stress, and build a healthier mind through personalized recommendations, journals, exercises, and games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <AuthProvider>
            {/* Ambient Background Lights */}
            <div className="glow-spot-1" />
            <div className="glow-spot-2" />
            <div className="glow-spot-3" />
            
            <div className="flex flex-col min-h-screen relative z-10">
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
