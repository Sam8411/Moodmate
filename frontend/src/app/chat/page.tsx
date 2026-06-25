"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Send, Loader2, Smile, ArrowRight, BrainCircuit, User } from "lucide-react";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
};

export default function Chat() {
  const router = useRouter();
  const { user, loading: authLoading, updateUserPoints } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const starterChips = [
    "I'm feeling very anxious today",
    "Can you suggest a breathing exercise?",
    "Give me an inspiring motivational quote",
    "I had a stressful day at work"
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    setChatLoading(true);
    try {
      const history = await api.chat.history();
      const formatted = history.flatMap((chat, index) => [
        { id: index * 2, sender: "user" as const, text: chat.message, timestamp: chat.timestamp },
        { id: index * 2 + 1, sender: "bot" as const, text: chat.response, timestamp: chat.timestamp }
      ]);
      
      if (formatted.length === 0) {
        // Welcome message if chat history is blank
        setMessages([
          {
            id: 0,
            sender: "bot",
            text: "Hello! I'm MoodMate, your digital companion for mental wellness. How are you feeling today? Tell me what's on your mind, I'm here to support you 24/7.",
            timestamp: new Date().toISOString()
          }
        ]);
      } else {
        setMessages(formatted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message locally
    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      // Send to API
      const res = await api.chat.send(textToSend);
      
      const botMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: res.response,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, botMsg]);
      updateUserPoints(2); // Earn points for wellness chat engagement
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: "I'm having trouble connecting right now, but please take a deep breath. I am still here with you.",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  if (authLoading || chatLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-softBlue border-t-transparent mx-auto"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading conversation history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[75vh] flex flex-col justify-between border border-slate-100 dark:border-slate-800 glass-card rounded-[2rem] overflow-hidden text-left relative">
      {/* Chat header */}
      <div className="border-b border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between bg-white/50 dark:bg-slate-900/30">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-softBlue to-lavender flex items-center justify-center text-white">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-bold font-outfit">MoodMate AI Support</div>
            <div className="text-[10px] text-mintGreen-dark dark:text-mintGreen font-semibold animate-pulse flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-mintGreen-dark dark:bg-mintGreen animate-ping" />
              <span>Empathy Assistant Online (+2 pts/msg)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages stream */}
      <div className="flex-grow p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div className={`flex space-x-2 max-w-[75%] ${isUser ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold ${isUser ? "bg-softBlue text-white" : "bg-lavender text-slate-900"}`}>
                  {isUser ? <User className="h-4 w-4" /> : <BrainCircuit className="h-4 w-4" />}
                </div>
                <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed ${isUser ? "bg-softBlue text-white rounded-tr-none" : "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-850"}`}>
                  <p>{msg.text}</p>
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="flex space-x-2 items-center">
              <div className="h-8 w-8 rounded-full bg-lavender text-slate-900 flex items-center justify-center">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-3xl border border-slate-150 dark:border-slate-800 flex items-center space-x-1.5 text-xs text-slate-400">
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>MoodMate is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick suggestions & Message Input */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-white/50 dark:bg-slate-900/30 space-y-4">
        {/* Suggestion Chips */}
        {messages.length <= 2 && !loading && (
          <div className="flex flex-wrap gap-2">
            {starterChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendMessage(chip)}
                className="text-[10px] md:text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-500 hover:text-slate-800"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input box */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tell me how you are feeling... e.g. 'I feel a bit sad today'"
            className="flex-grow p-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-softBlue text-sm transition-all"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="p-3 rounded-2xl bg-softBlue text-white hover:bg-softBlue-dark shadow-sm hover:scale-105 disabled:opacity-50 transition-all flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
