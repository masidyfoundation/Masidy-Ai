import React, { useState } from "react";
import { HelpCircle, ChevronRight, BookOpen, Key, Link2, Sparkles, Terminal, FileCode, CheckCircle, Search, ShieldCheck, Scale } from "lucide-react";

export default function SystemGuide() {
  const [activeSegment, setActiveSegment] = useState<"started" | "privacy" | "terms">("started");
  const [searchWord, setSearchWord] = useState("");

  const faqs = [
    {
      q: "What is Masidy?",
      a: "Masidy is a smart interactive conversational workspace designed to help you write elegant copy, draft essays, organize plans, and answer general informational questions.",
      tags: ["general", "usage"]
    },
    {
      q: "How do I query the assistant?",
      a: "Simply input your requests inside the typing bar at the bottom of the workspace pane or use one of our standard starter cards to initiate dialogues instantly.",
      tags: ["prompting", "setup"]
    },
    {
      q: "Is my personal data safe on this platform?",
      a: "Yes, fully. Our architecture values consumer privacy above all else. Since we cache your conversations directly in your browser's private storage partition, your logs remain completely private.",
      tags: ["safety", "privacy"]
    },
    {
      q: "Are there any usage limits or licensing agreements?",
      a: "Customers may utilize Masidy freely for general personal productivity and commercial brainstorming, subject to our simple acceptable use standards.",
      tags: ["legal", "use"]
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchWord.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchWord.toLowerCase())
  );

  return (
    <div id="system-guide-layout" className="flex-1 bg-white dark:bg-[#0c0c0e] p-6 md:p-12 overflow-y-auto font-sans transition-colors duration-150 text-neutral-800 dark:text-zinc-200">
      <div className="max-w-4xl mx-auto space-y-8 text-left select-none">
        
        {/* Title elements */}
        <div className="space-y-2 border-b border-neutral-100 dark:border-zinc-805 pb-5">
          <span className="text-[11px] font-semibold text-indigo-605 dark:text-indigo-405 uppercase tracking-widest block font-mono">WORKSPACE PLATFORM CENTER</span>
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-zinc-100 font-sans">User Center, Terms of Use & Privacy Policies</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed mt-1">
             Read our customer service policies, standard guidelines, privacy guarantees, and usage limitations before initiating workspace routines.
          </p>
        </div>

        {/* Searching bar */}
        <div className="max-w-md w-full bg-[#f4f4f4] dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 focus-within:border-neutral-300 dark:focus-within:border-zinc-700 rounded-full flex items-center px-4 py-2 transition-colors">
          <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="Search our FAQ library and terms..."
            className="flex-grow bg-transparent text-neutral-800 dark:text-zinc-105 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-xs focus:outline-none focus:ring-0"
          />
        </div>

        {/* Nav tabs selection bar */}
        <div className="flex border-b border-neutral-200 dark:border-zinc-805">
          {[
            { id: "started", name: "User Guide", icon: BookOpen },
            { id: "privacy", name: "Privacy Policy", icon: ShieldCheck },
            { id: "terms", name: "Terms of Service", icon: Scale }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeSegment === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSegment(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  isSelected
                    ? "border-black dark:border-white text-black dark:text-white"
                    : "border-transparent text-[#616161] dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected tab content displays */}
        <div className="py-2 font-sans text-xs text-neutral-600 dark:text-zinc-300 leading-relaxed">
          {activeSegment === "started" && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-zinc-100 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Navigating the Platform</span>
              </h3>
              <p>
                Masidy utilizes an elegant, distilled workspace designed to maximize focus. Here is a simple instruction list on how to achieve daily creative workflows:
              </p>
              <ul className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Create a session:</strong> Tap on the <em>New Chat</em> utility button in your sidebar to open an interactive workspace session immediately.
                </li>
                <li>
                  <strong>Begin prompting:</strong> Enter questions, instructions, or project tasks directly to receive logical conversational responses in real-time.
                </li>
                <li>
                  <strong>Personalize variables:</strong> Expand the Settings hub to edit your username alias or configure specific instruction constraints.
                </li>
              </ul>
            </div>
          )}

          {activeSegment === "privacy" && (
            <div className="space-y-4 animate-fade-in text-left">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-zinc-100 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Customer Privacy & Data Protection Policy</span>
              </h3>
              <div className="space-y-3 bg-neutral-50 dark:bg-zinc-950 p-4 rounded-xl border border-neutral-200 dark:border-zinc-800 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400 font-sans">
                <p>
                  <strong>1. Data Minimization</strong><br />
                  We believe your private thoughts are yours alone. Masidy does not monitor, collect, sell, or index individual inquiries. All inputs and conversation records are cached directly in your local sandbox browser environment to prevent unauthorized remote extraction.
                </p>
                <p>
                  <strong>2. Local Storage Control</strong><br />
                  No database keys or personal logs are synced to dynamic third-party analytics monitors. Every conversation block remains partitioned inside standard browser cache registers, allowing users to clear archives completely at any point in the history panel.
                </p>
                <p>
                  <strong>3. Information Sharing</strong><br />
                  We do not transmit user inputs to non-essential third-party advertisers. All model responses are fetched utilizing secure, encrypted tunnels purely to fulfill direct execution queries.
                </p>
              </div>
            </div>
          )}

          {activeSegment === "terms" && (
            <div className="space-y-4 animate-fade-in text-left">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-zinc-100 flex items-center space-x-1.5">
                <Scale className="w-4 h-4 text-indigo-500" />
                <span>Terms of Service Agreement</span>
              </h3>
              <div className="space-y-3 bg-neutral-50 dark:bg-zinc-950 p-4 rounded-xl border border-neutral-200 dark:border-zinc-800 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400 font-sans">
                <p>
                  <strong>1. Acceptance of Terms</strong><br />
                  By loading the Masidy gateway platform, users signify compliance with these binding Terms of Service. If you do not agree to these rules, please cease workspace utilization.
                </p>
                <p>
                  <strong>2. Permitted Workspace Use</strong><br />
                  Users are granted a limited license to input text vectors and query responses for educational, academic, development, and personal productivity goals under safe boundaries.
                </p>
                <p>
                  <strong>3. Intellectual Property Ownership</strong><br />
                  All original written, theoretical, and planned content elements output during your workspace routines belong exclusively to you, the system user. Masidy claims zero title over creative assets assembled in the dialog panel.
                </p>
                <p>
                  <strong>4. Disclaimer of Warranties</strong><br />
                  Platform interfaces are provided strictly on an &ldquo;as is&rdquo; basis. No absolute guarantee of model output uptime or continuous caching continuity is stated or implied.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic searchable Frequently Asked Questions matching user typing */}
        <div className="pt-6 border-t border-neutral-100 dark:border-zinc-800 space-y-4 select-text">
          <h3 className="text-sm font-bold text-neutral-800 dark:text-zinc-100">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFaqs.length === 0 ? (
              <div className="col-span-2 text-zinc-405 text-xs italic">
                No articles matching your search query. Try searching for &apos;privacy&apos; or &apos;usage&apos;.
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="p-4 rounded-2xl border border-neutral-205 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-zinc-100 flex items-start space-x-1.5 leading-snug">
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-zinc-400 dark:text-zinc-500" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-[11.5px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans pl-5 font-medium">
                    {faq.a}
                  </p>
                  <div className="flex space-x-1.5 pl-5 pt-1">
                    {faq.tags.map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 bg-neutral-100 dark:bg-zinc-800 text-[9px] text-zinc-500 dark:text-zinc-400 rounded font-mono uppercase">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

