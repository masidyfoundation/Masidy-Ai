import React, { useRef, useState, useEffect } from "react";
import { Send, Plus, Mic, Paperclip, X, Volume2, VolumeX, FileCode } from "lucide-react";
import { Message, MasidyModel } from "../types";

interface InputBarProps {
  onSendMessage: (msg: string) => void;
  disabled: boolean;
  messages: Message[];
  selectedModel?: string;
  availableModels?: MasidyModel[];
  onModelChange?: (modelId: string) => void;
}

export default function InputBar({ 
  onSendMessage, 
  disabled, 
  messages = [], 
  selectedModel = "masidy-pro",
  availableModels = [],
  onModelChange
}: InputBarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // States for real interactions
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; content?: string } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Auto focus input on load
  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  // Clean speaking on unmount and clear submit timeout
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  // Expand text input height automatically
  useEffect(() => {
    const txt = textareaRef.current;
    if (txt) {
      txt.style.height = "auto";
      txt.style.height = `${Math.min(txt.scrollHeight, 140)}px`;
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || submitTimeoutRef.current) return;

    let finalMessage = value;
    if (attachedFile) {
      finalMessage = `[Attached File: ${attachedFile.name} (${attachedFile.size})]\n\n${value || "Analyzing uploaded attachment contents."}`;
    }

    if (!finalMessage.trim()) return;

    submitTimeoutRef.current = setTimeout(() => {
      submitTimeoutRef.current = null;
    }, 500);

    onSendMessage(finalMessage);
    setValue("");
    setAttachedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !submitTimeoutRef.current) {
        handleSubmit(e as any);
      }
    }
  };

  // Real File Upload trigger
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeKb = (file.size / 1024).toFixed(1);
      setAttachedFile({
        name: file.name,
        size: `${sizeKb} KB`
      });
    }
  };

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  // Real voice speech detection
  const handleToggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Vocal Speech recognition is not fully supported in this web browser sandbox. Check Chrome/Safari compatibility.");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";
      
      rec.onstart = () => {
        setIsListening(true);
      };
      
      rec.onresult = (event: any) => {
        const textTranscript = event.results[0][0].transcript;
        if (textTranscript) {
          setValue(prev => prev ? prev + " " + textTranscript : textTranscript);
        }
        setIsListening(false);
      };

      rec.onerror = (err: any) => {
        console.error("Speech transcription error:", err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  // Real synthesized system voice feedback
  const handleToggleSpeak = () => {
    if (!window.speechSynthesis) {
      alert("Text-To-Speech audio output is not supported by your current browser environment.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Grab latest message from AI
    const lastAI = [...messages].reverse().find(m => m.role === "assistant");
    const phrase = lastAI 
      ? lastAI.content.replace(/[#*`_\-\(\)\[\]]/g, "") // strip markdown tokens
      : "I am ready to synthesize your text. Ask me anything to formulate deep workspace analysis.";

    const utterance = new SpeechSynthesisUtterance(phrase);
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (err) => {
      console.error("Text-To-Speech synthesizer fault:", err);
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-gradient-to-b from-white to-neutral-50 dark:from-[#0c0c0e] dark:to-zinc-950 px-4 pb-4 select-none shrink-0 font-sans transition-colors duration-150 border-t border-neutral-200 dark:border-zinc-800/50">
      <div className="max-w-3xl mx-auto w-full">
        
        {/* Model Selector */}
        {availableModels.length > 0 && (
          <div className="mb-4 flex items-center gap-2.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => {
                const newModel = e.target.value;
                if (newModel !== selectedModel) {
                  onModelChange?.(newModel);
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-all shadow-sm hover:shadow-md"
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Attachment bubble chip if an active file is cached */}
        {attachedFile && (
          <div className="mb-3 flex items-center space-x-2 p-2 px-3.5 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 border border-indigo-200 dark:border-indigo-700/50 rounded-full w-max text-xs font-semibold animate-in slide-in-from-bottom-2 select-none shadow-sm">
            <FileCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-indigo-900 dark:text-indigo-200 truncate max-w-xs">{attachedFile.name} ({attachedFile.size})</span>
            <button 
              type="button" 
              onClick={() => setAttachedFile(null)}
              className="p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-700 rounded-full cursor-pointer text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Hidden Native Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          className="hidden" 
        />

        {/* Rounded Input Pill exactly mirroring top-tier UI */}
        <form 
          onSubmit={handleSubmit} 
          className="relative flex items-center bg-gradient-to-r from-white to-slate-50 dark:from-zinc-900 dark:to-zinc-950 border border-slate-300 dark:border-zinc-700 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 focus-within:shadow-lg focus-within:ring-2 focus:ring-indigo-500/20 rounded-full px-4 py-2.5 hover:border-slate-350 dark:hover:border-zinc-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          
          {/* plus/attachment trigger */}
          <button
            type="button"
            onClick={triggerSelectFile}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-zinc-800/80 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer shrink-0"
            title="Attach a computer file or analytical workbook"
          >
            <Plus className="w-5 h-5" />
          </button>
 
          {/* Core TextInput */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? "Masidy is formulating responses..." : "How can Masidy help you today?"}
            className="flex-1 bg-transparent border-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-[14.5px] focus:outline-none focus:ring-0 resize-none py-1.5 px-3.5 disabled:cursor-not-allowed max-h-32 scrollbar-none overflow-y-auto leading-relaxed"
            style={{ height: "auto" }}
          />
 
          {/* Right Mic icon & Vocal badge */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleListen}
              className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                isListening 
                  ? "bg-red-500 text-white animate-pulse shadow-md" 
                  : "hover:bg-slate-200 dark:hover:bg-zinc-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
              title={isListening ? "Listening - speak now..." : "Start Transcribing Voice Input"}
            >
              <Mic className={`w-4 h-4 ${isListening ? "text-white" : ""}`} />
            </button>
 
            {/* Vocal pill badge */}
            <button
              type="button"
              onClick={handleToggleSpeak}
              className={`px-3 py-1 ${
                isSpeaking 
                  ? "bg-red-500 dark:bg-red-600 text-white" 
                  : "bg-slate-200 hover:bg-slate-250 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              } font-semibold text-[11px] rounded-full flex items-center space-x-1.5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md`}
              title={isSpeaking ? "Turn off speak-aloud audio output" : "Synthesize voice feedback readout of top-reply"}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-white animate-bounce" />
                  <span>Stifled</span>
                </>
              ) : (
                <>
                  <span className="w-1 h-2 bg-zinc-500 dark:bg-zinc-400 rounded-full inline-block animate-pulse"></span>
                  <span className="w-1 h-3 bg-zinc-600 dark:bg-zinc-350 rounded-full inline-block animate-pulse"></span>
                  <span>Speak</span>
                </>
              )}
            </button>
 
            {/* Submit Send arrow button on far right when typing is active or file attached */}
            {(value.trim() || attachedFile) && (
              <button
                type="submit"
                disabled={disabled}
                className="p-2 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 transition-all duration-200 cursor-pointer flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                title="Send to Masidy Analytics Model"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
 
        </form>
 
        {/* Footer Disclaimer exactly matching screenshot copy */}
        <p className="text-[11px] text-[#8e8e8e] dark:text-zinc-550 text-center mt-2 font-normal leading-normal">
          By chatting with Masidy, an AI workspace assistant, you agree to our{" "}
          <a href="#" className="underline hover:text-zinc-650 dark:hover:text-zinc-400" onClick={(e) => { e.preventDefault(); alert("Masidy standard license and terms of service guidelines."); }}>Terms of Service</a>{" "}
          and confirm that you have read the custom{" "}
          <a href="#" className="underline hover:text-zinc-605 dark:hover:text-zinc-400" onClick={(e) => { e.preventDefault(); alert("Masidy user data privacy policies."); }}>Privacy Agreement</a>.
        </p>
 
      </div>
    </div>
  );
}
