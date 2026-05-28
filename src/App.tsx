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
import AuthModal from "./components/AuthModal";
import { supabase } from "./lib/supabase";
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

  // Auth state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // userId starts as anon, gets replaced by Supabase UUID on session load
  const [userId, setUserId] = useState<string>(() => {
    // If we have a cached Supabase user ID, use it immediately
    const cachedSupabaseId = localStorage.getItem("masidy_supabase_uid");
    if (cachedSupabaseId) return cachedSupabaseId;
    const stored = localStorage.getItem("masidy_anon_id");
    if (stored) return stored;
    const id = `anon-${Math.random().toString(36).substring(2, 12)}`;
    localStorage.setItem("masidy_anon_id", id);
    return id;
  });
  const [authReady, setAuthReady] = useState(false);

  // Loaded user profile preferences — declared BEFORE models so activePlan is available
  const [username, setUsername] = useState("Masidy User");
  const [avatarColor, setAvatarColor] = useState("indigo");
  const [activePlan, setActivePlan] = useState(() => {
    return localStorage.getItem("masidy_active_tier") || "FREE";
  });

  // Exactly 5 models, one per tier — computed from activePlan
  const ALL_MODELS: MasidyModel[] = [
    { id: "free-base",    name: "Free",    description: "Llama 3.1 8B — core assistant",       tier: "FREE"    },
    { id: "starter-base", name: "Starter", description: "Llama 3.1 8B — enhanced assistant",   tier: "STARTER" },
    { id: "base-general", name: "Base",    description: "Llama 3.3 70B — advanced reasoning",  tier: "BASE"    },
    { id: "pro-general",  name: "Pro",     description: "Llama 3.3 70B — professional expert", tier: "PRO"     },
    { id: "max-general",  name: "Max",     description: "Llama 3.1 405B — maximum power",      tier: "MAX"     },
  ];
  const TIER_ORDER = ["FREE", "STARTER", "BASE", "PRO", "MAX"];
  const userTierIndex = TIER_ORDER.indexOf(activePlan);
  const availableModels: MasidyModel[] = ALL_MODELS.map(m => ({
    ...m,
    locked: TIER_ORDER.indexOf(m.tier || "FREE") > userTierIndex
  }));

  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem("masidy_selected_model") || "free-base";
  });

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
    // Clear stale model cache so fresh models always load
    localStorage.removeItem("masidy_models_cache");
    localStorage.removeItem("masidy_models_cache_time");
    localStorage.removeItem("masidy_models_cache_tier");

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

  // Apply dark mode classes on theme changes
  useEffect(() => {
    if (theme === "dark") {
       document.documentElement.classList.add("dark");
    } else {
       document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Supabase auth session listener
  useEffect(() => {
    // Check for existing session on mount — set authReady when done
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user = session.user;
        const displayName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Masidy User";
        setUsername(displayName);
        setUserId(user.id);
        setIsAuthenticated(true);
        localStorage.setItem("masidy_username", displayName);
        localStorage.setItem("masidy_supabase_uid", user.id);
      }
      setAuthReady(true); // auth check complete — now safe to fetch conversations
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user = session.user;
        const displayName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Masidy User";
        setUsername(displayName);
        setUserId(user.id);
        setIsAuthenticated(true);
        localStorage.setItem("masidy_username", displayName);
        localStorage.setItem("masidy_supabase_uid", user.id);
        setShowAuthModal(false);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("masidy_supabase_uid");
        const anonId = localStorage.getItem("masidy_anon_id") || `anon-${Math.random().toString(36).substring(2, 12)}`;
        setUserId(anonId);
        localStorage.setItem("masidy_anon_id", anonId);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
      const resp = await fetch(`/api/conversations?user_id=${encodeURIComponent(userId)}`);
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
        addToast("Couldn't load conversations. Please refresh.", "error", 5000);
      }
    } catch (e: any) {
      console.error("Express background proxy currently unreachable.", e);
      addToast("Couldn't load conversations. Please refresh.", "error", 5000);
    } finally {
      fetchConversationsInProgressRef.current = false;
    }
  };

  useEffect(() => {
    if (authReady) fetchConversations();
  }, [userId, authReady]);

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
      addToast("Couldn't delete this conversation. Please try again.", "error", 5000);
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

      // Don't pre-render optimistically — wait for confirmed response to avoid duplicates
      const isSearchTrigger = /search|research|google|weather|price|stock|recent|current|latest|news/i.test(rawMessage.toLowerCase());
      if (isSearchTrigger) {
        setTimeout(() => setStatus("RESEARCHING"), 400);
      }
      const savedInstructions = localStorage.getItem("masidy_instructions") || "";
      const finalizedPayloadMessage = savedInstructions.trim() 
         ? `[System Note Directive: ${savedInstructions}]\n\nUser request: ${rawMessage}`
         : rawMessage;

      const bodyPayload = {
        user_id: userId,
        conversation_id: activeConvId,
        message: finalizedPayloadMessage,
        // Use selected model only if it's unlocked for the user's tier
        model: availableModels.find(m => m.id === selectedModel && !m.locked)
          ? selectedModel
          : availableModels.filter(m => !m.locked).slice(-1)[0]?.id || "free-base",
        tier: activePlan,
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
          content: `You've reached your message limit for this minute. Please wait a moment and try again.\n\nUpgrade your plan for higher limits.`,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, infoMsg]);
        setStatus("OFFLINE");
        setIsThinking(false);
        requestInProgressRef.current = false;
        return;
      }

      if (!resp.ok) {
        throw new Error(`API returned ${resp.status}: ${resp.statusText}`);
      }

      const resData = await resp.json();

      // Fetch the authoritative message list from server to avoid duplicates
      setActiveConvId(resData.conversation_id);
      const msgResp = await fetch(`/api/conversations/${resData.conversation_id}/messages`);
      if (msgResp.ok) {
        const freshMessages = await msgResp.json();
        setMessages(freshMessages);
      } else {
        // Fallback: add AI message manually
        const aiMsg: Message = {
          id: `msg-${Math.random().toString(36).substring(2, 9)}`,
          conversation_id: resData.conversation_id,
          role: "assistant",
          content: resData.answer,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMsg]);
      }
      await fetchConversations();
      addToast("Message sent successfully", "success", 3000);
      setStatus("ONLINE");
    } catch (err: any) {
      console.error("API proxy failure:", err);
      addToast("Something went wrong. Please try again.", "error", 5000);
      
      // Fallback response block
      const fallbackAiMsg: Message = {
        id: `msg-err-${Date.now()}`,
        conversation_id: activeConvId || "error_session",
        role: "assistant",
        content: "We're having trouble connecting right now. Please check your connection and try again.",
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
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUsername("Masidy User");
    localStorage.removeItem("masidy_username");
    addToast("Signed out successfully", "success", 3000);
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
        {/* Mobile: overlay drawer with backdrop */}
        {!isSidebarCollapsed && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={handleToggleSidebarCollapse}
          />
        )}
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
          onSignOut={handleSignOut}
          isAuthenticated={isAuthenticated}
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

      {/* Supabase Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={({ email, name }) => {
            setUsername(name);
            setIsAuthenticated(true);
            localStorage.setItem("masidy_username", name);
            addToast(`Welcome, ${name}!`, "success", 3000);
          }}
        />
      )}
    </div>
  );
}
