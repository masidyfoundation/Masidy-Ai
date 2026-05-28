# 🎨 STRIPE PRODUCTS - PROFESSIONAL SETUP

## Professional Product Information for Stripe Dashboard

---

## 📦 PRODUCT 1: FREE TIER

### **Nome (Product Name):**
```
Masidy Free Tier
```

### **Descrizione (Description):**
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

### **Categoria (Category):**
```
Software as a Service (SaaS)
```

### **Price (Stripe):**
```
FREE (no price needed)
```

---

## 📦 PRODUCT 2: STARTER TIER

### **Nome (Product Name):**
```
Masidy Starter Tier
```

### **Descrizione (Description):**
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

### **Categoria (Category):**
```
Software as a Service (SaaS)
```

### **Price (Stripe):**
```
$5.00 USD per month
Recurring Monthly
```

---

## 📦 PRODUCT 3: BASE TIER

### **Nome (Product Name):**
```
Masidy Base Tier
```

### **Descrizione (Description):**
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

### **Categoria (Category):**
```
Software as a Service (SaaS)
```

### **Price (Stripe):**
```
$20.00 USD per month
Recurring Monthly
```

---

## 📦 PRODUCT 4: PRO TIER

### **Nome (Product Name):**
```
Masidy Pro Tier
```

### **Descrizione (Description):**
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

### **Categoria (Category):**
```
Software as a Service (SaaS)
```

### **Price (Stripe):**
```
$50.00 USD per month
Recurring Monthly
```

---

## 📦 PRODUCT 5: MAX TIER

### **Nome (Product Name):**
```
Masidy Max Tier
```

### **Descrizione (Description):**
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

### **Categoria (Category):**
```
Software as a Service (SaaS)
```

### **Price (Stripe):**
```
$100.00 USD per month
Recurring Monthly
```

---

## 🎯 STRIPE SETUP CHECKLIST

### Step 1: Create Products

- [ ] **Product 1 (FREE)** - Created
  - Name: `Masidy Free Tier`
  - Price: No charge
  - Save & Record Product ID

- [ ] **Product 2 (STARTER)** - Created
  - Name: `Masidy Starter Tier`
  - Price: $5.00/month
  - Save & Record Product ID

- [ ] **Product 3 (BASE)** - Created
  - Name: `Masidy Base Tier`
  - Price: $20.00/month
  - Save & Record Product ID

- [ ] **Product 4 (PRO)** - Created
  - Name: `Masidy Pro Tier`
  - Price: $50.00/month
  - Save & Record Product ID

- [ ] **Product 5 (MAX)** - Created
  - Name: `Masidy Max Tier`
  - Price: $100.00/month
  - Save & Record Product ID

### Step 2: Get Price IDs

- [ ] Copy `STRIPE_PRICE_STARTER` price ID
- [ ] Copy `STRIPE_PRICE_BASE` price ID
- [ ] Copy `STRIPE_PRICE_PRO` price ID
- [ ] Copy `STRIPE_PRICE_MAX` price ID

### Step 3: Update Environment Variables

After creating products, update your `.env` and `.env.local`:

```env
STRIPE_PRICE_STARTER=price_XXXXXXX
STRIPE_PRICE_BASE=price_XXXXXXX
STRIPE_PRICE_PRO=price_XXXXXXX
STRIPE_PRICE_MAX=price_XXXXXXX
```

---

## 📋 QUICK REFERENCE TABLE

| Tier | Product Name | Price | Models | Requests/Min | Support |
|------|--------------|-------|--------|--------------|---------|
| **FREE** | Masidy Free Tier | Free | 1 | 8 | Community |
| **STARTER** | Masidy Starter Tier | $5/mo | 2 | 15 | Email Support |
| **BASE** | Masidy Base Tier | $20/mo | 3 | 25 | Priority Support |
| **PRO** | Masidy Pro Tier | $50/mo | 4 | 50 | Dedicated Support |
| **MAX** | Masidy Max Tier | $100/mo | 5 | 999 | 24/7 VIP Support |

---

## 🎨 OPTIONAL: Add Product Images

For professional branding, you can add images to each product in Stripe (optional):

**Image Requirements:**
- Format: JPEG, PNG, or WEBP
- Size: Less than 2 MB
- Recommended: 1200x1200px or 800x800px

**Create simple tier badge images:**
- FREE: Blue background with "FREE" text
- STARTER: Green background with "$5/MO" text
- BASE: Purple background with "$20/MO" text
- PRO: Gold/Orange background with "$50/MO" text
- MAX: Platinum/Silver background with "$100/MO" text

---

## ✅ VERIFICATION

After creating all products and prices in Stripe:

1. Go to: https://dashboard.stripe.com/products
2. Verify all 5 products are listed
3. Click each product and verify pricing is correct
4. Copy all 4 price IDs (format: `price_XXXXXXX`)
5. Return here and update `.env` files with real IDs

**Then you're ready to deploy to Render!**
