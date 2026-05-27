import React, { useRef, useState, useEffect } from "react";
import { Send, Plus, Mic, Paperclip, X, Volume2, VolumeX, FileCode } from "lucide-react";
import { Message } from "../types";

interface InputBarProps {
  onSendMessage: (msg: string) => void;
  disabled: boolean;
  messages: Message[];
}

export default function InputBar({ onSendMessage, disabled, messages = [] }: InputBarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Clean speaking on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
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
    if (disabled) return;

    let finalMessage = value;
    if (attachedFile) {
      finalMessage = `[Attached File: ${attachedFile.name} (${attachedFile.size})]\n\n${value || "Analyzing uploaded attachment contents."}`;
    }

    if (!finalMessage.trim()) return;

    onSendMessage(finalMessage);
    setValue("");
    setAttachedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled) {
        handleSubmit(e);
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
    <div className="bg-white dark:bg-[#0c0c0e] px-4 pb-4 select-none shrink-0 font-sans transition-colors duration-150">
      <div className="max-w-3xl mx-auto w-full">
        
        {/* Attachment bubble chip if an active file is cached */}
        {attachedFile && (
          <div className="mb-2 flex items-center space-x-2 p-1.5 px-3 bg-neutral-100 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700/80 rounded-full w-max text-xs font-semibold animate-in slide-in-from-bottom-2 select-none">
            <FileCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-xs">{attachedFile.name} ({attachedFile.size})</span>
            <button 
              type="button" 
              onClick={() => setAttachedFile(null)}
              className="p-0.5 hover:bg-neutral-250 dark:hover:bg-zinc-700 rounded-full cursor-pointer text-zinc-400 hover:text-red-500"
            >
              <X className="w-3 h-3" />
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
          className="relative flex items-center bg-[#f4f4f4] dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 focus-within:border-neutral-300 dark:focus-within:border-zinc-700 rounded-full px-4 py-2 hover:border-neutral-250 dark:hover:border-zinc-800 transition-all duration-150"
        >
          
          {/* plus/attachment trigger */}
          <button
            type="button"
            onClick={triggerSelectFile}
            className="p-1.5 hover:bg-neutral-200/60 dark:hover:bg-zinc-800/80 rounded-full text-zinc-500 hover:text-zinc-805 transition-colors cursor-pointer shrink-0"
            title="Attach a computer file or analytical workbook"
          >
            <Plus className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
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
              className={`p-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                isListening 
                  ? "bg-red-500 text-white animate-pulse shadow-md" 
                  : "hover:bg-neutral-200/60 dark:hover:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100"
              }`}
              title={isListening ? "Listening - speak now..." : "Start Transcribing Voice Input"}
            >
              <Mic className={`w-4 h-4 ${isListening ? "text-white" : "text-zinc-505 dark:text-zinc-400"}`} />
            </button>
 
            {/* Vocal pill badge */}
            <button
              type="button"
              onClick={handleToggleSpeak}
              className={`px-2.5 py-1 ${
                isSpeaking 
                  ? "bg-indigo-650 dark:bg-indigo-600 text-white" 
                  : "bg-zinc-200/80 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              } font-semibold text-[11px] rounded-full flex items-center space-x-1.5 transition-colors cursor-pointer shadow-none`}
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
                className="p-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-850 dark:hover:bg-neutral-100 transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                title="Send to Masidy Analytics Model"
              >
                <Send className="w-4 h-4 text-white dark:text-black" />
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
