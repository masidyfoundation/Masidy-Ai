import React, { useEffect, useRef } from "react";
import { Message } from "../types";
import Markdown from "react-markdown";
import { Sparkles, Compass, Search, Link2, HelpCircle, Terminal, Layers, Image, ArrowRight } from "lucide-react";

interface ChatPanelProps {
  messages: Message[];
  isThinking: boolean;
  onSendMessage: (msg: string) => void;
  showCredentialsModal: () => void;
}

export default function ChatPanel({ messages, isThinking, onSendMessage, showCredentialsModal }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom smoothly on content load
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Handle click on suggestions to immediately trigger
  const handleSuggestionClick = (text: string) => {
    onSendMessage(text);
  };

  return (
    <div className="flex-1 bg-white dark:bg-[#0c0c0e] overflow-y-auto px-4 py-6 md:py-10 flex flex-col justify-between scrollbar-none transition-colors duration-150">
      
      {/* 1. If no messages, render the gorgeous Masidy Welcome Landing Screen */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full space-y-10 select-none animate-fade-in my-auto pb-10">
          
          {/* Main big slogan */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-black dark:bg-zinc-100 text-white dark:text-black rounded-2xl flex items-center justify-center mx-auto shadow-md animate-pulse">
               <Sparkles className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h2 id="model-main-headline" className="text-3xl md:text-4xl font-semibold tracking-tight text-[#0d0d0d] dark:text-zinc-100 font-sans">
              How can I help you today?
            </h2>
            <p id="model-subtitle" className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
               A highly capable and elegant AI assistant ready to help you write, code, plan, and brainstorm.
            </p>
          </div>

          {/* Prompt Suggestion Cards (Fully styled matching standard chat models) */}
          <div id="prompts-suggestion-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto w-full pt-2">
            
            {/* 1. Email writing */}
            <button
              onClick={() => handleSuggestionClick("Draft a polite email requesting constructive feedback on a recent project design draft.")}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 hover:bg-neutral-50 dark:hover:bg-zinc-800/80 border border-neutral-200 dark:border-zinc-800 text-left transition-all duration-150 active:scale-[0.98] cursor-pointer group space-y-1 shadow-2xs"
            >
              <div className="text-xs font-bold text-neutral-800 dark:text-zinc-200 group-hover:text-amber-500 transition-colors flex items-center justify-between">
                <span>Write a professional email</span>
                <Compass className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500 group-hover:text-amber-500" />
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
                Draft messages to request feedback, pitch ideas, or coordinate group meetings politely.
              </p>
            </button>
 
            {/* 2. Complex explanations */}
            <button
              onClick={() => handleSuggestionClick("Explain how quantum computing works in simple terms that a school student can understand.")}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 hover:bg-neutral-50 dark:hover:bg-zinc-800/80 border border-neutral-200 dark:border-zinc-800 text-left transition-all duration-150 active:scale-[0.98] cursor-pointer group space-y-1 shadow-2xs"
            >
              <div className="text-xs font-bold text-neutral-800 dark:text-zinc-200 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                <span>Explain a complex concept</span>
                <Search className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500 group-hover:text-indigo-600" />
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
                Break down deep scientific, history, or technological topics into friendly summaries.
              </p>
            </button>
 
            {/* 3. Brainstorming */}
            <button
              onClick={() => handleSuggestionClick("Give me list of five creative and fun team-bonding exercises for small fully-remote teams.")}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 hover:bg-neutral-50 dark:hover:bg-zinc-800/80 border border-neutral-200 dark:border-zinc-800 text-left transition-all duration-150 active:scale-[0.98] cursor-pointer group space-y-1 shadow-2xs"
            >
              <div className="text-xs font-bold text-neutral-800 dark:text-zinc-200 group-hover:text-emerald-600 transition-colors flex items-center justify-between">
                <span>Brainstorm creative ideas</span>
                <Terminal className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500 group-hover:text-emerald-500" />
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
                Generate outlines, campaign strategies, or interactive exercises for team members.
              </p>
            </button>
 
            {/* 4. Code debugging */}
            <button
              onClick={() => handleSuggestionClick("Find the bug in this async Javascript function that repeatedly returns undefined values.")}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 hover:bg-neutral-50 dark:hover:bg-zinc-800/80 border border-neutral-200 dark:border-zinc-800 text-left transition-all duration-150 active:scale-[0.98] cursor-pointer group space-y-1 shadow-2xs"
            >
              <div className="text-xs font-bold text-neutral-800 dark:text-zinc-200 group-hover:text-sky-600 transition-colors flex items-center justify-between">
                <span>Debug source code</span>
                <Layers className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500 group-hover:text-sky-500" />
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
                Troubleshoot exceptions, optimization errors, and syntax issues in multiple programming frameworks.
              </p>
            </button>
 
          </div>
 
          {/* Quick tips notice */}
          <div className="text-center pt-2 select-none">
             <span id="model-tips-badge" className="inline-flex items-center space-x-1 py-1 px-3 bg-[#f4f4f4] dark:bg-zinc-900 rounded-full text-[10px] font-bold text-zinc-500 dark:text-zinc-400 border border-neutral-150 dark:border-zinc-800">
                <span>Tip: You can personalize your assistant's response style in System Settings</span>
             </span>
          </div>

        </div>
      ) : (
        /* 2. Conversation Flow Renderer */
        <div className="max-w-3xl mx-auto w-full space-y-8 flex-1 pb-16">
          {messages.map((m) => {
            const isUser = m.role === "user";
            
            return (
              <div
                key={m.id}
                className={`flex space-x-4 items-start ${isUser ? "justify-end" : "justify-start"}`}
              >
                {/* AI Avatar Symbol (Masidy branded) */}
                {!isUser && (
                  <div className="w-9 h-9 rounded-full bg-black dark:bg-zinc-100 text-white dark:text-black flex items-center justify-center font-bold text-sm shrink-0 select-none shadow-xs border border-neutral-800 dark:border-zinc-700 mt-1">
                    <Sparkles className="w-4 h-4 text-white dark:text-black" />
                  </div>
                )}

                {/* Message Bubble Block */}
                <div className={`flex flex-col max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                  
                  {/* Bubble body with light theme exact colors */}
                  <div
                    className={`px-4.5 py-3 rounded-2xl shadow-none transition-colors duration-150 ${
                      isUser
                        ? "bg-[#f4f4f4] dark:bg-zinc-800 text-[#0d0d0d] dark:text-zinc-100 rounded-tr-sm hover:bg-[#eaeaea] dark:hover:bg-zinc-750"
                        : "bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-105 rounded-tl-sm border border-transparent dark:border-zinc-800/65 prose dark:prose-invert max-w-none"
                    }`}
                  >
                    {isUser ? (
                      <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap select-all font-sans font-normal">
                        {m.content}
                      </p>
                    ) : (
                      <div className="markdown-body text-[14.5px] text-neutral-900 dark:text-zinc-100 leading-relaxed font-sans max-w-none prose dark:prose-invert select-text">
                        <Markdown>{m.content}</Markdown>
                      </div>
                    )}
                  </div>

                  {/* Tiny timestamp element */}
                  {m.created_at && (
                    <span className="text-[10px] text-zinc-400 mt-1.5 px-2 font-sans tracking-tight select-none">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}

                </div>

                {/* User Avatar Symbol */}
                {isUser && (
                  <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-zinc-800 text-neutral-700 dark:text-zinc-300 flex items-center justify-center text-xs font-bold shrink-0 select-none mt-1 uppercase border border-neutral-300 dark:border-zinc-700">
                    U
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Thinking Wait Loader Indicator */}
      {isThinking && (
        <div className="max-w-3xl mx-auto w-full flex space-x-4 items-start pb-8">
          <div className="w-9 h-9 rounded-full bg-black dark:bg-zinc-100 text-white dark:text-black flex items-center justify-center shrink-0 select-none font-bold animate-pulse mt-1">
             <Sparkles className="w-4 h-4 text-white dark:text-black animate-spin" />
          </div>
          <div className="flex flex-col space-y-1">
            <div className="bg-[#f4f4f4]/60 dark:bg-zinc-900/60 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center space-x-1.5 shadow-none">
              <span className="w-1.5 h-1.5 bg-neutral-500 dark:bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 bg-neutral-500 dark:bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 bg-neutral-500 dark:bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              <span className="text-xs text-neutral-555 dark:text-zinc-400 font-semibold pl-1 font-sans">Masidy is thinking...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={scrollRef} />
    </div>
  );
}
