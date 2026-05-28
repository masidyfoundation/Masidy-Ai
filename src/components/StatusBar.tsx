import React, { useState, useRef, useEffect } from "react";
import { Sparkles, ChevronDown, RotateCcw, ShieldCheck, HelpCircle, Key, Activity, Menu } from "lucide-react";
import { MasidyModel } from "../types";

interface StatusBarProps {
  status: "ONLINE" | "THINKING" | "RESEARCHING" | "OFFLINE";
  onClearChat: () => void;
  hasMessages: boolean;
  showCredentialsModal: () => void;
  activePlan: string;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  selectedModel?: string;
  availableModels?: MasidyModel[];
  onModelChange?: (modelId: string) => void;
}

export default function StatusBar({ 
  status, 
  onClearChat, 
  hasMessages, 
  showCredentialsModal,
  activePlan,
  isSidebarCollapsed,
  onToggleSidebar,
  selectedModel = "masidy-pro",
  availableModels = [],
  onModelChange
}: StatusBarProps) {
  const [modelDropdown, setModelDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelDropdown(false);
      }
    };
    if (modelDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modelDropdown]);
  
  // Find the current model display name
  const currentModel = availableModels.find(m => m.id === selectedModel);
  const displayName = currentModel?.name || selectedModel;

  // Status Indicator helper
  const getStatusMetrics = () => {
    switch (status) {
      case "THINKING":
        return { color: "bg-amber-500", text: "Computing replies..." };
      case "RESEARCHING":
        return { color: "bg-indigo-600 animate-pulse", text: "Scraping web index..." };
      case "OFFLINE":
         return { color: "bg-rose-600 animate-ping", text: "Proxy connection offline" };
      default:
        return { color: "bg-emerald-500 animate-pulse", text: "Engine Online" };
    }
  };

  const currentStatus = getStatusMetrics();

  return (
    <div className="bg-gradient-to-r from-white to-slate-50 dark:from-[#0c0c0e] dark:to-zinc-950 border-b border-slate-200 dark:border-zinc-800/80 h-14 px-5 flex items-center justify-between text-slate-900 dark:text-zinc-200 select-none shrink-0 font-sans transition-colors duration-150 shadow-sm">
      
      {/* 1. Model Selector Left (Masidy customized, no ChatGPT dropdown leftovers) */}
      <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
        {isSidebarCollapsed && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 bg-white hover:bg-slate-100 dark:bg-zinc-850 dark:hover:bg-zinc-700 text-slate-650 dark:text-zinc-350 border border-slate-200 dark:border-zinc-700 rounded-lg cursor-pointer transition flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-indigo-500/20 shadow-sm hover:shadow-md"
            title="Expand Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        <button 
          onClick={() => setModelDropdown(!modelDropdown)}
          className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-zinc-800/80 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer text-slate-900 dark:text-zinc-100 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md"
        >
          <span className="font-semibold">{displayName}</span>
          <ChevronDown className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
        </button>

        {/* Dynamic Connected green status light tag */}
        <div className="flex items-center space-x-2 opacity-95">
          <span className={`h-2 w-2 rounded-full ${currentStatus.color}`} />
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider font-mono">
             {currentStatus.text}
          </span>
        </div>

        {/* Small operational models list box popup */}
        {modelDropdown && (
          <div className="absolute top-12 left-0 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg shadow-lg p-3 z-50 w-56 text-left space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-100">
             <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider px-3 block mb-2">AI Models</span>
             
             {availableModels.length === 0 ? (
               <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                 Loading models...
               </div>
             ) : (
               availableModels.map((model) => (
                 <button 
                   key={model.id}
                   onClick={() => { 
                     if (model.locked) return;
                     setModelDropdown(false); 
                     onModelChange?.(model.id);
                   }}
                   className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex justify-between items-center transition-all ${
                     model.locked
                       ? "opacity-50 cursor-not-allowed text-slate-400 dark:text-zinc-500"
                       : "hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
                   } ${selectedModel === model.id ? "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700/50" : ""}`}
                 >
                    <div className="flex flex-col">
                      <span className="text-slate-900 dark:text-zinc-100">{model.locked ? `🔒 ${model.name}` : model.name}</span>
                      <span className="text-[8px] text-slate-500 dark:text-slate-400 font-normal">{model.description} {model.tier && model.tier !== "FREE" ? `· ${model.tier}` : ""}</span>
                    </div>
                    {selectedModel === model.id && (
                      <span className="px-2 py-1 bg-indigo-200 dark:bg-indigo-900/60 text-[8px] font-bold text-indigo-700 dark:text-indigo-300 rounded uppercase tracking-wide">Active</span>
                    )}
                 </button>
               ))
             )}
          </div>
        )}
      </div>

      {/* 2. Operations and subscription badges on far right */}
      <div className="flex items-center space-x-3">
        
        {/* Toggle clear chat if messages loaded */}
        {hasMessages && (
          <button
            onClick={onClearChat}
            className="flex items-center space-x-2 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-sm hover:shadow-md"
            title="Clear active chat feed of user outputs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400" />
            <span>Clear Threads</span>
          </button>
        )}

        {/* Authorization Active Tier Badge Capsule */}
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 text-slate-900 dark:text-zinc-200 border border-indigo-200 dark:border-indigo-700/50 font-bold text-[10px] uppercase tracking-wider py-1.5 px-4 rounded-lg flex items-center space-x-2 shadow-sm select-none">
           <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
           <span>Plan: <strong className="text-indigo-700 dark:text-indigo-300 ml-0.5">{activePlan}</strong></span>
        </div>

      </div>

    </div>
  );
}
