# 🔑 STRIPE PLANS SETUP GUIDE - Masidy AI

## Your Stripe Account Details
**Dashboard:** https://dashboard.stripe.com  
**Public Key:** pk_test_...  
**Secret Key:** sk_test_...  

---

## ✅ CHECKLIST: Create 5 Stripe Products

### Products Created (Copy the Product IDs for reference):

**1. FREE Tier**
- [ ] Created: `Masidy - Free Tier`
- [ ] Price: No charge (free)
- [ ] Description: Free tier with Llama 3.1 8B (8 requests/min)
- Product ID: _______________

**2. STARTER Tier ($5/mo)**
- [ ] Created: `Masidy - Starter Tier`
- [ ] Price: $5.00 USD recurring monthly
- [ ] Description: 8B + Mixtral (15 requests/min)
- Product ID: _______________
- **Price ID:** price_XXXXXXX (SAVE THIS!)

**3. BASE Tier ($20/mo)**
- [ ] Created: `Masidy - Base Tier`
- [ ] Price: $20.00 USD recurring monthly
- [ ] Description: 8B + Mixtral + 70B (25 requests/min)
- Product ID: _______________
- **Price ID:** price_XXXXXXX (SAVE THIS!)

**4. PRO Tier ($50/mo)**
- [ ] Created: `Masidy - Pro Tier`
- [ ] Price: $50.00 USD recurring monthly
- [ ] Description: All 4 models (50 requests/min)
- Product ID: _______________
- **Price ID:** price_XXXXXXX (SAVE THIS!)

**5. MAX Tier ($100/mo)**
- [ ] Created: `Masidy - Max Tier`
- [ ] Price: $100.00 USD recurring monthly
- [ ] Description: All models + 405B (999 requests/min)
- Product ID: _______________
- **Price ID:** price_XXXXXXX (SAVE THIS!)

---

## 📝 Environment Variable Mapping

**In your .env file, add:**

```env
STRIPE_PRICE_STARTER=price_XXXXXXX
STRIPE_PRICE_BASE=price_XXXXXXX
STRIPE_PRICE_PRO=price_XXXXXXX
STRIPE_PRICE_MAX=price_XXXXXXX
```

**Replace `price_XXXXXXX` with actual Stripe Price IDs**

---

## 🚀 For Render Deployment

**Go to:** Render Dashboard → Your backend service → Environment

**Add these 4 variables:**

```
STRIPE_PRICE_STARTER=price_XXXXXXX
STRIPE_PRICE_BASE=price_XXXXXXX
STRIPE_PRICE_PRO=price_XXXXXXX
STRIPE_PRICE_MAX=price_XXXXXXX
```

---

## ✨ Testing Stripe Locally

After setup, test in your browser:

1. Start local server: `npm run dev`
2. Go to: http://localhost:3000/pricing
3. Click "Upgrade to STARTER"
4. You should see Stripe checkout modal
5. Use test card: `4242 4242 4242 4242` (Exp: 12/34, CVC: 123)
6. Verify subscription created in Stripe dashboard

---

## Stripe Test Cards

**Successful payment:**
- Card: `4242 4242 4242 4242`
- Exp: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)

**Failed payment:**
- Card: `4000 0000 0000 0002`
- CVC: Any 3 digits

---

## References

- Stripe Dashboard: https://dashboard.stripe.com
- Stripe API Docs: https://stripe.com/docs/api
- Stripe Test Mode: All test cards work in test mode
- Verify keys at: https://dashboard.stripe.com/apikeys
