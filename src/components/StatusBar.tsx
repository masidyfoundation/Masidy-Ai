import React, { useState } from "react";
import { Sparkles, ChevronDown, RotateCcw, ShieldCheck, HelpCircle, Key, Activity, Menu } from "lucide-react";

interface StatusBarProps {
  status: "ONLINE" | "THINKING" | "RESEARCHING" | "OFFLINE";
  onClearChat: () => void;
  hasMessages: boolean;
  showCredentialsModal: () => void;
  activePlan: string;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function StatusBar({ 
  status, 
  onClearChat, 
  hasMessages, 
  showCredentialsModal,
  activePlan,
  isSidebarCollapsed,
  onToggleSidebar
}: StatusBarProps) {
  const [modelDropdown, setModelDropdown] = useState(false);
  const [activeModel, setActiveModel] = useState("Masidy 1.2");

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
    <div className="bg-white dark:bg-[#0c0c0e] border-b border-neutral-200 dark:border-zinc-800/80 h-14 px-5 flex items-center justify-between text-neutral-850 dark:text-zinc-200 select-none shrink-0 font-sans transition-colors duration-150">
      
      {/* 1. Model Selector Left (Masidy customized, no ChatGPT dropdown leftovers) */}
      <div className="flex items-center space-x-2.5 relative">
        {isSidebarCollapsed && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 bg-neutral-50 hover:bg-neutral-200 dark:bg-zinc-850 dark:hover:bg-zinc-700 text-zinc-650 dark:text-zinc-350 border border-neutral-200 dark:border-zinc-700 rounded-lg cursor-pointer transition flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-indigo-500/20 shadow-xs"
            title="Expand Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        <button 
          onClick={() => setModelDropdown(!modelDropdown)}
          className="flex items-center space-x-1.5 px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-xl text-xs font-bold transition-all cursor-pointer text-zinc-900 dark:text-zinc-100 border border-neutral-200 dark:border-zinc-700 bg-neutral-50/50 dark:bg-zinc-900/50"
        >
          <span>{activeModel}</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
        </button>

        {/* Dynamic Connected green status light tag */}
        <div className="flex items-center space-x-1.5 opacity-90">
          <span className={`h-1.5 w-1.5 rounded-full ${currentStatus.color}`} />
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider font-mono">
             {currentStatus.text}
          </span>
        </div>

        {/* Small operational models list box popup */}
        {modelDropdown && (
          <div className="absolute top-10 left-0 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl shadow-xl p-2 z-50 w-56 text-left space-y-1 animate-in fade-in slide-in-from-top-1 duration-100">
             <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider px-2.5 block mb-1">Active AI model arrays</span>
             
             <button 
               onClick={() => { setModelDropdown(false); setActiveModel("Masidy 1"); }}
               className={`w-full text-left py-1.5 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 text-xs font-semibold flex justify-between items-center cursor-pointer ${activeModel === "Masidy 1" ? "bg-neutral-50 dark:bg-zinc-800" : ""}`}
             >
                <div className="flex flex-col">
                  <span className="text-neutral-800 dark:text-zinc-100">Masidy 1</span>
                  <span className="text-[8px] text-zinc-450 font-normal">Standard Model</span>
                </div>
                {activeModel === "Masidy 1" && (
                  <span className="px-1 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-[8px] font-bold text-indigo-700 dark:text-indigo-350 rounded uppercase">ACTIVE</span>
                )}
             </button>

             <button 
               onClick={() => { setModelDropdown(false); setActiveModel("Masidy 1.2"); }}
               className={`w-full text-left py-1.5 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 text-xs font-semibold flex justify-between items-center cursor-pointer ${activeModel === "Masidy 1.2" ? "bg-neutral-50 dark:bg-zinc-800" : ""}`}
             >
                <div className="flex flex-col">
                  <span className="text-neutral-800 dark:text-zinc-100">Masidy 1.2</span>
                  <span className="text-[8px] text-zinc-450 font-normal">Balanced Thinking</span>
                </div>
                {activeModel === "Masidy 1.2" && (
                  <span className="px-1 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-[8px] font-bold text-indigo-700 dark:text-indigo-350 rounded uppercase">ACTIVE</span>
                )}
             </button>

             <button 
               onClick={() => { 
                 if (activePlan !== "Free Standard") {
                   setActiveModel("Masidy 1.3"); 
                 } else {
                   alert("Masidy 1.3 requires a Pro subscription level.");
                 }
                 setModelDropdown(false); 
               }}
               className={`w-full text-left py-1.5 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 text-xs font-semibold flex justify-between items-center cursor-pointer ${activeModel === "Masidy 1.3" ? "bg-neutral-50 dark:bg-zinc-800" : ""}`}
             >
                <div className="flex flex-col">
                  <span className="text-neutral-800 dark:text-zinc-100">Masidy 1.3</span>
                  <span className="text-[8px] text-zinc-450 font-normal">Advanced Reasoning</span>
                </div>
                {activeModel === "Masidy 1.3" ? (
                  <span className="px-1 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-[8px] font-bold text-indigo-700 dark:text-indigo-350 rounded uppercase">ACTIVE</span>
                ) : (
                  <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-[8px] font-bold text-zinc-500 rounded uppercase">PRO</span>
                )}
             </button>
          </div>
        )}
      </div>

      {/* 2. Operations and subscription badges on far right */}
      <div className="flex items-center space-x-3">
        
        {/* Toggle clear chat if messages loaded */}
        {hasMessages && (
          <button
            onClick={onClearChat}
            className="flex items-center space-x-1.5 py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-neutral-700 dark:text-zinc-350 hover:text-black dark:hover:text-white rounded-full text-xs font-bold cursor-pointer transition-all"
            title="Clear active chat feed of user outputs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-600 dark:text-zinc-400" />
            <span>Clear Threads</span>
          </button>
        )}

        {/* Authorization Active Tier Badge Capsule */}
        <div className="bg-[#f4f4f4] dark:bg-zinc-900 text-neutral-850 dark:text-zinc-200 border border-neutral-200/80 dark:border-zinc-800 font-bold text-[10px] uppercase tracking-wider py-1.5 px-4 rounded-full flex items-center space-x-1.5 shadow-none select-none">
           <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
           <span>Plan: <strong className="text-indigo-900 dark:text-indigo-300">{activePlan}</strong></span>
        </div>

        {/* Settings Action Capsule Button */}
        <button
          onClick={showCredentialsModal}
          className="bg-black hover:bg-neutral-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs py-1.5 px-4.5 rounded-full transition-colors cursor-pointer shadow-xs uppercase tracking-wider"
        >
          Preferences
        </button>

      </div>

    </div>
  );
}
