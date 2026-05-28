# 🎯 STRIPE WEBHOOK SETUP GUIDE - Complete Guide

## What Are Webhooks?

Webhooks are **event notifications** from Stripe to your server when:
- ✅ Payments are received
- ❌ Payments fail
- 📅 Subscriptions are created, updated, or canceled
- 💰 Refunds are processed
- ⚠️ Disputes are filed

**Without webhooks**: Your system won't know when payments succeed/fail (you'd have to constantly check)  
**With webhooks**: Stripe tells your server instantly when something happens

---

## 🔧 STEP 1: Get Your Webhook Signing Secret

### Local Testing with Stripe CLI

**1. Install Stripe CLI** (if not installed):
```bash
# Windows (using PowerShell as Admin or Chocolatey)
choco install stripe-cli
# OR download from: https://stripe.com/docs/stripe-cli

# Mac
brew install stripe/stripe-cli/stripe

# Linux
# Download: https://github.com/stripe/stripe-cli/releases
```

**2. Login to Stripe CLI**:
```bash
stripe login
# You'll be prompted to open a browser and authenticate
# Paste the API key when requested
```

**3. Get Your Webhook Secret**:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will output something like:
```
Ready! Your webhook signing secret is: whsec_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Save this secret!** You'll need it in your `.env` file.

---

## 🔒 STEP 2: Configure Environment Variables

### Add to your `.env` file:

```env
# Stripe Keys (you already have these)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# NEW: Webhook Signing Secret
STRIPE_WEBHOOK_SECRET=whsec_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### For Render Deployment:

Go to **Render Dashboard** → Your Backend Service → **Environment** → Add:

```
STRIPE_WEBHOOK_SECRET=whsec_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Then update your webhook URL in Stripe Dashboard to:
```
https://your-render-app.onrender.com/api/webhooks/stripe
```

---

## 🌐 STEP 3: Configure Webhook in Stripe Dashboard (Production)

### Access Stripe Dashboard:
1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add Endpoint**

### Set Webhook Details:

**Endpoint URL:**
```
https://your-domain.com/api/webhooks/stripe
```
Or for Render:
```
https://your-app-name.onrender.com/api/webhooks/stripe
```

**API Version:** Select `2025-01-27.acacia` (or your version)

### Select Events to Listen For:

**Payment Events:**
- ☑️ `payment_intent.succeeded` - Payment succeeded
- ☑️ `payment_intent.payment_failed` - Payment failed

**Subscription Events:**
- ☑️ `customer.subscription.created` - New subscription
- ☑️ `customer.subscription.updated` - Subscription upgraded/downgraded
- ☑️ `customer.subscription.deleted` - Subscription canceled
- ☑️ `invoice.payment_succeeded` - Invoice paid
- ☑️ `invoice.payment_failed` - Invoice payment failed

**Dispute Events:**
- ☑️ `charge.dispute.created` - Chargeback filed
- ☑️ `charge.dispute.closed` - Dispute resolved

---

## 💾 STEP 4: Copy Your Webhook Signing Secret

After creating the endpoint:

1. Click on the endpoint you just created
2. Scroll to **Signing secret**
3. Click **Reveal** (shows: `whsec_live_...` for production or `whsec_test_...` for testing)
4. Copy and add to your environment variables

---

## 🧪 STEP 5: Test Your Webhook Setup

### Local Testing with Stripe CLI (Easiest!)

**Terminal 1** - Start the CLI listener:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Terminal 2** - Trigger a test event:
```bash
stripe trigger payment_intent.succeeded
# or
stripe trigger customer.subscription.created
```

**Expected Output:**
- Stripe CLI shows: `> [POST] /api/webhooks/stripe`
- Your server logs show the webhook was received

### Manual Testing with curl:

```bash
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{
    "id": "evt_test_123",
    "type": "payment_intent.succeeded",
    "data": {
      "object": {
        "id": "pi_test_123",
        "customer": "cus_test_123",
        "status": "succeeded",
        "metadata": {"tierName": "PRO"}
      }
    }
  }'
```

---

## 🔄 How Webhooks Work in Your System

### Flow Diagram:

```
1. Customer completes checkout on your site
   ↓
2. Stripe processes payment
   ↓
3. Stripe sends webhook to: POST /api/webhooks/stripe
   ↓
4. Your server:
   ✅ Verifies webhook signature (security check)
   ✅ Checks event type
   ✅ Updates database with new tier/subscription
   ✅ Returns 200 OK to Stripe
   ↓
5. Customer sees their new tier active immediately
```

---

## 📊 Key Events Explained

| Event | Triggered When | Action |
|-------|---|---|
| `payment_intent.succeeded` | Payment succeeds | Activate subscription tier |
| `payment_intent.payment_failed` | Payment fails | Send email, downgrade tier |
| `customer.subscription.created` | New subscription | Add subscription to user |
| `customer.subscription.updated` | Tier upgraded/downgraded | Update user tier in database |
| `customer.subscription.deleted` | Cancelled by user | Downgrade to FREE tier |
| `invoice.payment_failed` | Monthly charge fails | Send retry notification |

---

## 🛡️ Security: Webhook Signature Verification

**Why?** Anyone could send fake webhooks to your server. Signature verification ensures it's really Stripe.

Your code already does this! Here's how:

```typescript
// Stripe sends a signature header:
// stripe-signature: t=1619713533,v1=xxx,v0=yyy

// Your code:
// 1. Takes the raw body + webhook secret
// 2. Computes a signature hash
// 3. Compares with the signature header
// 4. If they match → It's really Stripe! ✅
// 5. If they don't → Reject the request ❌
```

---

## 🚀 Deployment Checklist

### Before going live:

- [ ] **Get webhook signing secret** from Stripe Dashboard
- [ ] **Add to `.env`**: `STRIPE_WEBHOOK_SECRET=whsec_...`
- [ ] **Test locally** with Stripe CLI
- [ ] **Deploy code** to Render
- [ ] **Add environment variable** to Render dashboard
- [ ] **Update webhook URL** in Stripe to your production domain
- [ ] **Test production webhook** by making a test payment
- [ ] **Monitor webhook logs** in Stripe Dashboard

### Production Webhook URL Examples:

**Render:**
```
https://masidy-backend.onrender.com/api/webhooks/stripe
```

**Custom Domain:**
```
https://api.masidy.com/api/webhooks/stripe
```

---

## 🔍 Troubleshooting

### Webhook not being called?

**Check:**
1. ✅ `STRIPE_WEBHOOK_SECRET` is set in environment
2. ✅ Endpoint URL in Stripe Dashboard is correct
3. ✅ Endpoint URL has `/api/webhooks/stripe` (exact path)
4. ✅ Server is running and accessible from internet
5. ✅ Firewall isn't blocking incoming requests

**Debugging:**
```bash
# Check Stripe Dashboard Webhooks → Endpoint → View Events
# You'll see if events were sent and what response was returned
```

### "Invalid signature" error?

**Causes:**
- ❌ Wrong `STRIPE_WEBHOOK_SECRET`
- ❌ Webhook secret from different account
- ❌ Using test secret in production

**Solution:**
- Copy the exact secret from Stripe Dashboard
- Make sure it matches your environment

---

## 📚 Full Event Reference

See all available events:
https://stripe.com/docs/api/events

---

## 🎓 Next Steps

1. ✅ Get webhook secret from Stripe CLI or Dashboard
2. ✅ Add to `.env` file
3. ✅ Test with `stripe trigger` command
4. ✅ Deploy to Render
5. ✅ Update production URL in Stripe Dashboard
6. ✅ Monitor webhook logs

---

## ❓ Questions?

Check your Stripe Dashboard:
- **Developers** → **Events** → View all events
- **Developers** → **Webhooks** → View endpoint details and logs

