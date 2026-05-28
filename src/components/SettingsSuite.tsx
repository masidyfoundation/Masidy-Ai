import React, { useState } from "react";
import { X, Key, Link2, User, Sparkles, CheckCircle2, ShieldAlert, Monitor, Sliders, Volume2 } from "lucide-react";

interface SettingsSuiteProps {
  onClose: () => void;
  onSave: (keys: { supabaseUrl: string; supabaseKey: string; groqApiKey: string }) => void;
  savedKeys: { supabaseUrl: string; supabaseKey: string; groqApiKey: string };
}

export default function SettingsSuite({ onClose, onSave, savedKeys }: SettingsSuiteProps) {
  const [activeTab, setActiveTab] = useState<"preferences" | "profile" | "instructions">("preferences");
  
  // Profile elements
  const [username, setUsername] = useState(() => localStorage.getItem("masidy_username") || "Masidy User");
  const [avatarColor, setAvatarColor] = useState(() => localStorage.getItem("masidy_avatar") || "indigo");
  
  // Custom instructions
  const [customInstructions, setCustomInstructions] = useState(() => localStorage.getItem("masidy_instructions") || "");

  const [activePlan] = useState(() => localStorage.getItem("masidy_active_tier") || "Free Standard");

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Workspace toggles
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem("masidy_sound_effects") !== "false");
  const [animationsEnabled, setAnimationsEnabled] = useState(() => localStorage.getItem("masidy_animations") !== "false");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save credentials (third-party parameters successfully removed)
    onSave({ supabaseUrl: "", supabaseKey: "", groqApiKey: "" });

    // Save profile configurations
    localStorage.setItem("masidy_username", username);
    localStorage.setItem("masidy_avatar", avatarColor);
    
    // Save instructions
    localStorage.setItem("masidy_instructions", customInstructions);

    // Save toggles
    localStorage.setItem("masidy_sound_effects", String(soundEnabled));
    localStorage.setItem("masidy_animations", String(animationsEnabled));

    setSavedSuccess(true);
    setTimeout(() => {
       setSavedSuccess(false);
       onClose();
       // Force reload to align context dynamically
       window.location.reload();
    }, 1200);
  };

  return (
    <div id="settings-suite-overlay" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans select-none">
      <div className="w-full max-w-xl bg-white dark:bg-[#0c0c0e] border border-neutral-200 dark:border-zinc-805 rounded-3xl shadow-2xl overflow-hidden text-neutral-800 dark:text-zinc-200 flex flex-col md:flex-row h-[480px]">
        
        {/* 1. Sidebar Tabs (Left) */}
        <div className="w-full md:w-48 bg-neutral-50 dark:bg-zinc-900 border-r border-neutral-200 dark:border-zinc-800 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            
            {/* Title */}
            <div>
              <h3 className="text-xs font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-widest font-mono">WORKSPACE SETTINGS</h3>
              <p className="text-[11px] text-neutral-850 dark:text-zinc-300 font-bold mt-1">Configure Suite</p>
            </div>

            {/* Menu options buttons */}
            <div className="space-y-1">
              {[
                { id: "preferences", name: "System Options", icon: Sparkles },
                { id: "profile", name: "User Account", icon: User },
                { id: "instructions", name: "System Directives", icon: Sliders }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-2.5 py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-left ${
                      isSelected
                        ? "bg-black dark:bg-zinc-100 text-white dark:text-black"
                        : "hover:bg-neutral-200/50 dark:hover:bg-zinc-800 text-zinc-550 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>

          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-neutral-700 dark:text-zinc-300 font-bold text-xs rounded-xl cursor-pointer text-center"
          >
            Cancel
          </button>
        </div>

        {/* 2. Parameters Content Section (Right form fields) */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 flex flex-col justify-between overflow-y-auto bg-white dark:bg-[#0c0c0e]">
          
          <div className="space-y-4 flex-1">
            
            {/* Workspace preferences tab */}
            {activeTab === "preferences" && (
              <div id="project-genesis-form" className="space-y-4 animate-fade-in text-left">
                <div>
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-zinc-100">Workspace Customization</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                     Customize your sensory experience, animation properties, and privacy modes within the active gateway interface.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Sound Toggle */}
                  <div className="flex items-center justify-between p-3 bg-neutral-50/70 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-neutral-800 dark:text-zinc-200">System Sound Playback</span>
                      <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400">Play responsive alerts during dynamic report assembly.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        soundEnabled ? "bg-indigo-600" : "bg-neutral-300 dark:bg-zinc-700"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        soundEnabled ? "translate-x-4" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  {/* Animations Toggle */}
                  <div className="flex items-center justify-between p-3 bg-neutral-50/70 dark:bg-zinc-900/60 border border-neutral-200 dark:border-zinc-800 rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-neutral-800 dark:text-zinc-200">Fluid Transitions</span>
                      <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400">Enable high-performance fade and sidebar slide animations.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAnimationsEnabled(!animationsEnabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        animationsEnabled ? "bg-indigo-600" : "bg-neutral-300 dark:bg-zinc-700"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        animationsEnabled ? "translate-x-4" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  {/* Diagnostic Alert Option */}
                  <div className="p-3 bg-neutral-50/70 dark:bg-zinc-900/30 border border-neutral-205/60 dark:border-zinc-800 rounded-xl text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">
                    <span className="font-bold text-neutral-700 dark:text-zinc-300 block mb-0.5">Offline Privacy Shield</span>
                    All interaction logs are kept locally in your primary sandbox workspace session, preventing third-party cloud data persistence metrics completely.
                  </div>
                </div>
              </div>
            )}

            {/* Profile configuration tab */}
            {activeTab === "profile" && (
              <div className="space-y-4 animate-fade-in text-left">
                <div>
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-zinc-100">User Account Configuration</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                     Personalize your workspace metadata, username tags, and graphic display avatars natively.
                  </p>
                </div>

                {/* Username Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-550 dark:text-zinc-400 font-bold uppercase tracking-wider block">
                     Custom Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Admiral Masidy"
                    className="w-full bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 focus:border-black dark:focus:border-zinc-600 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-0 text-zinc-800 dark:text-zinc-100"
                  />
                </div>

                {/* Avatar select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-550 dark:text-zinc-400 font-bold uppercase tracking-wider block">
                     Avatar Color Accent
                  </label>
                  <div className="flex space-x-2">
                    {[
                      { key: "indigo", bg: "bg-indigo-600 border-indigo-200" },
                      { key: "emerald", bg: "bg-emerald-600 border-emerald-200" },
                      { key: "amber", bg: "bg-amber-500 border-amber-200" },
                      { key: "rose", bg: "bg-rose-600 border-rose-200" },
                      { key: "neutral", bg: "bg-neutral-800 border-neutral-600" }
                    ].map((col) => (
                      <button
                        key={col.key}
                        type="button"
                        onClick={() => setAvatarColor(col.key)}
                        className={`w-7 h-7 rounded-full cursor-pointer border-2 transition-transform ${col.bg} ${
                          avatarColor === col.key ? "scale-115 ring-2 ring-black dark:ring-white" : "opacity-80"
                        }`}
                        title={`Select avatar template ${col.key}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Display plan tier detail block */}
                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900 text-center text-xs font-semibold text-indigo-900 dark:text-indigo-300 rounded-xl leading-none">
                  Currently enjoy {activePlan ? activePlan.toUpperCase() : "FREE STANDARD"} active workspace tier.
                </div>
              </div>
            )}

            {/* System directives Instructions tab */}
            {activeTab === "instructions" && (
              <div className="space-y-4 animate-fade-in text-left">
                <div>
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-zinc-100">Advanced Custom Directives</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                     Provide guidelines that override or prepend to AI message generations (e.g. &ldquo;always address me as Chief Admiral and keep bullet replies&rdquo;).
                  </p>
                </div>

                {/* Textarea custom instructions */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-550 dark:text-zinc-400 font-bold uppercase tracking-wider block">
                     Instruction Preset Content
                  </label>
                  <textarea
                    rows={4}
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Write custom instructions to direct Masidy behavioral profiles..."
                    className="w-full bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-0 text-zinc-800 dark:text-zinc-100 resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Action Confirm submit button */}
          <div className="pt-4 border-t border-neutral-150 dark:border-zinc-800">
            {savedSuccess ? (
              <div className="flex items-center justify-center space-x-2 py-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-widest rounded-xl">
                 <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                 <span>Workspace Updated successfully</span>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 font-bold text-xs tracking-widest uppercase rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                APPLY ALL PREFERENCES
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
}
