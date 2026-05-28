# 🚀 Deploy Masidy AI to Render - Quick Start

## ✅ Everything is Ready!

Your repository is fully prepared for deployment:
- ✅ Code committed and pushed to GitHub
- ✅ render.yaml blueprint configured
- ✅ Production build optimized
- ✅ All environment variables documented

**GitHub Repository**: https://github.com/masidyfoundation/Masidy-Ai

---

## 📋 Deployment in 5 Steps (15 minutes)

### STEP 1️⃣: Create Render Account (2 minutes)

1. Go to **https://render.com**
2. Click "Get Started" 
3. Sign up with **GitHub account** (important!)
4. Click "Authorize render-app" 
5. Verify email

---

### STEP 2️⃣: Create PostgreSQL Database (3 minutes)

1. In Render Dashboard, click **"New +"** button (top right)
2. Select **"PostgreSQL"**
3. Fill in:
   - **Name**: `masidy-db`
   - **Database**: `masidy`
   - **User**: `masidy_user`
   - **Region**: Select your region
   - **Plan**: `Free`
4. Click **"Create Database"**
5. Wait for database to be created (~2 minutes)
6. **Copy the Internal Database URL** (you'll need this)
   - Look for: `postgresql://...` string
   - Don't share this URL publicly!

---

### STEP 3️⃣: Deploy Services with Blueprint (5 minutes)

1. In Render Dashboard, click **"New +"** button
2. Select **"Blueprint"**
3. Select repository:
   - **Owner**: masidyfoundation
   - **Repo**: Masidy-Ai
4. Click **"Connect"**
5. Review the service definitions:
   - masidy-frontend (Static site)
   - masidy-backend (Python FastAPI)
   - masidy-gateway (Node.js Express)
6. Click **"Deploy Blueprint"**
7. Wait for all services to deploy (~3-5 minutes)

---

### STEP 4️⃣: Configure Environment Variables (3 minutes)

After deployment, configure required variables:

#### **For masidy-backend service:**

1. Go to Render Dashboard → **masidy-backend**
2. Click **"Environment"** tab
3. Add/Update variables:

```
GROQ_API_KEY = sk-xxx (your actual Groq API key)
PYTHON_ENV = production
DATABASE_URL = (auto-linked from masidy-db)
```

**How to get GROQ_API_KEY:**
- Go to https://console.groq.com
- Sign up or login
- Click "API Keys"
- Create new key
- Copy and paste into Render

4. Click **"Save"**
5. Service will automatically redeploy

#### **For masidy-gateway service:**

1. Go to Render Dashboard → **masidy-gateway**
2. Click **"Environment"** tab
3. Verify variables:

```
BACKEND_URL = https://masidy-backend.onrender.com
NODE_ENV = production
SERVER_PORT = 3000
DATABASE_URL = (auto-linked from masidy-db)
```

4. No changes needed (already configured)

#### **For masidy-frontend service:**

1. Go to Render Dashboard → **masidy-frontend**
2. Click **"Environment"** tab
3. Verify:

```
VITE_API_URL = https://masidy-gateway.onrender.com/api
```

4. No changes needed (already configured)

---

### STEP 5️⃣: Verify Deployment (2 minutes)

**Test your deployed app:**

1. **Frontend** → Click the masidy-frontend service
   - Copy the URL (e.g., `https://masidy-frontend.onrender.com`)
   - Open in browser
   - You should see the Masidy AI chat interface

2. **Backend API** → Click the masidy-backend service
   - Copy the URL and add `/docs` (e.g., `https://masidy-backend.onrender.com/docs`)
   - Should show FastAPI Swagger documentation

3. **Send a test message:**
   - In the frontend UI, type a message
   - Should see AI response within 2-3 seconds
   - If you see a response, **deployment is successful!** ✅

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Services won't start** | Check logs in Render Dashboard → click service → Logs tab. Common: missing GROQ_API_KEY |
| **Database won't connect** | Make sure database was created BEFORE running blueprint. Run blueprint again if needed |
| **"503 Bad Gateway"** | Services still starting. Wait 2-3 minutes and refresh |
| **API returns 500 error** | Check GROQ_API_KEY is correct and valid at console.groq.com |
| **CORS errors** | CORS is configured in backend. If issues persist, check browser console logs |

---

## 📊 Service URLs After Deployment

Once deployed, you'll have:

- **Frontend**: `https://masidy-frontend.onrender.com`
- **Backend API**: `https://masidy-backend.onrender.com`
- **Gateway**: `https://masidy-gateway.onrender.com`
- **API Docs**: `https://masidy-backend.onrender.com/docs`
- **Database**: PostgreSQL (masidy-db)

---

## 🎯 Next Steps

### Immediately After Deployment

1. ✅ Test each service in browser
2. ✅ Send test messages through chat
3. ✅ Verify responses from Groq API
4. ✅ Check logs for any errors

### For Production (Optional)

1. **Add Custom Domain**
   - Go to masidy-frontend settings
   - Add custom domain (e.g., masidy.com)
   - Follow DNS instructions from Render

2. **Enable Free SSL Certificate**
   - Render does this automatically
   - No action needed

3. **Setup Auto-Deploy**
   - Already enabled!
   - Pushing to main branch auto-deploys

4. **Monitor Services**
   - Setup Render alerts (optional)
   - Monitor error rates and logs

---

## 📝 Important Notes

### About Free Plan
- ✅ Includes free PostgreSQL database
- ✅ Free static hosting (frontend)
- ✅ Free Python service (backend) - spins down after 15 min of inactivity
- ✅ Free Node service (gateway)
- ⚠️ Services may take 30+ seconds to wake up after inactivity

### To Keep Services Running 24/7
- Upgrade to Pro tier (optional)
- Or use cron job to keep warm

### Cost
- **Free tier**: $0/month (pay for compute as needed)
- **Pro tier**: $7+/month per service

---

## 🆘 Need Help?

1. Check logs in Render Dashboard
2. See [RENDER_STEPS.md](RENDER_STEPS.md) for detailed guide
3. See [DEVELOPER_SETUP.md](DEVELOPER_SETUP.md) for technical details
4. Email: support@masidy.com

---

## ✨ Once Deployed

Your Masidy AI is now:

- 🌐 **Publicly accessible** on the internet
- 🔄 **Auto-updated** when you push to GitHub
- 🔒 **Secure** with automatic SSL certificates
- 📊 **Monitored** by Render
- 🚀 **Scalable** - upgrade when needed

---

**Ready? Start with Step 1 above!** 🎉

Need to link your custom domain masidy.com? See [RENDER_STEPS.md](RENDER_STEPS.md) Step 7.
