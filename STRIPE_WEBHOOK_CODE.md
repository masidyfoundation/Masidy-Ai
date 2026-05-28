# Stripe Webhook - Code Implementation Reference

## What Was Added to `server.ts`

### Webhook Endpoint Code (Lines ~151-270)

```typescript
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
        
        if (paymentIntent.customer) {
          const user = db.users.find(u => u.external_id === paymentIntent.customer);
          if (user) {
            console.log(`⚠️ Payment failed for user: ${user.external_id}`);
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
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        console.log(`⚠️ Invoice payment failed: ${invoice.id}`);
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object;
        console.log(`⚠️ Dispute filed: ${dispute.id}`);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    // Save updated database
    if (updated) {
      saveDatabase(db);
    }

    // Always respond with 200 OK to Stripe
    res.json({ received: true, eventId: event.id });

  } catch (err: any) {
    console.error("❌ Webhook error:", err.message);
    res.status(400).json({ 
      error: "Webhook error",
      message: err.message 
    });
  }
});
```

---

## How It Works

### 1. Raw Body Middleware
```typescript
express.raw({ type: "application/json" })
```
- Keeps request body as Buffer (not parsed JSON)
- Required for signature verification
- Stripe signature is computed from raw bytes

### 2. Signature Verification
```typescript
const event = client.webhooks.constructEvent(
  req.body,        // Raw buffer
  signature,       // From stripe-signature header
  webhookSecret    // From STRIPE_WEBHOOK_SECRET env var
);
```
- Uses HMAC-SHA256 to verify authenticity
- Throws error if signature doesn't match
- Prevents fake webhook attacks

### 3. Event Type Routing
```typescript
switch (event.type) {
  case "payment_intent.succeeded":
    // Handle successful payment
  case "customer.subscription.deleted":
    // Handle subscription cancellation
  // ... etc
}
```
- Routes to appropriate handler
- Each case logs what happened
- Updates database if needed

### 4. Database Sync
```typescript
if (updated) {
  saveDatabase(db);
}
```
- Only saves if data changed
- Updates user tier in `local_db.json`
- Persists subscription status

---

## Environment Variables Required

```env
# Already existing:
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# NEW - Required for webhooks:
STRIPE_WEBHOOK_SECRET=whsec_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## Testing the Implementation

### Local Test Flow

```
Terminal 1: stripe listen
Terminal 2: npm run dev
Terminal 3: stripe trigger payment_intent.succeeded

Expected Terminal 2 Output:
  ✅ Webhook verified: payment_intent.succeeded
  💰 Payment succeeded: pi_xxx
  ✅ Updated admin_user to tier: PRO
  
Terminal 1 Output:
  [POST] /api/webhooks/stripe [200]
```

### Production Webhook Request

```
POST /api/webhooks/stripe HTTP/1.1
Host: your-domain.com
Content-Type: application/json
stripe-signature: t=1621234567,v1=ABC123DEF456...

{
  "id": "evt_test_123",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_test_123",
      "customer": "cus_test_123",
      "metadata": {
        "tierName": "PRO"
      }
    }
  }
}
```

---

## Events Handled

```typescript
payment_intent.succeeded
├─ When: Successful payment
└─ Action: Update user tier

payment_intent.payment_failed
├─ When: Failed payment
└─ Action: Log warning

customer.subscription.created
├─ When: New subscription
└─ Action: Activate tier

customer.subscription.updated
├─ When: Tier changed
└─ Action: Update tier in DB

customer.subscription.deleted
├─ When: Subscription canceled
└─ Action: Downgrade to FREE

invoice.payment_succeeded
├─ When: Monthly charge paid
└─ Action: Log success

invoice.payment_failed
├─ When: Monthly charge failed
└─ Action: Log warning

charge.dispute.created
├─ When: Chargeback filed
└─ Action: Alert (log)
```

---

## Error Handling

```typescript
// Missing signature or secret
→ 400 error: "Missing signature or webhook secret"

// Stripe client not configured
→ 400 error: "Stripe not configured"

// Invalid signature
→ Error thrown by Stripe SDK
→ Caught and returned as 400 error

// Success
→ 200 OK: { received: true, eventId: "..." }
```

---

## Logging Output Examples

### Successful Payment
```
✅ Webhook verified: payment_intent.succeeded
💰 Payment succeeded: pi_1234567890
✅ Updated admin_user to tier: PRO
```

### Subscription Updates
```
✅ Webhook verified: customer.subscription.created
📅 Subscription created: sub_1234567890
✅ Subscription active for admin_user: PRO
```

### Cancellation
```
✅ Webhook verified: customer.subscription.deleted
🗑️ Subscription canceled: sub_1234567890
✅ Downgraded admin_user to FREE tier
```

### Unhandled Events
```
✅ Webhook verified: customer.created
ℹ️ Unhandled event type: customer.created
```

---

## Security Features

✅ **Signature Verification**
- Only processes events from Stripe

✅ **Raw Body Middleware**
- Preserves request body for verification

✅ **Error Handling**
- Doesn't crash on bad events

✅ **Graceful Degradation**
- Returns 200 OK even if user not found

✅ **Logging**
- All events logged for debugging

---

## Files Modified

- ✅ `server.ts` - Added webhook endpoint (lines ~151-270)

## Files Created

- ✅ `STRIPE_WEBHOOK_SETUP.md` - Complete setup guide
- ✅ `STRIPE_WEBHOOK_QUICK_REF.md` - Quick reference
- ✅ `STRIPE_WEBHOOK_COMPLETE_GUIDE.md` - Detailed guide
- ✅ `STRIPE_WEBHOOK_START.md` - Quick start
- ✅ `.env.template` - Environment variables template
- ✅ `STRIPE_WEBHOOK_CODE.md` - This file

---

## Integration Points

### Webhook → Database Flow

```
Stripe sends event
         ↓
Webhook endpoint receives POST
         ↓
Verify signature with STRIPE_WEBHOOK_SECRET
         ↓
Extract event type & data
         ↓
Route to appropriate handler
         ↓
Find user by customer ID
         ↓
Update user.tier
         ↓
Save database to local_db.json
         ↓
Return 200 OK to Stripe
         ↓
Customer sees new tier activated
```

---

## Next Steps

1. Get webhook secret: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. Add to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_test_...`
3. Test: `npm run dev` + `stripe trigger payment_intent.succeeded`
4. Deploy to Render
5. Add secret to Render environment
6. Update webhook URL in Stripe Dashboard
7. Test production payment

