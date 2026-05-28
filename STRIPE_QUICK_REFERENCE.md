# STRIPE TIER PRICING - Quick Reference

## 5 Tiers Configuration

| Tier | Price | Requests/min | Models Included | Stripe Status |
|------|-------|--------------|-----------------|----------------|
| **FREE** | $0 | 8 | Llama 8B (1) | ✅ No price needed |
| **STARTER** | $5/mo | 15 | 8B + Mixtral (2) | 🔄 Create price |
| **BASE** | $20/mo | 25 | 8B + Mixtral + 70B (3) | 🔄 Create price |
| **PRO** | $50/mo | 50 | All 4 models (4) | 🔄 Create price |
| **MAX** | $100/mo | 999 | All + 405B (5) | 🔄 Create price |

---

## Stripe Setup Timeline

```
Step 1: Create Stripe Products (5 products)
        ↓ (5 minutes)
Step 2: Create Stripe Prices for 4 products
        ↓ (3 minutes - FREE has no price)
Step 3: Copy 4 Price IDs
        ↓ (1 minute)
Step 4: Add to .env files
        ↓ (2 minutes)
Step 5: Deploy to Render
        ↓ (5 minutes)
Step 6: Test checkout
        ↓ (2 minutes)
DONE! ✅ Live Stripe system ready
```

**Total time: ~20 minutes**

---

## Files Modified

- ✅ `.env` - Created with Stripe config template
- ✅ `.env.local` - Updated with new price variables
- ✅ `server.ts` - Already configured to use new price IDs
- ✅ `STRIPE_SETUP.md` - This guide
