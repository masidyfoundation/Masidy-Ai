# Stripe Webhook Quick Reference

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your Webhook Secret

**Option A: Local Testing (Development)**
```bash
# Install Stripe CLI (if not already installed)
# https://stripe.com/docs/stripe-cli

# Start listening for webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Output will show:
# Your webhook signing secret is: whsec_test_XXXXXXXXXXXX
```

**Option B: Production (Stripe Dashboard)**
1. Go to https://dashboard.stripe.com
2. Click **Developers** → **Webhooks**
3. Click **Add Endpoint**
4. Enter URL: `https://your-domain.com/api/webhooks/stripe`
5. Select events (see list below)
6. Copy signing secret: `whsec_live_XXXXXXXXXXXX`

### Step 2: Add to `.env`

```env
STRIPE_WEBHOOK_SECRET=whsec_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 3: Deploy & Test

```bash
# Local test
stripe trigger payment_intent.succeeded

# Production
Make a test payment on your site
```

---

## 📋 Events Handled

| Event | Action | Database Update |
|-------|--------|-----------------|
| `payment_intent.succeeded` | Payment completed | `user.tier = tierName` |
| `payment_intent.payment_failed` | Payment failed | Log warning |
| `customer.subscription.created` | Subscription active | `user.tier = tierName` |
| `customer.subscription.updated` | Tier changed | `user.tier = tierName` |
| `customer.subscription.deleted` | Subscription canceled | `user.tier = FREE` |
| `invoice.payment_succeeded` | Monthly charge paid | Log success |
| `invoice.payment_failed` | Monthly charge failed | Log warning |
| `charge.dispute.created` | Chargeback filed | Log alert |

---

## 🔒 What's Protected

Your webhook endpoint automatically:
- ✅ Verifies Stripe signature (prevents fake requests)
- ✅ Validates webhook secret
- ✅ Handles errors gracefully
- ✅ Returns 200 OK to Stripe
- ✅ Updates database only on valid events

---

## 🧪 Testing Commands

```bash
# Start webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# In another terminal, trigger events:
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
stripe trigger customer.subscription.deleted
stripe trigger charge.dispute.created

# Watch your server logs for:
# ✅ Webhook verified: payment_intent.succeeded
# 💰 Payment succeeded: pi_XXXXX
# ✅ Updated user to tier: PRO
```

---

## 🚨 Troubleshooting

**Webhook not working?**

1. Check `.env` has `STRIPE_WEBHOOK_SECRET`
2. Run: `echo $STRIPE_WEBHOOK_SECRET` (should show your secret)
3. Check endpoint URL in Stripe Dashboard
4. Verify Stripe CLI is listening: `stripe listen`
5. Check server logs for errors

**"Invalid signature" error?**
- Verify secret is exactly correct (no spaces)
- Don't use secret from different account
- Make sure using test secret locally, live secret in production

**Webhook received but not processing?**
- Check your server logs
- Verify event type matches switch case
- Make sure database file is writable

---

## 🔗 Stripe Dashboard Links

- Dashboard: https://dashboard.stripe.com
- Webhooks: https://dashboard.stripe.com/webhooks
- Events: https://dashboard.stripe.com/events
- API Keys: https://dashboard.stripe.com/apikeys
- Test Cards: https://stripe.com/docs/testing

