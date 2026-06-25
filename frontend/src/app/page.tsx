"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  Brain,
  MessageSquare,
  BookOpen,
  Music,
  Smile,
  Activity,
  HeartHandshake,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Star
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      title: "AI Mood Analyzer",
      description: "Analyze emotional states through text sentiment, voice patterns, and webcam expressions.",
      icon: Brain,
      color: "bg-softBlue/10 text-softBlue dark:bg-softBlue/20"
    },
    {
      title: "AI Support Chat",
      description: "24/7 empathetic assistant for emotional support, daily checks, and personalized feedback.",
      icon: MessageSquare,
      color: "bg-lavender/10 text-lavender-dark dark:bg-lavender/20 dark:text-lavender"
    },
    {
      title: "Digital Diary Journal",
      description: "Document daily events, log gratitudes, goals, and track weekly sentiment trends.",
      icon: BookOpen,
      color: "bg-mintGreen/10 text-mintGreen-dark dark:bg-mintGreen/20 dark:text-mintGreen"
    },
    {
      title: "Music Therapy Stream",
      description: "Enjoy soundscapes, nature sounds, energetic boosts, and classical solace selected for your mood.",
      icon: Music,
      color: "bg-softBlue/10 text-softBlue dark:bg-softBlue/20"
    },
    {
      title: "Mindfulness Exercises",
      description: "Stabilize stress with timed box-breathing templates, body scans, and guide videos.",
      icon: Activity,
      color: "bg-mintGreen/10 text-mintGreen-dark dark:bg-mintGreen/20 dark:text-mintGreen"
    },
    {
      title: "Stress Relief Games",
      description: "Play cognitive matches, relaxing clicking balloons, and focus challenges designed to soothe.",
      icon: Smile,
      color: "bg-lavender/10 text-lavender-dark dark:bg-lavender/20 dark:text-lavender"
    }
  ];

  const statistics = [
    { value: "45K+", label: "Active Mindful Users", icon: Users },
    { value: "320K+", label: "Journals Documented", icon: BookOpen },
    { value: "1.2M+", label: "Mindfulness Audios Played", icon: Music },
    { value: "98.4%", label: "Satisfaction Sentiment", icon: Smile }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Jenkins",
      role: "Clinical Psychologist",
      content: "MoodMate AI integrates CBT journaling principles and mindfulness tools into a beautifully cohesive interface. It's a wonderful daily support companion.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Software Designer",
      content: "The breathing bubble and memory games are my go-to stressors during work. The mood tracking has helped me notice and fix burnout triggers.",
      rating: 5
    },
    {
      name: "Sophia Rodriguez",
      role: "University Student",
      content: "Being able to chat with an empathetic AI at 2 AM when my anxiety kicks in is incredibly comforting. The music recommendations are lovely.",
      rating: 5
    }
  ];

  return (
    <div className="flex flex-col space-y-24 py-6">
      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-16 px-4 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-4xl"
        >
          <div className="inline-flex items-center space-x-2 rounded-full bg-softBlue/10 dark:bg-softBlue/20 border border-softBlue/20 px-4 py-1.5 text-xs font-semibold text-softBlue dark:text-softBlue-light">
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>Premium Full-Stack Wellness Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight md:text-7xl font-outfit">
            Your AI Companion for <br />
            <span className="bg-gradient-to-r from-softBlue via-lavender to-mintGreen bg-clip-text text-transparent">
              Mental Wellness
            </span>
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto md:text-xl font-light leading-relaxed">
            Track emotions, improve mood, reduce stress, and build a healthier mind through personalized suggestions, journals, activities, and games.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={user ? "/dashboard" : "/register"}
              className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-softBlue to-lavender px-8 py-4 text-base font-bold text-white shadow-lg hover:shadow-softBlue/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-8 py-4 text-base font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
            >
              <span>Learn More</span>
            </Link>
          </div>

          {/* Secure Trust Stamp */}
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 pt-6">
            <ShieldCheck className="h-4.5 w-4.5 text-mintGreen" />
            <span>Enterprise-Grade Encryption & HIPAA Compliance Compliant Security</span>
          </div>
        </motion.div>
      </section>

      {/* 2. Features Grid */}
      <section id="features" className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold font-outfit">Therapeutic Features</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Discover a comprehensive toolbox of AI intelligence and physical wellness activities tailored to your immediate feelings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-3xl p-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col space-y-4 text-left group"
            >
              <div className={`p-3 rounded-2xl w-fit ${feature.color} transition-all group-hover:scale-110`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Statistics Section */}
      <section className="glass-panel border rounded-[2rem] p-12 text-center relative overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {statistics.map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-2xl bg-softBlue/5 dark:bg-softBlue/10 text-softBlue mb-2">
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-3xl md:text-5xl font-extrabold font-outfit tracking-tight bg-gradient-to-r from-softBlue to-lavender-dark bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Professional Testimonials */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold font-outfit">Loved by Users & Doctors</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
            Read stories from individuals who have successfully integrated MoodMate into their routines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="glass-card rounded-3xl p-6 flex flex-col justify-between space-y-4 text-left border border-slate-100 dark:border-slate-800"
            >
              <div className="space-y-3">
                {/* Stars */}
                <div className="flex space-x-1 text-amber-400">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="h-4.5 w-4.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex flex-col">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t.name}</span>
                <span className="text-xs text-slate-400">{t.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="relative text-center py-12 rounded-[2rem] bg-gradient-to-tr from-softBlue/10 via-lavender/5 to-mintGreen/10 border border-slate-200/50 dark:border-slate-900/30 overflow-hidden px-6">
        <div className="space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold font-outfit">Ready to Nurture Your Mind?</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm md:text-base font-light">
            Join thousands tracking their wellness metrics. Start understanding your emotional habits and build a calmer, happier lifestyle today.
          </p>
          <div className="pt-2">
            <Link
              href={user ? "/dashboard" : "/register"}
              className="inline-flex rounded-2xl bg-softBlue px-8 py-4 text-base font-bold text-white shadow-md hover:bg-softBlue-dark hover:scale-[1.02] active:scale-[0.98] transition-all space-x-2 items-center"
            >
              <span>Get Started Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
