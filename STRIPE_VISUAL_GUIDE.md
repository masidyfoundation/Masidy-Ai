# 🚀 STRIPE DASHBOARD - STEP-BY-STEP VISUAL GUIDE

## How to Create Professional Stripe Products

---

## **STEP 1: Go to Stripe Dashboard**

**URL:** https://dashboard.stripe.com

**Navigate to:** Products (left sidebar menu)

---

## **STEP 2: Click "+ Add product"**

You'll see the product creation form with these fields:

```
┌─────────────────────────────────────┐
│  ADD NEW PRODUCT FORM               │
├─────────────────────────────────────┤
│                                     │
│  Nome (Product Name) *required*     │
│  [_________________________]         │
│                                     │
│  Descrizione (Description)          │
│  [_____________________________]     │
│  [_____________________________]     │
│  [_____________________________]     │
│                                     │
│  Immagine (Image) - optional        │
│  [Upload Image] (< 2 MB)            │
│                                     │
│  Categoria di prodotto (Category)   │
│  [Select: SaaS ▼]                   │
│                                     │
│  [SAVE] [CANCEL]                    │
│                                     │
└─────────────────────────────────────┘
```

---

## **FILL IN PRODUCT 1: FREE TIER**

### **Field: Nome (Name)**
```
Masidy Free Tier
```

### **Field: Descrizione (Description)**
```
Masidy Free Tier - Perfect for beginners and light users

Get started with Masidy AI completely free. Access core AI capabilities with 1 advanced model and 8 requests per minute. Perfect for testing, learning, and occasional use.

Includes:
• 1 AI Model
• 8 Requests per Minute
• Basic Research & Analysis
• Community Support
• Local Conversation History
• No Credit Card Required

Start using Masidy today - completely free, forever.
```

### **Field: Immagine (Image)**
- Skip this for now (optional)

### **Field: Categoria di prodotto (Category)**
```
Software as a Service (SaaS)
```

### **Click: SAVE PRODUCT**

✅ **PRODUCT 1 CREATED**

---

## **FILL IN PRODUCT 2: STARTER TIER**

### **Click: "+ Add product"**

### **Field: Nome (Name)**
```
Masidy Starter Tier
```

### **Field: Descrizione (Description)**
```
Masidy Starter Tier - $5/month

Unlock powerful AI capabilities with Starter. Get 2 advanced AI models and 15 requests per minute for research, analysis, and everyday tasks.

Perfect for students, freelancers, and professionals who need more power than Free.

Includes:
• 2 AI Models (Enhanced Capabilities)
• 15 Requests per Minute
• Advanced Research Tools
• Priority Email Support
• Extended Conversation History (100 conversations)
• Monthly Subscription - Cancel Anytime

Upgrade today and take your AI experience to the next level.
```

### **Field: Categoria di prodotto (Category)**
```
Software as a Service (SaaS)
```

### **Click: SAVE PRODUCT**

**THEN immediately click: "+ Add price"**

---

## **ADD PRICE FOR STARTER**

### **Pricing Form:**
```
┌─────────────────────────────────────┐
│  ADD PRICE FORM                     │
├─────────────────────────────────────┤
│                                     │
│  Pricing model:                     │
│  ○ One-time   ● Recurring           │
│                                     │
│  Billing period:                    │
│  ○ Daily  ○ Weekly  ● Monthly       │
│          ○ Quarterly  ○ Yearly      │
│                                     │
│  Price:                             │
│  $ [5.00] USD                       │
│                                     │
│  [SAVE PRICE]                       │
│                                     │
└─────────────────────────────────────┘
```

### **Select:**
- **Pricing model:** Recurring ✓
- **Billing period:** Monthly ✓
- **Price:** $5.00

### **Click: SAVE PRICE**

✅ **Copy the PRICE ID** (format: `price_XXXXXXX`)
```
STRIPE_PRICE_STARTER = price_XXXXXXX
```

---

## **FILL IN PRODUCT 3: BASE TIER**

### **Click: "+ Add product"**

### **Field: Nome (Name)**
```
Masidy Base Tier
```

### **Field: Descrizione (Description)**
```
Masidy Base Tier - $20/month

Professional-grade AI for all your tasks. Access 3 powerful AI models with 25 requests per minute for coding, writing, research, and creative work.

Designed for professionals, developers, and power users.

Includes:
• 3 AI Models (Professional Power)
• 25 Requests per Minute
• Expert Coding Assistance
• Priority Queue Access
• Unlimited Conversation History
• Priority Support
• Monthly Subscription - Cancel Anytime

Join hundreds of professionals using Masidy Base.
```

### **Field: Categoria di prodotto (Category)**
```
Software as a Service (SaaS)
```

### **Click: SAVE PRODUCT → ADD PRICE**

### **Price Details:**
- **Pricing model:** Recurring
- **Billing period:** Monthly
- **Price:** $20.00

### **Click: SAVE PRICE**

✅ **Copy the PRICE ID:**
```
STRIPE_PRICE_BASE = price_XXXXXXX
```

---

## **FILL IN PRODUCT 4: PRO TIER**

### **Click: "+ Add product"**

### **Field: Nome (Name)**
```
Masidy Pro Tier
```

### **Field: Descrizione (Description)**
```
Masidy Pro Tier - $50/month

Elite AI platform for demanding users. Access all 4 advanced AI models with 50 requests per minute for maximum productivity.

Built for agencies, teams, and professional power users who need the best.

Includes:
• 4 AI Models (Elite Performance)
• 50 Requests per Minute
• Advanced Analytics Dashboard
• Priority Queue + Priority Processing
• Unlimited Conversation History
• Creative AI Specialist Access
• Dedicated Priority Support
• Custom Configurations
• Monthly Subscription - Cancel Anytime

Experience the power of Masidy Pro today.
```

### **Field: Categoria di prodotto (Category)**
```
Software as a Service (SaaS)
```

### **Click: SAVE PRODUCT → ADD PRICE**

### **Price Details:**
- **Pricing model:** Recurring
- **Billing period:** Monthly
- **Price:** $50.00

### **Click: SAVE PRICE**

✅ **Copy the PRICE ID:**
```
STRIPE_PRICE_PRO = price_XXXXXXX
```

---

## **FILL IN PRODUCT 5: MAX TIER**

### **Click: "+ Add product"**

### **Field: Nome (Name)**
```
Masidy Max Tier
```

### **Field: Descrizione (Description)**
```
Masidy Max Tier - $100/month

Ultimate AI Platform - The Most Advanced AI Experience Available

Unlimited power with all 5 cutting-edge AI models and virtually unlimited requests (999/min). For enterprises, research teams, and users who demand the absolute best.

Perfect for:
• AI Research & Development
• Large-Scale Automation
• Enterprise Integration
• 24/7 Operations
• Mission-Critical Applications

Includes:
• All 5 AI Models (Maximum Intelligence)
• 999 Requests per Minute (Effectively Unlimited)
• Advanced Analytics Dashboard
• Reserved Capacity Guarantee
• Unlimited Conversation History
• Full Expert Support Access (All Specialists)
• Custom Model Training Support
• Dedicated Account Manager
• 24/7 VIP Priority Support
• API Access for Custom Integration
• Monthly Subscription - Cancel Anytime

Enterprise-grade AI at your fingertips. Upgrade to MAX now.
```

### **Field: Categoria di prodotto (Category)**
```
Software as a Service (SaaS)
```

### **Click: SAVE PRODUCT → ADD PRICE**

### **Price Details:**
- **Pricing model:** Recurring
- **Billing period:** Monthly
- **Price:** $100.00

### **Click: SAVE PRICE**

✅ **Copy the PRICE ID:**
```
STRIPE_PRICE_MAX = price_XXXXXXX
```

---

## **✅ FINAL VERIFICATION**

After creating all 5 products and 4 prices:

### **Check your Stripe Dashboard:**

```
Products Page
├─ Masidy Free Tier        (NO price)
├─ Masidy Starter Tier     price_xxx $5/mo
├─ Masidy Base Tier        price_xxx $20/mo
├─ Masidy Pro Tier         price_xxx $50/mo
└─ Masidy Max Tier         price_xxx $100/mo
```

### **You should have 4 Price IDs saved:**

```
STRIPE_PRICE_STARTER = price_1234567890ABCDEF...
STRIPE_PRICE_BASE = price_0987654321FEDCBA...
STRIPE_PRICE_PRO = price_ABCDEF1234567890...
STRIPE_PRICE_MAX = price_FEDCBA0987654321...
```

---

## **🎯 NEXT: Update Your .env Files**

In your project root:

### **File: `.env`**
```env
STRIPE_PRICE_STARTER=price_1234567890ABCDEF...
STRIPE_PRICE_BASE=price_0987654321FEDCBA...
STRIPE_PRICE_PRO=price_ABCDEF1234567890...
STRIPE_PRICE_MAX=price_FEDCBA0987654321...
```

### **File: `.env.local`**
```env
STRIPE_PRICE_STARTER=price_1234567890ABCDEF...
STRIPE_PRICE_BASE=price_0987654321FEDCBA...
STRIPE_PRICE_PRO=price_ABCDEF1234567890...
STRIPE_PRICE_MAX=price_FEDCBA0987654321...
```

---

## ⏱️ ESTIMATED TIME

- Create 5 Products: ~10 minutes
- Create 4 Prices: ~5 minutes
- Copy Price IDs: ~2 minutes
- Update .env files: ~2 minutes

**Total: ~20 minutes to full Stripe setup! 🚀**
