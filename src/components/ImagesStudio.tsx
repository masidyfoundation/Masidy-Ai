import React, { useState, useRef } from "react";
import { Sparkles, Download, RefreshCw, ImageIcon, Maximize2, X, Wand2, Lock } from "lucide-react";

const STYLES = [
  { id: "Photorealistic", label: "Photorealistic", emoji: "📷" },
  { id: "Digital Art", label: "Digital Art", emoji: "🎨" },
  { id: "Cinematic", label: "Cinematic", emoji: "🎬" },
  { id: "Anime", label: "Anime", emoji: "✨" },
  { id: "Oil Painting", label: "Oil Painting", emoji: "🖼️" },
  { id: "Cyberpunk", label: "Cyberpunk", emoji: "🌆" },
  { id: "Fantasy", label: "Fantasy", emoji: "🔮" },
  { id: "Minimalist", label: "Minimalist", emoji: "⬜" },
  { id: "Watercolor", label: "Watercolor", emoji: "💧" },
  { id: "3D Render", label: "3D Render", emoji: "🧊" },
];

const RATIOS = [
  { id: "1:1", label: "1:1", desc: "Square" },
  { id: "16:9", label: "16:9", desc: "Landscape" },
  { id: "9:16", label: "9:16", desc: "Portrait" },
  { id: "4:3", label: "4:3", desc: "Classic" },
];

const SUGGESTIONS = [
  "A futuristic city at night with neon lights reflecting on wet streets",
  "A serene Japanese garden with cherry blossoms and a koi pond",
  "An astronaut floating in space with Earth in the background",
  "A cozy coffee shop interior with warm lighting and books",
  "A majestic dragon flying over snow-capped mountains",
  "A minimalist home office with plants and natural light",
];

interface GeneratedImage {
  url: string;
  prompt: string;
  style: string;
  ratio: string;
  seed: number;
}

export default function ImagesStudio() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Photorealistic");
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const STYLE_ENHANCERS: Record<string, string> = {
    "Photorealistic": "photorealistic, ultra detailed, 8k, professional photography, sharp focus, cinematic lighting",
    "Digital Art": "digital art, concept art, highly detailed, vibrant colors, artstation trending, smooth",
    "Cinematic": "cinematic shot, movie still, dramatic lighting, anamorphic lens, film grain, epic composition",
    "Anime": "anime style, studio ghibli inspired, detailed illustration, vibrant, clean lines",
    "Oil Painting": "oil painting, classical art style, rich textures, masterpiece, museum quality",
    "Minimalist": "minimalist design, clean, simple, modern, white background, elegant",
    "Fantasy": "fantasy art, magical, ethereal, epic, detailed environment, mystical atmosphere",
    "Cyberpunk": "cyberpunk, neon lights, futuristic city, rain, dark atmosphere, blade runner style",
    "Watercolor": "watercolor painting, soft colors, artistic, flowing, delicate brushstrokes",
    "3D Render": "3d render, octane render, blender, physically based rendering, studio lighting, 4k",
  };

  const DIMENSIONS: Record<string, [number, number]> = {
    "1:1": [1024, 1024], "16:9": [1344, 768], "9:16": [768, 1344], "4:3": [1152, 896],
  };

  const handleGenerate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) { inputRef.current?.focus(); return; }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const enhancer = STYLE_ENHANCERS[selectedStyle] || "";
      const fullPrompt = `${finalPrompt}, ${enhancer}`;
      const [width, height] = DIMENSIONS[selectedRatio] || [1024, 1024];
      const seed = Math.floor(Math.random() * 999999);
      const encodedPrompt = encodeURIComponent(fullPrompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true`;

      // Pre-load to confirm generation succeeded
      await new Promise<void>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed"));
        img.src = imageUrl;
        setTimeout(() => reject(new Error("Timeout")), 90000);
      });

      const generated: GeneratedImage = { url: imageUrl, prompt: finalPrompt, style: selectedStyle, ratio: selectedRatio, seed };
      setGeneratedImage(generated);
      setHistory(prev => [generated, ...prev.slice(0, 7)]);
      if (customPrompt) setPrompt(customPrompt);
    } catch (e) {
      setError("Something went wrong generating your image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `masidy-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(generatedImage.url, "_blank");
    }
  };

  const handleRegenerate = () => {
    if (generatedImage) handleGenerate(generatedImage.prompt);
  };

  return (
    <div className="flex-1 bg-white dark:bg-[#0c0c0e] flex flex-col h-full overflow-hidden font-sans">

      {/* Fullscreen overlay */}
      {fullscreen && generatedImage && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setFullscreen(false)}>
          <button className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition">
            <X className="w-5 h-5" />
          </button>
          <img src={generatedImage.url} alt={generatedImage.prompt} className="max-w-full max-h-full object-contain" />
        </div>
      )}

      <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">

        {/* Left panel — controls */}
        <div className="w-full md:w-72 border-r border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900/40 flex flex-col shrink-0 overflow-y-auto">

          {/* Header */}
          <div className="p-4 border-b border-neutral-200 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Wand2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-zinc-100">Masidy Visual Studio</h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Powered by FLUX · Free</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-5 flex-1">

            {/* Style selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider block">Style</label>
              <div className="grid grid-cols-2 gap-1.5">
                {STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                      selectedStyle === style.id
                        ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                        : "bg-white dark:bg-zinc-800 text-neutral-600 dark:text-zinc-300 border border-neutral-200 dark:border-zinc-700 hover:border-neutral-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <span>{style.emoji}</span>
                    <span className="truncate">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect ratio */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider block">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-1.5">
                {RATIOS.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio.id)}
                    className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedRatio === ratio.id
                        ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                        : "bg-white dark:bg-zinc-800 text-neutral-600 dark:text-zinc-300 border border-neutral-200 dark:border-zinc-700 hover:border-neutral-300"
                    }`}
                  >
                    <span className="font-bold">{ratio.label}</span>
                    <span className="text-[9px] opacity-70">{ratio.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider block">Recent</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {history.slice(0, 6).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setGeneratedImage(img)}
                      className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all cursor-pointer"
                    >
                      <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right panel — output */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

          {/* Main canvas */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">

            {isGenerating ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg animate-pulse">
                  <Wand2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-800 dark:text-zinc-100">Generating your image...</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">This takes 10–20 seconds</p>
                </div>
                <div className="w-48 h-1.5 bg-neutral-200 dark:bg-zinc-800 rounded-full overflow-hidden mx-auto">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full animate-pulse w-3/4" />
                </div>
              </div>

            ) : error ? (
              <div className="text-center space-y-3 max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto">
                  <X className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                <button onClick={() => handleGenerate()} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg cursor-pointer">
                  Try Again
                </button>
              </div>

            ) : generatedImage ? (
              <div className="w-full max-w-2xl space-y-4">
                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden bg-neutral-900 shadow-xl group">
                  <img
                    src={generatedImage.url}
                    alt={generatedImage.prompt}
                    className="w-full object-contain max-h-[500px]"
                    onError={() => setError("Image failed to load. Please try again.")}
                  />
                  <button
                    onClick={() => setFullscreen(true)}
                    className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 text-white text-[10px] font-mono rounded">
                    {generatedImage.style} · {generatedImage.ratio}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">{generatedImage.prompt}</p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={handleRegenerate}
                      className="flex items-center gap-1.5 px-3 py-2 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-neutral-700 dark:text-zinc-300 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Regenerate
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 px-3 py-2 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-black text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              </div>

            ) : (
              <div className="text-center space-y-6 max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-600/10 border border-violet-200 dark:border-violet-800/30 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-7 h-7 text-violet-500 dark:text-violet-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-800 dark:text-zinc-100">Create anything you imagine</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Type a description below and Masidy will generate a high-quality image using FLUX AI.
                  </p>
                </div>
                {/* Suggestions */}
                <div className="grid grid-cols-1 gap-2 text-left">
                  {SUGGESTIONS.slice(0, 3).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleGenerate(s)}
                      className="px-3 py-2.5 bg-neutral-50 dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs text-neutral-600 dark:text-zinc-400 text-left cursor-pointer transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="p-4 border-t border-neutral-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e]">
            <div className="flex gap-2 max-w-2xl mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isGenerating && handleGenerate()}
                disabled={isGenerating}
                placeholder="Describe what you want to create..."
                className="flex-1 px-4 py-3 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 rounded-xl text-sm text-neutral-900 dark:text-zinc-100 placeholder:text-neutral-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating || !prompt.trim()}
                className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md flex items-center gap-2 shrink-0"
              >
                <Wand2 className="w-4 h-4" />
                <span className="hidden sm:inline">Generate</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
