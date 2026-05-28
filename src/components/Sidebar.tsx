import React, { useState, useEffect } from "react";
import { Conversation } from "../types";
import { 
  Plus, 
  Trash2, 
  MessageSquare, 
  Settings, 
  Sparkles, 
  HelpCircle, 
  Compass, 
  Image, 
  Layers, 
  Search, 
  Menu,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Sliders,
  Database,
  UserPlus,
  ShieldAlert,
  Sun,
  Moon,
  Zap
} from "lucide-react";

interface SidebarProps {
  conversations: Conversation[];
  activeConvId: string | null;
  onSelectConversation: (id: string) => void;
  onStartNewConversation: () => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
  showCredentialsModal: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onConnectOAuth: () => void;
  onSignOut?: () => void;
  isAuthenticated?: boolean;
  setActiveView: (view: "chat" | "images" | "research" | "pricing" | "guide") => void;
  activeView: "chat" | "images" | "research" | "pricing" | "guide";
  username: string;
  avatarColor: string;
  activePlan: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  width: number;
  isDragging: boolean;
  onResizeMouseDown: (e: React.MouseEvent) => void;
}

export default function Sidebar({
  conversations,
  activeConvId,
  onSelectConversation,
  onStartNewConversation,
  onDeleteConversation,
  showCredentialsModal,
  theme,
  onToggleTheme,
  onConnectOAuth,
  onSignOut,
  isAuthenticated = false,
  setActiveView,
  activeView,
  username,
  avatarColor,
  activePlan,
  isCollapsed,
  onToggleCollapse,
  width,
  isDragging,
  onResizeMouseDown
}: SidebarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rateLimitStatus, setRateLimitStatus] = useState<{ limit: number; remaining: number; resetTime: number } | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (dropdownOpen) {
      const loadStatus = () => {
        fetch("/api/rate-limit-status")
          .then(res => res.json())
          .then(data => setRateLimitStatus(data))
          .catch(e => console.error("Rate status sync issue:", e));
      };
      loadStatus();
      interval = setInterval(loadStatus, 4500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dropdownOpen]);
  
  // Custom avatar colors helper
  const getAvatarBg = () => {
    switch (avatarColor) {
      case "emerald": return "bg-emerald-600 border-emerald-500 text-white";
      case "amber": return "bg-amber-500 border-amber-400 text-white";
      case "rose": return "bg-rose-600 border-rose-500 text-white";
      case "neutral": return "bg-neutral-800 border-neutral-700 text-white";
      default: return "bg-indigo-600 border-indigo-500 text-white";
    }
  };

  return (
    <div 
      style={{ width: isCollapsed ? 0 : `${width}px` }}
      className={`
        bg-[#f9f9f9] dark:bg-[#0f0f11] border-r border-[#e5e5e5] dark:border-zinc-800/80 
        flex flex-col h-full text-[#0d0d0d] dark:text-[#f4f4f5] font-sans
        ${isDragging ? "select-none" : "transition-[width,opacity] duration-300 ease-in-out"}
        ${isCollapsed ? "w-0 overflow-hidden border-r-0 opacity-0 pointer-events-none" : "opacity-100"}
        fixed md:relative z-40 md:z-auto
        top-0 left-0 bottom-0
        ${isCollapsed ? "hidden" : "flex"}
        md:flex md:shrink-0
        w-[280px] md:w-auto
      `}
    >
      
      {/* 1. Brand Logo Header */}
      <div className="p-3.5 flex items-center justify-between select-none border-b border-[#e5e5e5]/40 dark:border-zinc-800/80 relative">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-black dark:bg-[#e3e3e3] text-white dark:text-zinc-950 flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
          </div>
          <span className="text-sm font-bold text-neutral-900 dark:text-zinc-100 tracking-tight truncate">MASIDY GATEWAY</span>
        </div>
        
        {/* Real Menu & Collapse Triggers */}
        <div className="flex items-center space-x-1 shrink-0">
          <button 
            onClick={onToggleCollapse}
            className="p-1.5 hover:bg-neutral-200/60 dark:hover:bg-zinc-800/60 rounded-lg text-zinc-500 dark:text-zinc-400 cursor-pointer transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`p-1.5 hover:bg-neutral-200/60 dark:hover:bg-zinc-800/60 rounded-lg text-zinc-500 dark:text-zinc-400 cursor-pointer transition-colors ${dropdownOpen ? "bg-neutral-200/60 dark:bg-zinc-800/60" : ""}`}
              title="System Command Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

          {/* Real Animated Popover Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-9 right-0 w-64 bg-white dark:bg-[#18181b] border border-[#e5e5e5] dark:border-zinc-850 rounded-2xl shadow-2xl p-4 z-50 text-left space-y-3.5 animate-in fade-in slide-in-from-top-1 duration-100">
              
              {/* Header */}
              <div className="border-b border-neutral-100 dark:border-zinc-800 pb-2 flex justify-between items-center">
                 <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider font-mono">System Command Menu</span>
                 <button 
                    onClick={() => setDropdownOpen(false)}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                 >
                    Close
                 </button>
              </div>

              {/* 1. Global Theme Changer */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block font-mono">1. Global Theme Changer</span>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => { if (theme !== "light") onToggleTheme(); }}
                    className={`flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-xs font-semibold cursor-pointer transition ${theme === "light" ? "bg-indigo-600 text-white shadow-xs" : "bg-neutral-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-neutral-200"}`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light Mode</span>
                  </button>
                  <button 
                    onClick={() => { if (theme !== "dark") onToggleTheme(); }}
                    className={`flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-xs font-semibold cursor-pointer transition ${theme === "dark" ? "bg-indigo-600 text-white shadow-xs" : "bg-neutral-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-neutral-200"}`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </div>

              {/* 2. Real-time Rate limiting telemetry */}
              <div className="space-y-1.5 pt-1 border-t border-neutral-100 dark:border-zinc-800">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block font-mono">2. Rate Limit Telemetry</span>
                <div className="bg-neutral-51 dark:bg-zinc-900/60 border border-neutral-200 dark:border-zinc-800 p-2 rounded-lg space-y-1 select-none">
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-zinc-500">Tier status:</span>
                     <span className="font-bold text-zinc-800 dark:text-zinc-300 capitalize">{activePlan}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-zinc-500">Credits left:</span>
                     <span className="font-bold text-zinc-850 dark:text-zinc-200">{rateLimitStatus ? `${rateLimitStatus.remaining}/${rateLimitStatus.limit}` : "Retrieving..."}</span>
                  </div>
                  
                  {/* Visual Status Credit Meter */}
                  {rateLimitStatus && (
                    <div className="w-full h-1.5 bg-neutral-200 dark:bg-zinc-800 rounded-full overflow-hidden mt-1.5">
                       <div 
                         className={`h-full rounded-full transition-all duration-300 ${rateLimitStatus.remaining < 3 ? "bg-red-500" : "bg-emerald-500"}`} 
                         style={{ width: `${(rateLimitStatus.remaining / rateLimitStatus.limit) * 100}%` }}
                       />
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
        </div>
      </div>

      {/* 2. Core Functional Tabs Pages (Completely real, no placeholders!) */}
      <div className="px-3 py-3.5 space-y-1 select-none border-b border-[#e5e5e5]/40 dark:border-zinc-800/80 bg-[#fafafa] dark:bg-[#121214]/40">
        
        {/* NEW CHAT BUTTON */}
        <button
          onClick={() => {
            onStartNewConversation();
            setActiveView("chat");
          }}
          className={`w-full flex items-center space-x-3 py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
            activeView === "chat" && activeConvId === null
              ? "bg-[#e3e3e3]/80 text-[#0d0d0d] dark:bg-zinc-800 dark:text-white"
              : "hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-700 dark:text-zinc-300"
          }`}
        >
          <Plus className="w-4 h-4 text-zinc-700 dark:text-zinc-400 shrink-0" />
          <span>New Chat</span>
        </button>

        {/* Dynamic Image Generator Module */}
        <button
          onClick={() => setActiveView("images")}
          className={`w-full flex items-center space-x-3 py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
            activeView === "images"
              ? "bg-[#e3e3e3]/80 text-[#0d0d0d] dark:bg-zinc-800 dark:text-white"
              : "hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-700 dark:text-zinc-300"
          }`}
        >
          <Image className="w-4 h-4 text-zinc-620 dark:text-zinc-400 shrink-0" />
          <span>Visual Studio</span>
        </button>

        {/* Automated crawl Deep Research */}
        <button
          onClick={() => setActiveView("research")}
          className={`w-full flex items-center space-x-3 py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
            activeView === "research"
              ? "bg-[#e3e3e3]/80 text-[#0d0d0d] dark:bg-zinc-800 dark:text-white"
              : "hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-700 dark:text-zinc-300"
          }`}
        >
          <Search className="w-4 h-4 text-zinc-620 dark:text-zinc-400 shrink-0" />
          <span>Deep Research</span>
        </button>

        {/* Developer Guide / Database Config blueprint FAQ */}
        <button
          onClick={() => setActiveView("guide")}
          className={`w-full flex items-center space-x-3 py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
            activeView === "guide"
              ? "bg-[#e3e3e3]/80 text-[#0d0d0d] dark:bg-zinc-800 dark:text-white"
              : "hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-700 dark:text-zinc-300"
          }`}
        >
          <Layers className="w-4 h-4 text-zinc-620 dark:text-zinc-400 shrink-0" />
          <span>Documentation Guide</span>
        </button>

      </div>

      {/* 3. Thread History Records index */}
      <div className="px-5 pt-4 pb-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest select-none font-mono">
        Thread Records
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1.5 scrollbar-thin">
        {conversations.length === 0 ? (
          <div className="text-zinc-400 dark:text-zinc-450 text-xs px-2 py-6 italic text-center leading-normal">
            No previous threads loaded
          </div>
        ) : (
          conversations.map((c) => {
            const isActive = c.id === activeConvId && activeView === "chat";
            return (
              <div
                key={c.id}
                onClick={() => onSelectConversation(c.id)}
                className={`group flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#e3e3e3]/60 dark:bg-zinc-800 text-[#0d0d0d] dark:text-white font-bold"
                    : "hover:bg-neutral-200/40 dark:hover:bg-zinc-900/45 text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-indigo-650 dark:text-indigo-400" : "text-zinc-400 dark:text-zinc-500"}`} />
                  <span className="text-xs truncate select-none leading-none font-medium">{c.title || "Untitled Chat"}</span>
                </div>
                
                {/* Purge button (trash can) */}
                <button
                  onClick={(e) => onDeleteConversation(c.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-650 hover:bg-neutral-200 dark:hover:bg-zinc-800 rounded-lg transition-all duration-100 ml-1 text-zinc-400 dark:text-zinc-500"
                  title="Purge thread from memory database"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Footer Settings and Accounts Panel */}
      <div className="p-3.5 border-t border-neutral-200 dark:border-zinc-800 space-y-1.5 select-none bg-neutral-50/60 dark:bg-zinc-950/40">
        
        {/* Upgrade subplans page */}
        <button
          onClick={() => setActiveView("pricing")}
          className={`w-full flex items-center space-x-2.5 py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
            activeView === "pricing" 
              ? "bg-indigo-50 dark:bg-zinc-900 text-indigo-900 dark:text-indigo-300" 
              : "hover:bg-neutral-200/40 dark:hover:bg-zinc-800 text-zinc-620 dark:text-zinc-350 hover:text-black dark:hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>Plans & Subscription</span>
        </button>

        {/* Credentials Settings suite drawer opener */}
        <button
          onClick={showCredentialsModal}
          className="w-full flex items-center space-x-2.5 py-2 px-3 hover:bg-neutral-200/40 dark:hover:bg-zinc-800 text-zinc-620 dark:text-zinc-350 hover:text-black dark:hover:text-white rounded-xl text-xs font-semibold cursor-pointer text-left"
        >
          <Settings className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
          <span>Workspace Preferences</span>
        </button>

        {/* Auth button — always visible at bottom */}
        {!isAuthenticated ? (
          <button
            onClick={onConnectOAuth}
            className="w-full flex items-center space-x-2.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>Sign In / Create Account</span>
          </button>
        ) : (
          <button
            onClick={onSignOut}
            className="w-full flex items-center space-x-2.5 py-2 px-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        )}

        {/* User Account Capsule Details */}
        <div className="pt-2 border-t border-neutral-200 dark:border-zinc-800 mt-2 flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none border border-black/10 dark:border-white/10 uppercase shadow-xs ${getAvatarBg()}`}>
            {username ? username.charAt(0) : "U"}
          </div>
          <div className="min-w-0 flex-1 leading-none text-left">
            <h4 className="text-xs font-bold text-neutral-800 dark:text-zinc-200 truncate" title={username}>{username}</h4>
            <span className={`text-[9px] font-bold uppercase tracking-wide ${isAuthenticated ? "text-emerald-500" : "text-zinc-500 dark:text-zinc-400"}`}>
              {isAuthenticated ? "● SIGNED IN" : "NOT SIGNED IN"}
            </span>
          </div>
        </div>

      </div>

      {/* Resize Handle with hover line feedback */}
      {!isCollapsed && (
        <div
          onMouseDown={onResizeMouseDown}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-50 hover:bg-indigo-650/20 dark:hover:bg-zinc-700/20 active:bg-indigo-600 dark:active:bg-zinc-500 transition-all select-none"
          title="Drag to resize workspace sidebar"
        >
          {/* Subtle resize indicator line inside handle */}
          <div className="w-[1.5px] h-full mx-auto bg-transparent hover:bg-indigo-505 dark:hover:bg-zinc-700 active:bg-indigo-600 dark:active:bg-zinc-500 transition-colors" />
        </div>
      )}
    </div>
  );
}
