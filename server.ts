import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Supabase client for persistent storage (service role bypasses RLS)
const SUPABASE_URL = process.env.SUPABASE_URL || "https://fcyeujjqklwcultctcrd.supabase.co";
// Try service key first, then anon key
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY 
  || process.env.SUPABASE_ANON_KEY 
  || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjeWV1ampxa2x3Y3VsdGN0Y3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTkxMDE5MiwiZXhwIjoyMDk1NDg2MTkyfQ.EskENhKvuTwLL4J_mrG2G40OPIAl6iLJWro0vJ-Al9w";
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

let stripeClient: Stripe | null = null;
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2025-01-27.acacia" as any
    });
  }
  return stripeClient;
}

const PORT = 3000;
const BACKEND_URL = process.env.BACKEND_URL || "https://masidy-backend-za1t.onrender.com";
const DB_FILE = path.join(process.cwd(), "local_db.json");

// Tier normalization for backward compatibility with Supabase
function normalizeTier(tier: string | undefined): string {
  if (!tier) return "FREE";
  
  const tierMap: { [key: string]: string } = {
    // Old tier names (for existing Supabase users)
    "Free Standard": "FREE",
    "Masidy Pro": "BASE",
    "Landmark Enterprise": "PRO",
    // New tier names
    "FREE": "FREE",
    "STARTER": "STARTER",
    "BASE": "BASE",
    "PRO": "PRO",
    "MAX": "MAX"
  };
  
  return tierMap[tier] || "FREE";
}

interface LocalMessage {
  id: string;
  conversation_id: string;
  role: "system" | "user" | "assistant";
  content: string;
  created_at: string;
}

interface LocalConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

interface LocalUser {
  id: string;
  external_id: string;
  created_at: string;
  tier?: string;
  username?: string;
  avatar_color?: string;
}

interface LocalDB {
  users: LocalUser[];
  conversations: LocalConversation[];
  messages: LocalMessage[];
}

// In-Memory rate limit tracking engine
interface RateLimitRecord {
  timestamps: number[];
}
const rateLimiterStore = new Map<string, RateLimitRecord>();

function checkRateLimit(ipOrKey: string, tier: string): { allowed: boolean; remaining: number; resetTime: number; limit: number } {
  const now = Date.now();
  const windowMs = 60 * 1050; // 60 seconds
  const record = rateLimiterStore.get(ipOrKey) || { timestamps: [] };

  // Retain only timestamps from within the active sliding minute window
  record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

  // Normalize tier (handles both old and new names)
  const normalizedTier = normalizeTier(tier);

  // Tier-based rate limits
  let limit = 8; // FREE tier default
  if (normalizedTier === "STARTER") limit = 15;   // $5/mo
  if (normalizedTier === "BASE") limit = 25;      // $20/mo
  if (normalizedTier === "PRO") limit = 50;       // $50/mo
  if (normalizedTier === "MAX") limit = 999;      // $100/mo

  let allowed = true;
  if (record.timestamps.length >= limit) {
    allowed = false;
  } else {
    record.timestamps.push(now);
    rateLimiterStore.set(ipOrKey, record);
  }

  const remaining = Math.max(0, limit - record.timestamps.length);
  const resetInterval = record.timestamps.length > 0 ? (record.timestamps[0] + windowMs - now) / 1000 : 60;

  return {
    allowed,
    remaining,
    resetTime: Math.ceil(resetInterval),
    limit
  };
}

// Ensure local JSON DB file exists to act as our persistent local database proxy
function loadDatabase(): LocalDB {
  if (fs.existsSync(DB_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      return {
        users: parsed.users || [],
        conversations: parsed.conversations || [],
        messages: parsed.messages || [],
      };
    } catch (e) {
      console.error("Database reading error. Resetting cache...", e);
    }
  }
  const defaultDb: LocalDB = { users: [], conversations: [], messages: [] };
  saveDatabase(defaultDb);
  return defaultDb;
}

function saveDatabase(db: LocalDB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Database writing error: ", e);
  }
}

async function startServer() {
  const app = express();
  
  // Webhook must use raw body for signature verification
  app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
    const signature = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!signature || !webhookSecret) {
      console.warn("⚠️ Webhook received but signature or secret missing");
      return res.status(400).json({ error: "Missing signature or webhook secret" });
    }

    try {
      const client = getStripe();
      if (!client) {
        console.warn("⚠️ Stripe client not initialized");
        return res.status(400).json({ error: "Stripe not configured" });
      }

      // Verify the webhook signature
      const event = client.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      ) as any;

      console.log(`✅ Webhook verified: ${event.type}`);

      const db = loadDatabase();
      let updated = false;

      // Handle different webhook event types
      switch (event.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object;
          console.log(`💰 Payment succeeded: ${paymentIntent.id}`);
          
          // Find customer and update tier
          if (paymentIntent.customer) {
            const user = db.users.find(u => u.external_id === paymentIntent.customer);
            if (user && paymentIntent.metadata?.tierName) {
              user.tier = paymentIntent.metadata.tierName;
              console.log(`✅ Updated ${user.external_id} to tier: ${user.tier}`);
              updated = true;
            }
          }
          break;
        }

        case "payment_intent.payment_failed": {
          const paymentIntent = event.data.object;
          console.log(`❌ Payment failed: ${paymentIntent.id}`);
          
          // Optionally downgrade tier or send notification
          if (paymentIntent.customer) {
            const user = db.users.find(u => u.external_id === paymentIntent.customer);
            if (user) {
              console.log(`⚠️ Payment failed for user: ${user.external_id}`);
              // You might want to send them an email or downgrade tier
            }
          }
          break;
        }

        case "customer.subscription.created": {
          const subscription = event.data.object;
          console.log(`📅 Subscription created: ${subscription.id}`);
          
          if (subscription.customer) {
            const user = db.users.find(u => u.external_id === subscription.customer);
            if (user && subscription.metadata?.tierName) {
              user.tier = subscription.metadata.tierName;
              console.log(`✅ Subscription active for ${user.external_id}: ${user.tier}`);
              updated = true;
            }
          }
          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object;
          console.log(`🔄 Subscription updated: ${subscription.id}`);
          
          if (subscription.customer) {
            const user = db.users.find(u => u.external_id === subscription.customer);
            if (user && subscription.metadata?.tierName) {
              user.tier = subscription.metadata.tierName;
              console.log(`✅ Subscription tier updated to: ${user.tier}`);
              updated = true;
            }
          }
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          console.log(`🗑️ Subscription canceled: ${subscription.id}`);
          
          if (subscription.customer) {
            const user = db.users.find(u => u.external_id === subscription.customer);
            if (user) {
              user.tier = "FREE";
              console.log(`✅ Downgraded ${user.external_id} to FREE tier`);
              updated = true;
            }
          }
          break;
        }

        case "invoice.payment_succeeded": {
          const invoice = event.data.object;
          console.log(`💵 Invoice paid: ${invoice.id}`);
          // Subscription should already be active from subscription events
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object;
          console.log(`⚠️ Invoice payment failed: ${invoice.id}`);
          // Could send retry notification here
          break;
        }

        case "charge.dispute.created": {
          const dispute = event.data.object;
          console.log(`⚠️ Dispute filed: ${dispute.id}`);
          // You might want to alert the user or flag their account
          break;
        }

        default:
          console.log(`ℹ️ Unhandled event type: ${event.type}`);
      }

      // Save updated database
      if (updated) {
        saveDatabase(db);
      }

      // Always respond with 200 OK to Stripe (even if we don't handle the event)
      res.json({ received: true, eventId: event.id });

    } catch (err: any) {
      console.error("❌ Webhook error:", err.message);
      res.status(400).json({ 
        error: "Webhook error",
        message: err.message 
      });
    }
  });

  app.use(express.json());

  // API 1: /api/health
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ONLINE",
      timestamp: new Date().toISOString(),
      platform: "Express + Vite (Sandboxed)",
      agent_subsystem: "ACTIVE",
      persistence: "local_db.json"
    });
  });

  // API: /api/models - Proxy to FastAPI backend
  app.get("/api/models", async (req, res) => {
    try {
      const tier = req.query.tier || "FREE";
      const backendRes = await fetch(`${BACKEND_URL}/models?tier=${encodeURIComponent(String(tier))}`);
      if (!backendRes.ok) {
        throw new Error(`Backend returned ${backendRes.status}`);
      }
      const data = await backendRes.json();
      res.json(data);
    } catch (err: any) {
      console.error("Models proxy error:", err.message);
      // Return fallback models so the selector always has something to show
      res.json({
        models: [
          { id: "free-base", name: "Masidy Free", description: "Llama 3.1 8B — fast general assistant" },
          { id: "starter-base", name: "Masidy Starter", description: "Llama 3.1 8B — enhanced context" },
          { id: "base-general", name: "Masidy Base", description: "Llama 3.3 70B — advanced reasoning" },
          { id: "pro-general", name: "Masidy Pro", description: "Llama 3.3 70B — full capabilities" },
          { id: "max-general", name: "Masidy Max", description: "Llama 3.1 405B — maximum power" }
        ],
        tier: "FREE",
        default_model: "free-base",
        total: 5
      });
    }
  });

  // API 2: /api/conversations - fetch user's conversations from Supabase
  app.get("/api/conversations", async (req, res) => {
    const userId = req.query.user_id as string | undefined;
    
    if (userId) {
      try {
        // Try fetching by external_id stored directly in conversations
        const { data, error } = await supabaseAdmin
          .from("conversations")
          .select("id, title, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(50);
        
        if (!error && data && data.length > 0) {
          return res.json(data);
        }
        if (error) console.error("Supabase conversations fetch error:", error.message);
      } catch (e) {
        console.error("Supabase conversations fetch exception:", e);
      }
    }

    // Local fallback
    const db = loadDatabase();
    let convs = db.conversations;
    if (userId) convs = convs.filter(c => c.user_id === userId);
    const seen = new Set<string>();
    const unique = convs.filter(conv => {
      if (seen.has(conv.id)) return false;
      seen.add(conv.id);
      return true;
    });
    res.json(unique.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  });

  // API 3: /api/conversations/:id/messages
  app.get("/api/conversations/:id/messages", async (req, res) => {
    const convId = req.params.id;
    try {
      const { data, error } = await supabaseAdmin
        .from("messages")
        .select("id, conversation_id, role, content, created_at")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });
      if (!error && data) {
        return res.json(data);
      }
      if (error) console.error("Supabase messages fetch error:", error.message);
    } catch (e) {
      console.error("Supabase messages fetch exception:", e);
    }
    // Local fallback
    const db = loadDatabase();
    const filtered = db.messages
      .filter((m) => m.conversation_id === convId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    res.json(filtered);
  });

  // API 4: delete conversation
  app.delete("/api/conversations/:id", async (req, res) => {
    const convId = req.params.id;

    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from("messages").delete().eq("conversation_id", convId);
        await supabaseAdmin.from("conversations").delete().eq("id", convId);
        return res.json({ success: true });
      } catch (e) {
        console.error("Supabase delete error:", e);
      }
    }

    // Local fallback
    const db = loadDatabase();
    db.conversations = db.conversations.filter(c => c.id !== convId);
    db.messages = db.messages.filter(m => m.conversation_id !== convId);
    saveDatabase(db);
    res.json({ success: true });
  });

  // Stripe & Subscription checkout integration endpoint - NEW TIER SYSTEM
  app.post("/api/payment/checkout", async (req, res) => {
    const { tierName, successUrl, cancelUrl, user_id = "anon" } = req.body;
    const db = loadDatabase();

    // Map tier names to pricing
    const tierPricing: { [key: string]: { amount: number; priceId: string } } = {
      "FREE": { amount: 0, priceId: "" },
      "STARTER": { amount: 500, priceId: process.env.STRIPE_PRICE_STARTER || "price_starter_5" },
      "BASE": { amount: 2000, priceId: process.env.STRIPE_PRICE_BASE || "price_base_20" },
      "PRO": { amount: 5000, priceId: process.env.STRIPE_PRICE_PRO || "price_pro_50" },
      "MAX": { amount: 10000, priceId: process.env.STRIPE_PRICE_MAX || "price_max_100" },
      // Legacy support
      "Masidy Pro": { amount: 1500, priceId: process.env.STRIPE_PRICE_PRO || "price_1OvJ4vF4eNlX1mR2" },
      "Landmark Enterprise": { amount: 4900, priceId: process.env.STRIPE_PRICE_ENTERPRISE || "price_1OvJ5fF4eNlX1mR2" }
    };

    const pricing = tierPricing[tierName] || tierPricing["STARTER"];

    // Cannot checkout FREE tier
    if (tierName === "FREE") {
      return res.json({
        success: false,
        message: "Free tier is automatically assigned. No checkout needed."
      });
    }

    const client = getStripe();
    if (client) {
      try {
        const origin = req.headers.origin || "http://localhost:3000";
        const session = await client.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: tierName,
                  description: `Masidy AI - ${tierName} tier subscription`,
                },
                unit_amount: pricing.amount,
                recurring: {
                  interval: "month",
                },
              },
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: successUrl || `${origin}/?stripe_checkout_success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl || `${origin}/`,
          metadata: {
            tierName,
            user_external_id: user_id
          }
        });

        res.json({
          success: true,
          stripeSessionUrl: session.url,
          tier: tierName,
          message: "Real Stripe session successfully instantiated."
        });
        return;
      } catch (stripeErr: any) {
        console.error("Stripe SDK checkout initialization failed, executing sandbox activate mode:", stripeErr);
      }
    }

    // Direct sandbox checkout fallback
    let user = db.users.find(u => u.external_id === user_id);
    if (!user) {
      user = {
        id: `u-${Math.random().toString(36).substring(2, 9)}`,
        external_id: user_id,
        created_at: new Date().toISOString()
      };
      db.users.push(user);
    }

    user.tier = tierName;
    saveDatabase(db);

    res.json({
      success: true,
      tier: tierName,
      user_id: user.id,
      transactionId: "TX_STRIPE_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      message: `Checked out successfully! Direct offline sandbox checkout completed. Active subscription level set to: ${tierName}`
    });
  });

  // Stripe verification endpoint to sync active tiers on return
  app.get("/api/payment/verify", (req, res) => {
    const { session_id } = req.query;
    const client = getStripe();
    if (client && session_id) {
       client.checkout.sessions.retrieve(String(session_id))
         .then(session => {
            const tierName = session.metadata?.tierName;
            const userExternalId = session.metadata?.user_external_id || "anon";
            if (tierName) {
              const db = loadDatabase();
              let user = db.users.find(u => u.external_id === userExternalId);
              if (!user) {
                user = {
                  id: `u-${Math.random().toString(36).substring(2, 9)}`,
                  external_id: userExternalId,
                  created_at: new Date().toISOString()
                };
                db.users.push(user);
              }
              user.tier = tierName;
              saveDatabase(db);
              res.json({ success: true, tier: tierName });
            } else {
              res.json({ success: false, reason: "No tier name mapped in session metadata." });
            }
         })
         .catch(err => {
            console.error("Failed retrieving stripe checkout session verification:", err);
            res.status(500).json({ success: false, error: err.message });
         });
    } else {
       res.json({ success: false, reason: "No active keys or query coordinates specified." });
    }
  });

  // OAuth SSO authorization URL builder
  app.get("/api/auth/url", (req, res) => {
    const redirectUri = req.query.redirect_uri || `https://localhost:3000/auth/callback`;
    const hostUrl = req.query.host_url || redirectUri;
    const authUrl = `/auth/provider-gateway?redirect_uri=${encodeURIComponent(String(redirectUri))}`;
    res.json({ url: authUrl });
  });

  // OAuth interactive SSO interface gateway
  app.get("/auth/provider-gateway", (req, res) => {
    const redirectUri = req.query.redirect_uri || "";
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Masidy SSO Authorization Gateway</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; background-color: #09090b; color: #f4f4f5; }
          </style>
        </head>
        <body class="flex items-center justify-center min-vh-100 min-h-screen p-4">
          <div class="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div class="text-center space-y-1">
              <div class="w-10 h-10 rounded-xl bg-indigo-650 text-white flex items-center justify-center mx-auto shadow-sm mb-1 animate-pulse">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11l-.547-2.19a.678.678 0 00-.505-.505l-2.19-.547a13.917 13.917 0 00-2.04 3.44l.09.054M15 11c0 3.517 1.009 6.799 2.753 9.571m3.44-2.04l-.054-.09a13.916 13.915 0 00-6.103-6.103l.547-2.19a.678.678 0 01.505-.505l2.19-.547a13.917 13.917 0 012.04 3.44l-.09.054M14 1a2 2 0 110 4 2 2 0 010-4z" />
                </svg>
              </div>
              <h2 class="text-md font-bold text-zinc-100">MASIDY GATEWAY SSO</h2>
              <p class="text-[11px] text-zinc-400">Secure single sign-on credentials verification</p>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Select Security Hub</label>
                <div class="grid grid-cols-2 gap-3">
                  <button type="button" id="btn-google" class="flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] font-semibold transition" onclick="selectProvider('Google')">
                    <span>Google Secure</span>
                  </button>
                  <button type="button" id="btn-github" class="flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] font-semibold transition" onclick="selectProvider('GitHub')">
                    <span>GitHub SSH</span>
                  </button>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="block text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">Ident Name / Handle</label>
                <input type="text" id="username-inp" placeholder="e.g. Admiral Mark" class="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-lg text-xs py-2 px-3 text-white focus:outline-none transition font-sans" value="Admiral Mark" />
              </div>

              <div class="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-[10px] text-zinc-400 font-mono break-all leading-normal select-none">
                 Redirect target:<br/>
                 <span class="text-indigo-400 font-medium">${redirectUri}</span>
              </div>

              <button type="button" onclick="completeAuth()" class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-md transition">
                Grant Vault Authorization
              </button>
            </div>
          </div>

          <script>
            let selectedProvider = 'Google';
            function selectProvider(prov) {
              selectedProvider = prov;
              document.getElementById('btn-google').className = prov === 'Google' 
                ? 'flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-indigo-700 text-white border-2 border-indigo-500 text-[11px] font-semibold transition'
                : 'flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] font-semibold transition';
              
              document.getElementById('btn-github').className = prov === 'GitHub' 
                ? 'flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-indigo-700 text-white border-2 border-indigo-500 text-[11px] font-semibold transition'
                : 'flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] font-semibold transition';
            }
            selectProvider('Google');

            function completeAuth() {
              const username = document.getElementById('username-inp').value || 'Admiral Mark';
              const code = 'MAS_AUTH_' + Math.random().toString(36).substring(2, 10).toUpperCase();
              const targetUrl = \`/auth/callback?code=\${code}&username=\${encodeURIComponent(username)}&provider=\${encodeURIComponent(selectedProvider)}\`;
              window.location.href = targetUrl;
            }
          </script>
        </body>
      </html>
    `);
  });

  // OAuth callback receiver — Supabase handles real auth, this just closes the popup
  app.get(["/auth/callback", "/auth/callback/"], (req, res) => {
    // Supabase auth handles the real session via detectSessionInUrl
    // This page just closes the popup window if opened as one
    res.send(`<!DOCTYPE html>
<html>
<head><title>Auth Complete</title></head>
<body>
<script>
  if (window.opener) {
    window.opener.postMessage({ type: 'SUPABASE_AUTH_COMPLETE' }, window.location.origin);
    setTimeout(() => window.close(), 500);
  } else {
    window.location.href = '/';
  }
</script>
</body>
</html>`);
  });

  // System Rate-limiting telemetry status block
  app.get("/api/rate-limit-status", (req, res) => {
    const userId = (req.query.user_id as string) || "anon";
    const db = loadDatabase();
    const user = db.users.find(u => u.external_id === userId);
    const activeTier = user?.tier || "Free Standard";
    const status = checkRateLimit(userId, activeTier);
    res.json({
      tier: activeTier,
      limit: status.limit,
      remaining: status.remaining,
      resetTime: status.resetTime,
      isLimited: !status.allowed
    });
  });

  // API 5: /api/chat - Main brain loop
  app.post("/api/chat", async (req, res) => {
    const { user_id = "admin_user", conversation_id, message } = req.body;

    if (!message || String(message).trim() === "") {
       res.status(400).json({ error: "Instruction package is empty." });
       return;
    }

    const telemetryLogs: { timestamp: string; step: string; details: string; status: "INFO" | "WARNING" | "SUCCESS" }[] = [];
    const log = (step: string, details: string, status: "INFO" | "WARNING" | "SUCCESS" = "INFO") => {
      telemetryLogs.push({
        timestamp: new Date().toISOString(),
        step,
        details,
        status,
      });
    };

    try {
      log("USER_RESOLVE", `Locating external telemetry identifier: '${user_id}'`, "INFO");
      const db = loadDatabase();

      // Find or create user
      let user = db.users.find((u) => u.external_id === user_id);
      if (!user) {
        user = {
          id: `u-${Math.random().toString(36).substring(2, 9)}`,
          external_id: user_id,
          created_at: new Date().toISOString(),
          tier: "Free Standard"
        };
        db.users.push(user);
        log("USER_RESOLVE", `Identity initialized. Host profile generated ID: ${user.id}`, "SUCCESS");
      }

      // ACTIVE RATE LIMIT SYSTEM CHECK — use real user_id not shared IP
      const activeTier = user.tier || "Free Standard";
      const limitStatus = checkRateLimit(user_id, activeTier);
      log("RATE_LIMIT_CHECK", `Identified subscription level: ${activeTier}. Remaining credits: ${limitStatus.remaining}/${limitStatus.limit}`, "INFO");

      if (!limitStatus.allowed) {
        log("RATE_LIMIT_EXCEEDED", `System throughput saturation. Access locked. Reset in ${limitStatus.resetTime} seconds.`, "WARNING");
        res.status(429).json({
          error: `Velocity quota of ${limitStatus.limit} requests/min exceeded. Status: [LOCKOUT]. Wait ${limitStatus.resetTime}s to cycle or upgrade your workspace privileges.`,
          telemetry: limitStatus,
          logs: telemetryLogs
        });
        return;
      }

      // Find or create conversation — use proper UUID
      let activeConvId = conversation_id;
      let title = message.substring(0, 30);
      if (title.length >= 30) title += "...";

      // Ensure user exists in Supabase (awaited)
      supabaseAdmin.from("users").upsert(
        { external_id: user_id },
        { onConflict: "external_id" }
      ).then(({ error }) => {
        if (error) console.error("User upsert error:", error.message);
      });

      let conv = db.conversations.find((c) => c.id === activeConvId);
      if (!conv) {
        activeConvId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        conv = {
          id: activeConvId,
          user_id: user_id,
          title: title || "New Chat",
          created_at: new Date().toISOString(),
        };
        db.conversations.push(conv);
        // AWAIT the conversation save so messages don't race ahead
        const { error: convErr } = await supabaseAdmin.from("conversations").upsert({
          id: activeConvId,
          user_id: user_id,
          title: title || "New Chat"
        });
        if (convErr) console.error("Supabase conv save error:", convErr.message);
        else console.log("✅ Conversation saved to Supabase:", activeConvId);
        log("CONV_RESOLVE", `Allocated core cache sequence: ${activeConvId}`, "SUCCESS");
      }

      // Save to local DB only (backend handles Supabase persistence)
      const userMsg: LocalMessage = {
        id: crypto.randomUUID ? crypto.randomUUID() : `msg-${Math.random().toString(36).substring(2, 9)}`,
        conversation_id: activeConvId,
        role: "user",
        content: message,
        created_at: new Date().toISOString(),
      };
      db.messages.push(userMsg);
      log("INPUT_STORE", "Message buffered locally", "INFO");

      const msgLower = message.toLowerCase();
      const needsSearch = /search|research|google|weather|price|stock|recent|current|latest|news|how many|who is|upcoming/i.test(msgLower);
      if (needsSearch) {
        log("RESEARCH_TRIGGER", `Research query routed to FastAPI backend for: '${message}'`, "INFO");
      }

      let answerText = "";

      log("MODEL_ROUTE", "Routing computational payload to FastAPI backend (Groq Llama)", "INFO");
      try {
        // Proxy request to FastAPI backend — longer timeout for cold starts
        const backendResponse = await fetch(`${BACKEND_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id,
            conversation_id: activeConvId,
            message,
            model: req.body.model || "free-base",
            tier: req.body.tier || "FREE"
          }),
          signal: AbortSignal.timeout(55000) // 55 second timeout for cold starts
        });

        if (!backendResponse.ok) {
          throw new Error(`FastAPI backend error: ${backendResponse.status}`);
        }

        const backendData = await backendResponse.json();
        answerText = backendData.answer || "No response from backend.";
        log("MODEL_ROUTE", "Inference complete, backend response decoded", "SUCCESS");
      } catch (err: any) {
        log("MODEL_ROUTE", `Backend unavailable: ${err.message}`, "WARNING");
        answerText = "Masidy is starting up — this can take up to 30 seconds on first load. Please try again in a moment.";
      }

      // Save to local DB only (backend handles Supabase persistence)
      const aiMsg: LocalMessage = {
        id: crypto.randomUUID ? crypto.randomUUID() : `msg-${Math.random().toString(36).substring(2, 9)}`,
        conversation_id: activeConvId,
        role: "assistant",
        content: answerText,
        created_at: new Date().toISOString(),
      };
      db.messages.push(aiMsg);
      saveDatabase(db);
      log("OUTPUT_STORE", "Answer registered. Cache state synchronized.", "SUCCESS");

      res.json({
        conversation_id: activeConvId,
        answer: answerText,
        logs: telemetryLogs,
      });

    } catch (err: any) {
      log("FATAL_ERROR", `Error: ${err.message}`, "WARNING");
      res.status(500).json({
        error: "Something went wrong. Please try again.",
      });
    }
  });

  // Serve static UI assets and route appropriately
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MASIDY TERMINAL ENGINE] Gateway alive on http://localhost:${PORT}`);
    
    // Keep backend warm — ping every 10 minutes to prevent Render free tier sleep
    setInterval(async () => {
      try {
        await fetch(`${BACKEND_URL}/health`, { signal: AbortSignal.timeout(10000) });
        console.log("[KEEP-ALIVE] Backend pinged successfully");
      } catch (e) {
        console.log("[KEEP-ALIVE] Backend ping failed — will retry");
      }
    }, 10 * 60 * 1000); // every 10 minutes
  });
}

startServer();
