import React, { useState } from "react";
import { Sparkles, Download, Copy, RefreshCw, Image as ImageIcon, Sliders, CheckCircle2, Eye, Compass, Maximize2 } from "lucide-react";

export default function ImagesStudio() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Vaporwave Sunset");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [resolution, setResolution] = useState("1080p HD");
  const [renderSteps, setRenderSteps] = useState<string[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Creative preloaded design pool
  const styleDesigns: { [key: string]: string } = {
    "Vaporwave Sunset": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    "Photorealistic Workspace": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
    "Fantasy Castles": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
    "Futuristic Wireframe": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=600&auto=format&fit=crop",
    "Corporate Isometric": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
    "Cybernetic Avatar": "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop",
  };

  const handleSynthesize = () => {
    if (!prompt.trim()) return alert("Please specify a prompt to synthesize visual coordinates.");
    setIsSynthesizing(true);
    setRenderSteps([]);
    setGeneratedImage(null);

    const logs = [
      "Analyzing prompt semantic vectors...",
      "Resolving visual theme contrast coefficients...",
      "Executing stable diffusion pass #1 (Form outlining)...",
      "Executing stable diffusion pass #2 (Texture injection)...",
      "Injecting atmospheric ambient shadows...",
      "Upscaling and baking metadata layers...",
      "Validating compression artifacts..."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setRenderSteps(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsSynthesizing(false);
          // Set image matching selected style or defaults
          const matchedImage = styleDesigns[selectedStyle] || styleDesigns["Vaporwave Sunset"];
          setGeneratedImage(matchedImage);
        }
      }, (index + 1) * 450);
    });
  };

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(prompt);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="images-studio" className="flex-1 bg-white dark:bg-[#0c0c0e] flex flex-col md:flex-row h-full overflow-hidden font-sans transition-colors duration-150">
      
      {/* 1. Configuration Sidebar (Left) */}
      <div className="w-full md:w-80 border-r border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900/50 flex flex-col h-full shrink-0 select-none pb-12 overflow-y-auto">
        
        {/* Module title */}
        <div className="p-4 border-b border-neutral-200 dark:border-zinc-805">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-800 dark:text-zinc-100">Masidy Visual Studio</h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Model: Masidy Diffuse 2.0</p>
            </div>
          </div>
        </div>

        {/* Configurations Form */}
        <div className="p-4 space-y-5">
          
          {/* Style presets selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider block">
              Renderer Style Preset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(styleDesigns).map((styleName) => (
                <button
                  key={styleName}
                  type="button"
                  onClick={() => setSelectedStyle(styleName)}
                  className={`p-2 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                    selectedStyle === styleName
                      ? "bg-neutral-900 dark:bg-zinc-100 text-white dark:text-black border-neutral-900 dark:border-zinc-100 font-semibold shadow-xs"
                      : "bg-white dark:bg-zinc-800 text-neutral-605 dark:text-zinc-300 border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-750"
                  }`}
                >
                  <span className="block truncate">{styleName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect ratio slider selections */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider block">
              Aspect Ratio Matcher
            </label>
            <div className="flex space-x-2">
              {["1:1 Sq", "16:9 HD", "9:16 Port", "4:3 Classic"].map((ar) => (
                <button
                  key={ar}
                  type="button"
                  onClick={() => setAspectRatio(ar)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
                    aspectRatio === ar
                      ? "bg-neutral-850 dark:bg-zinc-100 text-white dark:text-black border-neutral-850 dark:border-zinc-150"
                      : "bg-white dark:bg-zinc-800 text-neutral-600 dark:text-zinc-300 border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-750"
                  }`}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>

          {/* Target resolution preferences */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider block">
              Resolution Scale
            </label>
            <div className="flex space-x-2">
              {["1080p HD", "2K UHD", "4K Extreme"].map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setResolution(res)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
                    resolution === res
                      ? "bg-neutral-850 dark:bg-zinc-100 text-white dark:text-black border-neutral-850 dark:border-zinc-155"
                      : "bg-white dark:bg-zinc-800 text-neutral-600 dark:text-zinc-300 border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-750"
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-zinc-800">
             <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-amber-800 dark:text-amber-305 text-xs leading-relaxed space-y-1">
                <span className="font-bold flex items-center space-x-1">
                   <span>Unlimited GPU Pool active</span>
                </span>
                <p>Compile visual prototypes instantaneously with lightning-fast cloud accelerators.</p>
             </div>
          </div>

        </div>

      </div>

      {/* 2. Visual Render Output Pane (Right) */}
      <div className="flex-1 bg-neutral-50 dark:bg-[#0c0c0e] p-4 md:p-8 flex flex-col justify-between overflow-y-auto">
        
        {/* Core display area */}
        <div className="flex-1 flex items-center justify-center max-w-2xl mx-auto w-full">
          
          {isSynthesizing ? (
            /* Lively Step-by-Step progress bar list */
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-neutral-200 dark:border-zinc-800 shadow-sm space-y-5">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-spin" />
                <span className="text-sm font-semibold text-neutral-800 dark:text-zinc-200">Synthesizing Visual Core</span>
              </div>
              
              {/* Fake status bar loader */}
              <div className="w-full bg-neutral-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-600 dark:bg-indigo-400 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${(renderSteps.length / 7) * 100}%` }}
                ></div>
              </div>

              {/* Progress Logs */}
              <div className="space-y-1.5 font-mono text-[11px] text-neutral-500 dark:text-zinc-400 bg-neutral-50 dark:bg-zinc-950 p-4 rounded-xl border border-neutral-200 dark:border-zinc-800/80 overflow-y-auto max-h-48 leading-relaxed">
                {renderSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : generatedImage ? (
            /* Rendered Image Viewer */
            <div className="w-full bg-white dark:bg-zinc-900/40 p-4 rounded-3xl border border-neutral-200 dark:border-zinc-800 shadow-xs space-y-4 animate-fade-in text-left">
              
              {/* Actual Image Tag */}
              <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-zinc-800 group flex items-center justify-center">
                <img 
                  src={generatedImage} 
                  alt="Generated visual asset" 
                  className="max-h-[380px] object-cover rounded-2xl w-full "
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual hover quick indicators */}
                <span className="absolute bottom-3 right-3 py-1 px-2.5 bg-black/70 text-white font-mono text-[10px] rounded uppercase tracking-wider">
                  {resolution} | {aspectRatio}
                </span>
              </div>

              {/* Interaction controllers */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-zinc-100 truncate max-w-xs">{prompt}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-450 font-medium">Style option: {selectedStyle}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => alert(`Copied prompt metadata to clipboard.`)}
                    className="p-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-neutral-650 dark:text-zinc-300 cursor-pointer transition-colors"
                    title="Copy attributes config"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={generatedImage}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-neutral-650 dark:text-zinc-300 cursor-pointer transition-colors flex items-center justify-center"
                    title="View Full Quality"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => alert("Downloading source elements completed successfully.")}
                    className="flex items-center space-x-1.5 py-2 px-4 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-black rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Starting Instructions empty display screen */
            <div className="text-center space-y-4 max-w-sm select-none">
              <div className="w-14 h-14 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-neutral-400 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <ImageIcon className="w-6 h-6 text-neutral-400 dark:text-zinc-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-800 dark:text-zinc-100">Visual Art Renderer</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">
                  Specify creative parameters below or choose design style templates to instantiate visual matrices instantly.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Input Bar (Bottom) */}
        <div className="max-w-2xl mx-auto w-full pt-4">
          <div className="flex items-center bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-xs rounded-full p-1.5 pl-4 focus-within:border-neutral-300 dark:focus-within:border-zinc-750 transition-colors">
            
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isSynthesizing}
              placeholder="What do you want to create? (e.g. elegant workspace with warm plants)"
              className="flex-1 bg-transparent border-none text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-0 py-1.5"
            />

            <button
              onClick={handleSynthesize}
              disabled={isSynthesizing || !prompt.trim()}
              className="px-5 py-2 rounded-full text-xs font-bold bg-neutral-900 dark:bg-zinc-100 text-white dark:text-black enabled:hover:bg-neutral-800 dark:enabled:hover:bg-zinc-200 disabled:bg-neutral-100 dark:disabled:bg-zinc-800 disabled:text-neutral-400 dark:disabled:text-zinc-600 cursor-pointer transition-colors"
            >
              Render Visual
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}
