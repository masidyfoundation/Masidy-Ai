import React, { useState, useEffect } from "react";
import StatusBar from "./components/StatusBar";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import InputBar from "./components/InputBar";
import SettingsSuite from "./components/SettingsSuite";
import ImagesStudio from "./components/ImagesStudio";
import DeepResearch from "./components/DeepResearch";
import PlansPricing from "./components/PlansPricing";
import SystemGuide from "./components/SystemGuide";
import ModelSelector from "./components/ModelSelector";
import ToastContainer from "./components/ToastContainer";
import { Conversation, Message, MasidyModel } from "./types";

interface ToastMessage {
  id: string;
  type: "error" | "success" | "info";
  message: string;
  duration?: number;
}

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Navigation active state
  const [activeView, setActiveView] = useState<"chat" | "images" | "research" | "pricing" | "guide">("chat");
  const [status, setStatus] = useState<"ONLINE" | "THINKING" | "RESEARCHING" | "OFFLINE">("ONLINE");
  const [isThinking, setIsThinking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Masidy Model selection
  const [selectedModel, setSelectedModel] = useState(() => {
    const saved = localStorage.getItem("masidy_selected_model");
    return saved || "masidy-pro";
  });
  const [availableModels, setAvailableModels] = useState<MasidyModel[]>([]);

  // Loaded user profile preferences
  const [username, setUsername] = useState("Masidy User");
  const [avatarColor, setAvatarColor] = useState("indigo");
  const [activePlan, setActivePlan] = useState("FREE");

  // Sidebar states for dynamic adjustments & complete workspace full screening
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem("masidy_sidebar_width");
    return saved ? parseInt(saved, 10) : 260;
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("masidy_sidebar_collapsed");
    return saved === "true";
  });
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);

  const [savedKeys, setSavedKeys] = useState({
    supabaseUrl: "",
    supabaseKey: "",
    groqApiKey: ""
  });

  // Toast notification system
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: "error" | "success" | "info" = "info", duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load preferences from local cache on start
  useEffect(() => {
    const localKeys = localStorage.getItem("masidy_telemetry_keys");
    if (localKeys) {
      try {
        setSavedKeys(JSON.parse(localKeys));
      } catch (e) {
        console.error("Local parameters load crash:", e);
      }
    }
    const localUser = localStorage.getItem("masidy_username");
    if (localUser) setUsername(localUser);

    const localAvatar = localStorage.getItem("masidy_avatar");
    if (localAvatar) setAvatarColor(localAvatar);

    const localPlan = localStorage.getItem("masidy_active_tier");
    if (localPlan) setActivePlan(localPlan);

    const localTheme = localStorage.getItem("masidy_theme") as "light" | "dark";
    if (localTheme) {
       setTheme(localTheme);
    }

    // Check query parameters to perform real Stripe checkout verification
    const queryParams = new URLSearchParams(window.location.search);
    const successParam = queryParams.get("stripe_checkout_success") === "true";
    const sessionParamId = queryParams.get("session_id");
    if (successParam && sessionParamId) {
      fetch(`/api/payment/verify?session_id=${encodeURIComponent(sessionParamId)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.tier) {
            setActivePlan(data.tier);
            localStorage.setItem("masidy_active_tier", data.tier);
            window.dispatchEvent(new CustomEvent("masidy_tier_updated", { detail: data.tier }));
          }
          // Clean the query parameters cleanly
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch(err => console.error("Dynamic subscription checkout validation failed:", err));
    }
  }, []);

  // Load available Masidy models (with caching) - Fetch tier-specific models
  useEffect(() => {
    const loadModels = async () => {
      // Check for cached models (cache for 1 hour)
      const cachedModels = localStorage.getItem("masidy_models_cache");
      const cachedTier = localStorage.getItem("masidy_models_cache_tier");
      const cacheTimestamp = localStorage.getItem("masidy_models_cache_time");
      const now = Date.now();
      const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

      if (cachedModels && cacheTimestamp && cachedTier === activePlan) {
        const cacheAge = now - parseInt(cacheTimestamp, 10);
        if (cacheAge < CACHE_DURATION) {
          try {
            const models = JSON.parse(cachedModels);
            setAvailableModels(models);
            return;
          } catch (e) {
            console.warn("Cache parse error:", e);
          }
        }
      }

      // Fetch fresh models for current tier
      try {
        // Convert tier names for backend compatibility
        const tierParam = activePlan.toUpperCase().replace(/[^A-Z]/g, '');
        const tierMap: { [key: string]: string } = {
          "FREE": "FREE",
          "STARTER": "STARTER",
          "BASE": "BASE",
          "PRO": "PRO",
          "MAX": "MAX"
        };
        const mappedTier = tierMap[activePlan] || "FREE";
        
        const res = await fetch(`http://localhost:8000/models?tier=${mappedTier}`);
        const data = await res.json();
        if (data.models) {
          setAvailableModels(data.models);
          // Cache the result with tier info
          localStorage.setItem("masidy_models_cache", JSON.stringify(data.models));
          localStorage.setItem("masidy_models_cache_time", now.toString());
          localStorage.setItem("masidy_models_cache_tier", activePlan);
        }
      } catch (err) {
        console.error("Failed to load models:", err);
        addToast("Failed to load available models", "error", 5000);
      }
    };

    loadModels();
  }, [activePlan]);

  // Persist selected model to localStorage
  useEffect(() => {
    localStorage.setItem("masidy_selected_model", selectedModel);
  }, [selectedModel]);

  // Listen for OAuth Success triggers from popup iframe
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('localhost:3000')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const user = event.data.username || "Masidy User";
        const color = event.data.avatarColor || "indigo";
        setUsername(user);
        setAvatarColor(color);
        localStorage.setItem("masidy_username", user);
        localStorage.setItem("masidy_avatar", color);
      }
    };
    window.addEventListener("message", handleOAuthMessage);
    return () => window.removeEventListener("message", handleOAuthMessage);
  }, []);

  // Apply body element dark classes on theme changes
  useEffect(() => {
    if (theme === "dark") {
       document.documentElement.classList.add("dark");
    } else {
       document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Sync pricing plan state changes instantly across components
  useEffect(() => {
    const handleTierChange = (e: any) => {
      setActivePlan(e.detail);
    };
    window.addEventListener("masidy_tier_updated", handleTierChange);
    return () => window.removeEventListener("masidy_tier_updated", handleTierChange);
  }, []);

  // Sync / fetch previous threads (with debouncing to prevent duplicate requests)
  const fetchConversations = async () => {
    // Prevent duplicate requests within 1 second
    if (fetchConversationsInProgressRef.current || fetchConversationsTimeoutRef.current) return;

    fetchConversationsInProgressRef.current = true;
    fetchConversationsTimeoutRef.current = setTimeout(() => {
      fetchConversationsTimeoutRef.current = null;
    }, 1000);

    try {
      const resp = await fetch("/api/conversations");
      if (resp.ok) {
        let data = await resp.json();
        
        // Deduplicate conversations by title + conversation_id (keep most recent)
        const seen = new Map<string, typeof data[0]>();
        data = data.filter(conv => {
          const key = conv.title || "Untitled";
          if (seen.has(conv.id)) {
            return false; // Skip duplicate IDs
          }
          seen.set(conv.id, conv);
          return true;
        });
        
        setConversations(data);
        
        // Auto-select latest thread if none selected
        if (data.length > 0 && activeConvId === null) {
          setActiveConvId(data[0].id);
        }
      } else {
        addToast("Failed to load conversations", "error", 5000);
      }
    } catch (e: any) {
      console.error("Express background proxy currently unreachable.", e);
      addToast("Error loading conversations", "error", 5000);
    } finally {
      fetchConversationsInProgressRef.current = false;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages every time the active conversation ID shifts
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConvId) {
        setMessages([]);
        return;
      }
      try {
        const resp = await fetch(`/api/conversations/${activeConvId}/messages`);
        if (resp.ok) {
          const data = await resp.json();
          setMessages(data);
        }
      } catch (e) {
        console.error("Context retrieval error:", e);
      }
    };
    fetchMessages();
  }, [activeConvId]);

  // Handle starting a fresh conversation session
  const handleStartNewConversation = () => {
    setActiveConvId(null);
    setMessages([]);
    setActiveView("chat");
    setStatus("ONLINE");
  };

  // Switch conversation ID and ensure view locks back to "chat"
  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
    setActiveView("chat");
    setStatus("ONLINE");
  };

  // Delete/purge conversation thread
  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const resp = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      if (resp.ok) {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConvId === id) {
          setActiveConvId(null);
          setMessages([]);
        }
        addToast("Conversation deleted successfully", "success", 3000);
      } else {
        throw new Error(`Failed to delete conversation: ${resp.statusText}`);
      }
    } catch (err: any) {
      console.error("Purging chat reference failure:", err);
      addToast(`Error deleting conversation: ${err.message}`, "error", 5000);
    }
  };

  // Prevent double submit within 500ms
  const sendMessageTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const requestInProgressRef = React.useRef(false);
  const fetchConversationsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const fetchConversationsInProgressRef = React.useRef(false);

  // Send message package
  const handleSendMessage = async (rawMessage: string) => {
    if (!rawMessage.trim()) return;

    // Prevent double submission
    if (sendMessageTimeoutRef.current || requestInProgressRef.current) return;
    
    requestInProgressRef.current = true;
    sendMessageTimeoutRef.current = setTimeout(() => {
      sendMessageTimeoutRef.current = null;
    }, 500);

    try {
      // Direct redirection back to active chat view when sending anywhere else
      setActiveView("chat");
      setIsThinking(true);
      setStatus("THINKING");

      // Pre-render User message immediately for rapid sensory response
      const clientUserMsg: Message = {
        id: `u-${Date.now()}`,
        conversation_id: activeConvId || "draft_chat",
        role: "user",
        content: rawMessage,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, clientUserMsg]);

      // Heuristically predict research status indicators
      const isSearchTrigger = /search|research|google|weather|price|stock|recent|current|latest|news/i.test(rawMessage.toLowerCase());
      if (isSearchTrigger) {
         setTimeout(() => setStatus("RESEARCHING"), 400);
      }
      const savedInstructions = localStorage.getItem("masidy_instructions") || "";
      const finalizedPayloadMessage = savedInstructions.trim() 
         ? `[System Note Directive: ${savedInstructions}]\n\nUser request: ${rawMessage}`
         : rawMessage;

      const bodyPayload = {
        user_id: "admin_user",
        conversation_id: activeConvId,
        message: finalizedPayloadMessage,
        model: selectedModel,
        tier: activePlan,  // Add user's tier for model access control
        credentials: savedKeys
      };

      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload)
      });

      if (resp.status === 429) {
        const errorData = await resp.json();
        addToast("Rate limit exceeded. Please wait before sending more messages.", "error", 5000);
        const infoMsg: Message = {
          id: `msg-limit-${Date.now()}`,
          conversation_id: activeConvId || "limit_lockout",
          role: "assistant",
          content: `### ⚠️ QUANTUM METRIC EXCEEDED [429 LOCKOUT]\n\n` +
            `**${errorData.error}**\n\n` +
            `Throughput Limit: **${errorData.telemetry?.limit} queries/min**\n` +
            `- **Active Workspace Level**: \`${activePlan}\`\n` +
            `- **System Recovery Timer**: \`${errorData.telemetry?.resetTime}s remaining\`\n\n` +
            `To unlock high-throughput parallel execution, select **Plans & Subscription** in the sidebar to sync a secure mock Stripe upgrade, or allow the recovery window to cycle back to standard levels.`,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev.filter(m => m.id !== clientUserMsg.id), clientUserMsg, infoMsg]);
        setStatus("OFFLINE");
        setIsThinking(false);
        requestInProgressRef.current = false;
        return;
      }

      if (!resp.ok) {
        throw new Error(`API returned ${resp.status}: ${resp.statusText}`);
      }

      const resData = await resp.json();
      const aiMsg: Message = {
        id: `msg-${Math.random().toString(36).substring(2, 9)}`,
        conversation_id: resData.conversation_id,
        role: "assistant",
        content: resData.answer,
        created_at: new Date().toISOString()
      };

      // Align list of messages accurately
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== clientUserMsg.id);
        const alignedUser: Message = {
          ...clientUserMsg,
          conversation_id: resData.conversation_id
        };
        return [...filtered, alignedUser, aiMsg];
      });

      setActiveConvId(resData.conversation_id);
      await fetchConversations();
      addToast("Message sent successfully", "success", 3000);
      setStatus("ONLINE");
    } catch (err: any) {
      console.error("API proxy failure:", err);
      addToast(`Error sending message: ${err.message || "Unknown error"}`, "error", 5000);
      
      // Fallback response block
      const fallbackAiMsg: Message = {
        id: `msg-err-${Date.now()}`,
        conversation_id: activeConvId || "error_session",
        role: "assistant",
        content: `**Operational Alert**: Deep inference was blocked. Please verify your internet connection.\n\n` +
          `*Fallback Diagnostic Output*:\n` +
          `- API Endpoint: \`/api/chat\`\n` +
          `- Issue: Node development server reports connection errors.\n` +
          `Configure your personalized credentials or override keys via the Settings tab in the sidebar layout.`,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, fallbackAiMsg]);
      setStatus("OFFLINE");
    } finally {
      setIsThinking(false);
      requestInProgressRef.current = false;
    }
  };

  const handleClearCurrentChat = () => {
    setMessages([]);
    setStatus("ONLINE");
  };

  const handleSaveCredentials = (keys: typeof savedKeys) => {
    setSavedKeys(keys);
    localStorage.setItem("masidy_telemetry_keys", JSON.stringify(keys));
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("masidy_theme", nextTheme);
  };

  const handleConnectOAuth = async () => {
    try {
      const resp = await fetch(`/api/auth/url?redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}`);
      if (resp.ok) {
        const { url } = await resp.json();
        const popup = window.open(url, "Masidy OAuth SSO", "width=520,height=620");
        if (!popup) {
          alert("Popup blocked! Verify browser permissions to allow OAuth popup login.");
        }
      }
    } catch (e) {
      console.error("SSO Connection fault:", e);
    }
  };

  const handleToggleSidebarCollapse = () => {
    const nextCollapsed = !isSidebarCollapsed;
    setIsSidebarCollapsed(nextCollapsed);
    localStorage.setItem("masidy_sidebar_collapsed", String(nextCollapsed));
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingSidebar(true);
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      // limit between 180px and 450px for design harmony
      const newWidth = Math.max(180, Math.min(450, startWidth + deltaX));
      setSidebarWidth(newWidth);
      localStorage.setItem("masidy_sidebar_width", String(newWidth));
    };

    const handleMouseUp = () => {
      setIsDraggingSidebar(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className={`flex flex-col h-screen w-screen transition-colors duration-300 ${theme === "dark" ? "dark bg-[#0c0c0e] text-[#f4f4f5]" : "bg-white text-zinc-900"} overflow-hidden font-sans antialiased`}>
      
      {/* 1. Header Bar Area showing user parameters and subscription ties */}
      <StatusBar 
        status={status} 
        onClearChat={handleClearCurrentChat} 
        hasMessages={messages.length > 0} 
        showCredentialsModal={() => setShowSettings(true)}
        activePlan={activePlan}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebarCollapse}
        selectedModel={selectedModel}
        availableModels={availableModels}
        onModelChange={(modelId) => setSelectedModel(modelId)}
      />

      {/* 2. Primary layout body pane */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        
        {/* Left conversations and navigation bar */}
        <Sidebar
          conversations={conversations}
          activeConvId={activeConvId}
          onSelectConversation={handleSelectConversation}
          onStartNewConversation={handleStartNewConversation}
          onDeleteConversation={handleDeleteConversation}
          showCredentialsModal={() => setShowSettings(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onConnectOAuth={handleConnectOAuth}
          setActiveView={setActiveView}
          activeView={activeView}
          username={username}
          avatarColor={avatarColor}
          activePlan={activePlan}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebarCollapse}
          width={sidebarWidth}
          isDragging={isDraggingSidebar}
          onResizeMouseDown={handleResizeMouseDown}
        />

        {/* Central main workspace showing active segment view panels dynamically */}
        <div id="chat-workspace" className="flex-1 flex flex-col h-full min-h-0 bg-white dark:bg-[#0c0c0e] overflow-hidden">
          {activeView === "chat" && (
            <>
              <ChatPanel
                messages={messages}
                isThinking={isThinking}
                onSendMessage={handleSendMessage}
                showCredentialsModal={() => setShowSettings(true)}
              />
              <InputBar
                onSendMessage={handleSendMessage}
                disabled={isThinking || status === "OFFLINE"}
                messages={messages}
                selectedModel={selectedModel}
                availableModels={availableModels}
                onModelChange={setSelectedModel}
                userTier={activePlan}
              />
            </>
          )}

          {activeView === "images" && (
            <ImagesStudio />
          )}

          {activeView === "research" && (
            <DeepResearch />
          )}

          {activeView === "pricing" && (
            <PlansPricing />
          )}

          {activeView === "guide" && (
            <SystemGuide />
          )}
        </div>

      </div>

      {/* 3. Settings configurations Suite modal Dialog */}
      {showSettings && (
        <SettingsSuite
          onClose={() => setShowSettings(false)}
          onSave={handleSaveCredentials}
          savedKeys={savedKeys}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}
