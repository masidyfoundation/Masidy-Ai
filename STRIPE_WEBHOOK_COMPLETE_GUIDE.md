# 🎯 Stripe Webhooks - Complete Implementation Guide

## 🔄 How Webhooks Work (Visual Guide)

### Without Webhooks (Polling - Bad)
```
Your App                Stripe
    |                    |
    +--Check status--→   |
    |                    |
    +--Check status--→   | (repeated every second)
    |                    |
    +--Check status--→   | (WASTEFUL!)
    ↓                    |
Slow, expensive, unreliable
```

### With Webhooks (Event-driven - Good)
```
Customer                Your Server           Stripe
    |                       |                   |
    +--Upgrade Tier----→   |                   |
    |                       |                   |
    |                       |                   |
    |                       |←--POST /webhooks--+
    |                       |                   |
    |                       |                   |
    |←--Tier Updated------+                   |
    |                       |                   |
    |                    (Instant! Secure!)   |
```

---

## 📋 Complete Setup Workflow

### Phase 1: Local Development (Your Machine)

#### Step 1: Install Stripe CLI
```bash
# Windows (PowerShell as Admin)
choco install stripe-cli
# OR download: https://stripe.com/docs/stripe-cli/install

# Verify installation
stripe --version
# Output: stripe version X.X.X
```

#### Step 2: Authenticate Stripe CLI
```bash
stripe login
# Browser opens, authenticate with your Stripe account
# Then paste the provided credentials into terminal
# Output: > Done! Your API key has been saved to: ~/.config/stripe/rc
```

#### Step 3: Start Webhook Listener
```bash
# Terminal 1: Listen for webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Output:
# Ready! Your webhook signing secret is: whsec_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
# Forwarding to http://localhost:3000/api/webhooks/stripe
```

#### Step 4: Add Secret to `.env`
```bash
# Copy the secret from terminal output
# Add to .env file:
STRIPE_WEBHOOK_SECRET=whsec_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Verify by checking:
echo $env:STRIPE_WEBHOOK_SECRET  # PowerShell
# Should output your secret
```

#### Step 5: Start Your Server
```bash
# Terminal 2: Start development server
npm run dev

# Should see:
# [MASIDY TERMINAL ENGINE] Gateway alive on http://localhost:3000
```

#### Step 6: Test Webhook Events
```bash
# Terminal 3: Trigger test events
stripe trigger payment_intent.succeeded
# OR
stripe trigger customer.subscription.created
# OR
stripe trigger customer.subscription.deleted

# Watch Terminal 2 (server) for:
# ✅ Webhook verified: payment_intent.succeeded
# 💰 Payment succeeded: pi_XXX
# ✅ Updated admin_user to tier: PRO
```

---

### Phase 2: Production Deployment (Stripe Dashboard)

#### Step 1: Get Production Secret
1. Log in to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add Endpoint**
4. Enter URL: `https://your-render-app.onrender.com/api/webhooks/stripe`
5. Leave API version as default
6. Click **Add Events** and select:
   - ☑️ payment_intent.succeeded
   - ☑️ payment_intent.payment_failed
   - ☑️ customer.subscription.created
   - ☑️ customer.subscription.updated
   - ☑️ customer.subscription.deleted
   - ☑️ invoice.payment_succeeded
   - ☑️ invoice.payment_failed
   - ☑️ charge.dispute.created
7. Click **Create Event** → Copy signing secret

#### Step 2: Add to Render Environment
1. Go to [https://render.com/dashboard](https://render.com/dashboard)
2. Select your backend service
3. Click **Environment**
4. Add new variable:
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX` (from Stripe Dashboard)
5. Click **Save & Deploy**

#### Step 3: Update Stripe Dashboard URL
1. Go back to [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click your endpoint
3. Update URL if needed (should be your Render production URL)
4. Save changes

#### Step 4: Test Production Webhook
1. Make a test payment on your production site
2. Go to Stripe Dashboard → **Webhooks** → Your endpoint
3. Scroll to **Recent events**
4. You should see your test payment events
5. Click on event to see response (should be `"received": true`)

---

## 🔐 Security Deep Dive

### Why Signature Verification?

**Without verification (UNSAFE):**
```typescript
// ❌ BAD - Anyone can send fake events!
app.post("/api/webhooks/stripe", (req, res) => {
  const tierName = req.body.data.object.metadata.tierName;
  // What if attacker sends: tierName: "MAX"?
  // They just upgraded themselves for FREE!
  updateUserTier(tierName);
  res.json({ received: true });
});
```

**With verification (SAFE):**
```typescript
// ✅ GOOD - Only Stripe can send valid events
app.post("/api/webhooks/stripe", (req, res) => {
  const signature = req.headers["stripe-signature"];
  const event = client.webhooks.constructEvent(
    req.body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  // Signature verified! Safe to process
  updateUserTier(event.data.object.metadata.tierName);
  res.json({ received: true });
});
```

### How Stripe Signs Events

```
Stripe creates webhook:
  timestamp = 1621234567 (current time)
  event_id = evt_test_123
  body = JSON stringified event
  
Signature = HMAC-SHA256(
  timestamp.body,
  webhook_secret
)

Sends header:
  stripe-signature: t=1621234567,v1=ABC123DEF456...

Your code:
  1. Extracts timestamp and signature from header
  2. Recomputes HMAC using your webhook_secret
  3. Compares signatures
  4. If match → Definitely from Stripe ✅
  5. If mismatch → Reject ❌
```

---

## 📊 Event Flow Reference

### Customer Lifecycle

```
1. Customer visits your site
   ↓
2. Clicks "Upgrade to PRO"
   ↓
3. You call: POST /api/payment/checkout
   ↓
4. Redirect to Stripe checkout page
   ↓
5. Customer enters card: 4242 4242 4242 4242
   ↓
6. Submits payment
   ↓
7. Stripe processes payment
   ↓
8. ✅ WEBHOOK: payment_intent.succeeded
   → Your code receives webhook
   → Updates user to PRO tier
   → Saves to database
   ↓
9. 🎉 User sees PRO features unlocked
   
(All within 1-2 seconds!)
```

### Events by Scenario

| Scenario | Events Fired | Action |
|----------|--------------|--------|
| New subscription (credit card) | `payment_intent.succeeded` → `customer.subscription.created` → `invoice.payment_succeeded` | Activate PRO tier |
| Monthly renewal succeeds | `invoice.payment_succeeded` | Log success |
| Monthly renewal fails | `invoice.payment_failed` | Send retry email |
| User upgrades tier | `customer.subscription.updated` | Update tier in DB |
| User cancels subscription | `customer.subscription.deleted` | Downgrade to FREE |
| Chargeback filed | `charge.dispute.created` | Flag account, investigate |

---

## 🧪 Testing Checklist

### Local Testing
- [ ] `stripe login` works
- [ ] `stripe listen --forward-to localhost:3000/api/webhooks/stripe` runs
- [ ] Secret copied to `.env`
- [ ] Server running on port 3000
- [ ] `stripe trigger payment_intent.succeeded` shows webhook received
- [ ] Server logs show: `✅ Webhook verified: payment_intent.succeeded`
- [ ] Database updated with tier change
- [ ] Test all 8 event types (see list below)

### Staging/Production Testing
- [ ] Environment variable `STRIPE_WEBHOOK_SECRET` set on Render
- [ ] Webhook URL in Stripe Dashboard is correct
- [ ] Make test payment with 4242 card
- [ ] Check Stripe Dashboard → Events → Recent events
- [ ] Response shows `{ "received": true }`
- [ ] Check logs on Render for webhook processing
- [ ] Database updated with subscription info

### Event Types to Test
```bash
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
stripe trigger charge.dispute.created
```

---

## 🔍 Debugging

### Check if Secret is Loaded
```typescript
console.log("Secret loaded:", process.env.STRIPE_WEBHOOK_SECRET ? "✅" : "❌");
```

### Monitor Webhook Calls
```bash
# Terminal 1: Listen with verbose output
stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key sk_test_...

# Terminal 2: Trigger event
stripe trigger payment_intent.succeeded

# Terminal 1 shows request details:
# POST /api/webhooks/stripe [200]
# {
#   "type": "payment_intent.succeeded",
#   ...
# }
```

### Check Database Updates
```bash
# Look at local_db.json
cat local_db.json | jq '.users'

# Should show updated tier:
# {
#   "id": "u-admin",
#   "external_id": "admin_user",
#   "tier": "PRO"  ← Should be updated
# }
```

### Stripe Dashboard Event Logs
1. Go to https://dashboard.stripe.com/webhooks
2. Click your endpoint
3. Scroll to **Recent events**
4. Click any event to see:
   - Request body (what Stripe sent)
   - Response (what your server returned)
   - Timestamp, signature, status

---

## 🚨 Common Issues

### "Invalid signature" Error

**Cause:** Secret is wrong or incomplete
```
❌ STRIPE_WEBHOOK_SECRET=whsec_test
❌ STRIPE_WEBHOOK_SECRET=whsec_test_XXX (truncated)
❌ STRIPE_WEBHOOK_SECRET=whsec_live_ (live secret on test)
```

**Fix:**
```bash
# Get full secret from:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy ENTIRE secret: whsec_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Verify in .env:
echo $env:STRIPE_WEBHOOK_SECRET
# Should show full secret with no truncation
```

### Webhook Endpoint Not Receiving Events

**Check:**
1. Is `stripe listen` running? (Terminal 1)
2. Is server running? (Terminal 2)
3. Is endpoint URL correct in Stripe Dashboard?
4. Are selected events correct?
5. Is API version set correctly?

**Test:**
```bash
# Is webhook listener active?
stripe listen --list

# Force webhook to test server
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "stripe-signature: t=test,v1=test" \
  -H "Content-Type: application/json" \
  -d '{"type": "payment_intent.succeeded"}'

# Should see in server logs
```

### Database Not Updating

**Check:**
1. Event type is handled in switch statement
2. Metadata has correct `tierName`
3. User exists in database
4. Database file is writable

**Debug:**
```typescript
// Add logs to webhook handler
console.log("Event type:", event.type);
console.log("Customer:", event.data.object.customer);
console.log("Metadata:", event.data.object.metadata);
console.log("Users in DB:", db.users.length);
```

---

## 📈 Best Practices

### Do's ✅
- ✅ Always verify webhook signature
- ✅ Return 200 OK immediately (don't wait for processing)
- ✅ Log all webhook events
- ✅ Store raw event data for debugging
- ✅ Handle events idempotently (same event = same result)
- ✅ Monitor webhook success/failure rates

### Don'ts ❌
- ❌ Don't trust webhook data without verification
- ❌ Don't skip error handling
- ❌ Don't make external API calls inside webhook (could timeout)
- ❌ Don't assume events arrive in order
- ❌ Don't ignore duplicate events
- ❌ Don't leave secret in code (use environment variables)

---

## 🔗 Resources

- Stripe Webhooks Docs: https://stripe.com/docs/webhooks
- Stripe CLI Docs: https://stripe.com/docs/stripe-cli
- Event Types: https://stripe.com/docs/api/events/types
- Testing Guide: https://stripe.com/docs/testing
- API Reference: https://stripe.com/docs/api

