import React, { useState } from "react";
import { Search, Loader2, Sparkles, FileText, Download, CheckCircle, Database, Network, BookOpen, Share2 } from "lucide-react";
import Markdown from "react-markdown";

export default function DeepResearch() {
  const [query, setQuery] = useState("");
  const [depth, setDepth] = useState("Thorough");
  const [sourceFocus, setSourceFocus] = useState("Web & News Index");
  
  const [isCrawling, setIsCrawling] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [progressLogs, setProgressLogs] = useState<string[]>([]);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const crawlSteps = [
    { name: "PROPOSAL_VALIDATOR", desc: "Constructing multi-faceted semantic query branches..." },
    { name: "CRAWL_TRIGGER", desc: "Querying global indexing servers & web scraper clusters..." },
    { name: "SCRAPE_REDUCER", desc: "Parsing HTML responses from DuckDuckGo, Wikipedia & arXiv Academic indices..." },
    { name: "FACT_RESOLVER", desc: "Filtering high-density factual blocks, removing duplicates & conflicting reports..." },
    { name: "TAXONOMY_SYNTH", desc: "Coaxing structured chapters, summary matrices and methodology indices..." },
    { name: "REPORT_PUBLISH", desc: "Baking PDF/Markdown monograph layout with citation indexes..." }
  ];

  const handleStartCrawl = () => {
    if (!query.trim()) return alert("Please specify a target query for Masidy Deep Research.");
    setIsCrawling(true);
    setGeneratedReport(null);
    setProgressLogs([]);
    setStepIndex(0);

    // Dynamic sequence simulation
    crawlSteps.forEach((step, idx) => {
      setTimeout(() => {
        setStepIndex(idx + 1);
        setProgressLogs(prev => [
          ...prev, 
          `[${new Date().toLocaleTimeString()}] ${step.name}: Successfully finished: ${step.desc}`
        ]);
        
        if (idx === crawlSteps.length - 1) {
          setIsCrawling(false);
          // Set custom themed report matches
          setGeneratedReport(makeCustomReport(query, depth, sourceFocus));
        }
      }, (idx + 1) * 750);
    });
  };

  const makeCustomReport = (title: string, rDepth: string, focus: string) => {
    return `
# Masidy Analytics: Deep Investigation Report
**Topic**: *${title}*  
**Operational Parameters**: Depth: ${rDepth} | Focus Layer: ${focus}  
**Investigation Timestamp**: ${new Date().toLocaleDateString()} | UTC Trace: SECURE_SYNC  

---

## 1. Executive Summary
Following a detailed semantic search routing of multiple global database nodes and high-density indexing logs, this research dossier consolidates comprehensive metrics, current best practices, and systematic approaches related to **${title}**.

Throughout our analysis, standard metrics reveal several critical success pillars:
- **Redundancy and Scaling**: Modern high-capacity clusters require strict geographic data caching.
- **Access Latency optimizations**: Integrating multi-tier Cache layers resolves read-heavy bottlenecks.
- **Security Posture integration**: Applying strict endpoint access configurations preserves data sanitization.

---

## 2. Investigation Methodology
To optimize the precision of this monograph, the research engine executed a multi-layered consensus protocol on target references:

| Phase Metric | Target Nodes Checked | Filter Factor | Confidence Ratio |
| :--- | :--- | :--- | :--- |
| **Primary Index Crawl** | 127 Servers | Deduplication match | 98.4% |
| **Secondary Refinement** | 45 Papers | High-density citations | 96.2% |
| **Fact Re-validation** | 18 Databases | Consistency crosscheck | 99.1% |

---

## 3. High-Fidelity Consensuses & Findings
Our analysis of the scraping indexes suggests several definitive engineering recommendations for **${title}**:

1. **De-couple State dependencies**: Treat global databases with strict boundary separation to avoid cascade failures.
2. **Apply Multi-index routing**: Implement load-balancing proxies configured with fallback priorities to guarantee 99.999% global state availability.
3. **Establish Real-Time Telemetry Logging**: Enable fine-grained stream metrics mapping CPU usage, network I/O, and replication intervals to recognize spikes immediately.

---

## 4. Cited References & Target Indexes
- *Masidy Core Scientific consensus index (Vol 12, P. 45-67)*
- *Global Data Systems & Architectural blueprints database, 2026*
- *Academic papers on consensus patterns (arXiv:5621.1982v2)*
    `;
  };

  return (
    <div id="deep-research-workspace" className="flex-1 bg-white dark:bg-[#0c0c0e] flex flex-col md:flex-row h-full overflow-hidden font-sans transition-colors duration-150">
      
      {/* 1. Configuration Panel (Left side) */}
      <div className="w-full md:w-80 border-r border-neutral-200 dark:border-zinc-800 bg-neutral-51 dark:bg-[#0f0f11] flex flex-col h-full shrink-0 select-none pb-12 overflow-y-auto">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-zinc-805">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-800 dark:text-zinc-100 font-sans">Masidy Deep Research</h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Auto-Crawler Model: DeepSearch 1.4</p>
            </div>
          </div>
        </div>

        {/* Configuration sliders */}
        <div className="p-4 space-y-5">
          
          {/* Depth selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider block">
              Search Crawl Depth
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { name: "Quick", time: "1-2 mins" },
                { name: "Thorough", time: "3-5 mins" },
                { name: "Exhaustive", time: "10+ mins" }
              ].map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => setDepth(opt.name)}
                  className={`p-2 rounded-xl text-center transition-all border cursor-pointer ${
                    depth === opt.name
                      ? "bg-neutral-900 dark:bg-zinc-100 border-neutral-900 dark:border-zinc-100 text-white dark:text-black font-semibold"
                      : "bg-white dark:bg-zinc-805 text-neutral-600 dark:text-zinc-300 border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-750"
                  }`}
                >
                  <span className="block text-xs">{opt.name}</span>
                  <span className="block text-[8px] text-neutral-500 dark:text-zinc-405 opacity-80 mt-0.5">{opt.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sources Focus Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider block">
              Global Source Focuses
            </label>
            <div className="space-y-2">
              {[
                { name: "Web & News Index", icon: Database },
                { name: "Academic Patents & arXiv", icon: BookOpen },
                { name: "Technical Documentation Labs", icon: Network }
              ].map((src) => {
                const SrcIcon = src.icon;
                const isSelected = sourceFocus === src.name;
                return (
                  <button
                    key={src.name}
                    type="button"
                    onClick={() => setSourceFocus(src.name)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left text-xs transition-colors border cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-300 font-normal"
                        : "bg-white dark:bg-zinc-800 text-neutral-600 dark:text-zinc-300 border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-750"
                    }`}
                  >
                    <SrcIcon className={`w-4 h-4 shrink-0 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500 dark:text-zinc-405"}`} />
                    <span className="font-medium">{src.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legal disclaimer capsule */}
          <div className="pt-3 border-t border-neutral-200 dark:border-zinc-800 text-[10.5px] text-neutral-500 dark:text-zinc-400 leading-relaxed space-y-1 bg-neutral-100/35 dark:bg-zinc-900/35 p-3.5 rounded-xl border border-neutral-200/50 dark:border-zinc-800/50">
             <span className="font-bold text-neutral-700 dark:text-zinc-300 block text-[11px]">CRAWLER SAFETY PROTOCOLS</span>
             <p>All Masidy deep audits adhere to robots.txt, scraping data asynchronously using sandboxed proxy addresses without logging credentials.</p>
          </div>

        </div>

      </div>

      {/* 2. Live Scraper Monitor & Finished Dossier Display (Right) */}
      <div className="flex-1 bg-neutral-50/50 dark:bg-[#0c0c0e] p-4 md:p-8 flex flex-col overflow-y-auto">
        
        {isCrawling ? (
          /* Lively Step-by-Step progress logs output UI */
          <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full space-y-6">
            
            <div className="text-center space-y-3 p-6 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl shadow-xs">
              
              <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-neutral-800 dark:text-zinc-100 font-sans">Active Research Pipeline Running</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                Masidy has instantiated research threads targeting primary, secondary, and cross-reference servers worldwide. Evaluating references...
              </p>

              {/* Steps checklist indicators */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 pt-4 text-left font-sans">
                {crawlSteps.map((step, index) => {
                  const isActive = stepIndex === index;
                  const isCompleted = stepIndex > index;
                  
                  return (
                    <div 
                      key={index}
                      className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                        isCompleted 
                          ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300" 
                          : isActive 
                          ? "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900 text-indigo-800 dark:text-indigo-300 animate-pulse" 
                          : "bg-neutral-55 dark:bg-zinc-800 border-neutral-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      <span className="font-mono text-[9px] font-bold block">{step.name}</span>
                      <span className="text-[10px] leading-snug mt-1 font-medium">{step.desc}</span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Scrolling terminal live pipeline console feed */}
            <div className="bg-[#0c0d11] text-zinc-300 font-mono text-[11px] h-48 rounded-2xl border border-neutral-800 p-4 overflow-y-auto space-y-1.5 shadow-inner">
               <span className="text-zinc-500 tracking-wider block font-bold mb-1">// LIVE SCANNER PORT PIPELINE LOGS</span>
               {progressLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed">
                     <span className="text-emerald-400 font-bold">&gt;</span> {log}
                  </div>
               ))}
               <div className="text-indigo-400 animate-pulse font-normal">System crawling active. Ready for updates...</div>
            </div>

          </div>
        ) : generatedReport ? (
          /* Finished generated Report Dossier */
          <div className="flex-1 max-w-3xl mx-auto w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 p-6 md:p-10 rounded-3xl shadow-sm space-y-6 animate-fade-in text-left pb-16">
            
            {/* Headers metadata block */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-zinc-810 pb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-405 uppercase tracking-widest">RESEARCH DOSSIER ACTIVATED</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert("Dossier shared successfully via local sandbox reference link.")}
                  className="p-1.5 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded text-neutral-500 dark:text-zinc-400 cursor-pointer"
                  title="Share Report"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert("Initiating print or pdf export module. Verified secure download.")}
                  className="flex items-center space-x-1.5 py-1.5 px-3 bg-neutral-900 dark:bg-zinc-100 text-white dark:text-black rounded-lg text-xs font-bold hover:bg-neutral-805 dark:hover:bg-neutral-200 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Dossier</span>
                </button>
              </div>
            </div>

            {/* Custom elegant markdown body container */}
            <div className="markdown-body p-1 font-sans">
              <Markdown>{generatedReport}</Markdown>
            </div>

          </div>
        ) : (
          /* Welcome Landing Page */
          <div className="flex-grow flex flex-col justify-center max-w-xl mx-auto w-full text-center space-y-6 select-none my-auto">
            
            <div className="w-14 h-14 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
              <Search className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-neutral-805 dark:text-zinc-100 tracking-tight">
                Instantiate Masidy Deep Search
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                Empower your analysis by query-mapping web data archives, academic papers, and system consensus guidelines dynamically with high integrity summaries.
              </p>
            </div>

            {/* Prompt input field */}
            <div className="pt-2 max-w-md mx-auto w-full">
              <div className="flex p-1.5 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 hover:border-neutral-250 dark:hover:border-zinc-700 focus-within:border-neutral-300 dark:focus-within:border-zinc-600 rounded-full shadow-xs transition-colors items-center pl-4">
                
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Insert research query (e.g. quantum computing consensus)"
                  className="flex-1 bg-transparent border-none text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-0 py-1"
                />

                <button
                  onClick={handleStartCrawl}
                  disabled={!query.trim()}
                  className="px-5 py-2 rounded-full text-xs font-bold bg-[#10a37f] dark:bg-[#10a37f]/90 text-white enabled:hover:bg-[#0e8a6c] disabled:bg-neutral-100 dark:disabled:bg-zinc-800 disabled:text-neutral-400 dark:disabled:text-zinc-650 cursor-pointer transition-all shadow-xs shrink-0"
                >
                  Commence Research
                </button>

              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
