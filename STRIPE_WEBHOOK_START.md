# ⚡ STRIPE WEBHOOKS - START HERE (30 SECONDS)

## What You Need to Do RIGHT NOW

### Copy → Paste → Done (5 minutes)

1. **Get Your Secret:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the secret shown (whsec_test_XXXXXXX...)
```

2. **Add to `.env`:**
```env
STRIPE_WEBHOOK_SECRET=whsec_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

3. **Start Server:**
```bash
npm run dev
```

4. **Test It:**
```bash
stripe trigger payment_intent.succeeded
```

5. **Watch Server Logs:**
Should show:
```
✅ Webhook verified: payment_intent.succeeded
💰 Payment succeeded: pi_XXX
✅ Updated admin_user to tier: PRO
```

**DONE!** ✅ Webhooks are working

---

## What Was Added

**New Files:**
- ✅ Webhook endpoint in `server.ts` at `/api/webhooks/stripe`
- ✅ Signature verification (security)
- ✅ Event handlers for payments & subscriptions
- ✅ Automatic database updates

**What It Does:**
- Receives payment events from Stripe
- Verifies they're really from Stripe
- Updates user tier when payment succeeds
- Downgrades to FREE when subscription canceled

---

## For Production (Render)

1. Get secret from Stripe Dashboard (not CLI)
2. Add to Render environment variables
3. Update webhook URL in Stripe to: `https://your-app.onrender.com/api/webhooks/stripe`

---

## 8 Events Handled

| Event | Result |
|-------|--------|
| `payment_intent.succeeded` | ✅ Tier activated |
| `payment_intent.payment_failed` | ❌ Log error |
| `customer.subscription.created` | ✅ Subscription active |
| `customer.subscription.updated` | 🔄 Tier updated |
| `customer.subscription.deleted` | 🗑️ Downgraded to FREE |
| `invoice.payment_succeeded` | 💵 Monthly charge paid |
| `invoice.payment_failed` | ⚠️ Retry needed |
| `charge.dispute.created` | 🚨 Chargeback alert |

---

## Files to Read Next

1. **Quick Reference**: `STRIPE_WEBHOOK_QUICK_REF.md` (2 min)
2. **Full Setup Guide**: `STRIPE_WEBHOOK_SETUP.md` (10 min)
3. **Complete Guide**: `STRIPE_WEBHOOK_COMPLETE_GUIDE.md` (20 min)
4. **Environment Template**: `.env.template` (reference)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid signature" | Check secret is in `.env` exactly as shown by `stripe listen` |
| Webhook not called | Run `stripe listen` in terminal 1, then `stripe trigger` in terminal 3 |
| Server crashing | Make sure STRIPE_SECRET_KEY is also in `.env` |
| Database not updating | Check `local_db.json` exists and is writable |

---

## 🎯 Next Steps

- [ ] Run `stripe listen` and get your secret
- [ ] Add `STRIPE_WEBHOOK_SECRET` to `.env`
- [ ] Run `npm run dev`
- [ ] Test with `stripe trigger payment_intent.succeeded`
- [ ] Deploy to Render and add secret there too
- [ ] Update webhook URL in Stripe Dashboard

**Questions?** Check `STRIPE_WEBHOOK_COMPLETE_GUIDE.md`

