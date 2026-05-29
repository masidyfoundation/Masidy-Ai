import React, { useState, useRef } from "react";
import { Search, Loader2, FileText, Download, ExternalLink, Globe, Zap, BookOpen } from "lucide-react";
import Markdown from "react-markdown";

interface Source {
  title: string;
  url: string;
}

interface ResearchResult {
  query: string;
  report: string;
  sources: Source[];
  provider: string;
  result_count: number;
}

const DEPTH_OPTIONS = [
  { id: "Quick", label: "Quick", desc: "~30s", detail: "Fast overview" },
  { id: "Thorough", label: "Thorough", desc: "~60s", detail: "Detailed analysis" },
  { id: "Exhaustive", label: "Exhaustive", desc: "~2min", detail: "Deep dive" },
];

const EXAMPLE_QUERIES = [
  "Latest developments in artificial intelligence 2026",
  "How does quantum computing work",
  "Best practices for building a startup",
  "Climate change solutions and technologies",
  "Future of electric vehicles",
];

export default function DeepResearch() {
  const [query, setQuery] = useState("");
  const [depth, setDepth] = useState("Thorough");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (customQuery?: string) => {
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) { inputRef.current?.focus(); return; }

    setIsSearching(true);
    setResult(null);
    setError(null);
    if (customQuery) setQuery(customQuery);

    try {
      setStep("Searching the web...");
      await new Promise(r => setTimeout(r, 500));
      setStep("Gathering sources and content...");

      const resp = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: finalQuery, depth }),
      });

      setStep("Synthesizing research report...");
      const data = await resp.json();

      if (data.success && data.report) {
        setResult(data);
      } else {
        setError(data.report || "No results found. Try a different search term.");
      }
    } catch (e) {
      setError("Search is temporarily unavailable. Please try again.");
    } finally {
      setIsSearching(false);
      setStep("");
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const content = `# Research Report: ${result.query}\n\n${result.report}\n\n## Sources\n${result.sources.map(s => `- [${s.title}](${s.url})`).join("\n")}`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `masidy-research-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-white dark:bg-[#0c0c0e] flex flex-col md:flex-row h-full overflow-hidden font-sans">

      {/* Left panel */}
      <div className="w-full md:w-72 border-r border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900/40 flex flex-col shrink-0 overflow-y-auto">

        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <Search className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-zinc-100">Masidy Deep Research</h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Real web search · AI synthesis</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-5 flex-1">

          {/* Depth */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider block">Research Depth</label>
            <div className="space-y-1.5">
              {DEPTH_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDepth(opt.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                    depth === opt.id
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm"
                      : "bg-white dark:bg-zinc-800 text-neutral-600 dark:text-zinc-300 border-neutral-200 dark:border-zinc-700 hover:border-neutral-300"
                  }`}
                >
                  <span className="font-bold">{opt.label}</span>
                  <div className="text-right">
                    <span className={`block text-[10px] ${depth === opt.id ? "opacity-70" : "text-zinc-400"}`}>{opt.desc}</span>
                    <span className={`block text-[9px] ${depth === opt.id ? "opacity-60" : "text-zinc-400"}`}>{opt.detail}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Example queries */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider block">Try These</label>
            <div className="space-y-1.5">
              {EXAMPLE_QUERIES.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(q)}
                  disabled={isSearching}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-xs text-neutral-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs text-indigo-700 dark:text-indigo-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Globe className="w-3.5 h-3.5" />
              <span>Real Web Search</span>
            </div>
            <p className="text-[10px] leading-relaxed opacity-80">Searches the live web and synthesizes results into a structured report with sources.</p>
          </div>

        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">

          {isSearching ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6 max-w-md mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-800 dark:text-zinc-100">Researching...</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{step}</p>
              </div>
              <div className="w-48 h-1.5 bg-neutral-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full animate-pulse w-2/3" />
              </div>
            </div>

          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 max-w-md mx-auto text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <Search className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button onClick={() => handleSearch()} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg cursor-pointer">
                Try Again
              </button>
            </div>

          ) : result ? (
            <div className="max-w-3xl mx-auto space-y-6">

              {/* Report header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Research Report</span>
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full">
                    {result.result_count} sources
                  </span>
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>

              {/* Report content */}
              <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <div className="prose dark:prose-invert max-w-none text-sm">
                  <Markdown>{result.report}</Markdown>
                </div>
              </div>

              {/* Sources */}
              {result.sources.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Sources ({result.sources.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {result.sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
                      >
                        <div className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                          <Globe className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-neutral-800 dark:text-zinc-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{source.title}</p>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">{source.url}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-neutral-300 dark:text-zinc-600 group-hover:text-indigo-500 shrink-0 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>

          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-8 max-w-lg mx-auto text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-600/10 border border-indigo-200 dark:border-indigo-800/30 flex items-center justify-center mx-auto">
                  <Search className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-neutral-800 dark:text-zinc-100">Research anything on the web</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                  Masidy searches the live web, gathers real sources, and synthesizes a comprehensive report — all in seconds.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
                <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /><span>Live web search</span></div>
                <div className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /><span>AI synthesis</span></div>
                <div className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /><span>Real sources</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Search input */}
        <div className="p-4 border-t border-neutral-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e]">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isSearching && handleSearch()}
              disabled={isSearching}
              placeholder="Search anything — news, science, technology, history..."
              className="flex-1 px-4 py-3 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm text-neutral-900 dark:text-zinc-100 placeholder:text-neutral-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button
              onClick={() => handleSearch()}
              disabled={isSearching || !query.trim()}
              className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl cursor-pointer transition-all shadow-sm flex items-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Research</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
