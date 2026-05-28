# Step-by-Step Render Deployment Guide

## Pre-Deployment Checklist ✅

- [x] Production build created (dist/)
- [x] Vite config optimized for production
- [x] Environment variables configured (.env.example)
- [x] gunicorn added to backend requirements.txt
- [x] render.yaml service definitions created
- [x] Production build tested locally
- [ ] GitHub repository created/updated

## Step 1: Prepare GitHub Repository

```bash
# From project root
git init
git add .
git commit -m "Initial Masidy AI deployment configuration"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/masidy-ai.git
git push -u origin main
```

**Important**: Push to GitHub - Render pulls from GitHub to deploy.

## Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub account (grants Render access to your repos)
3. Click "New +" button → "Blueprint"

## Step 3: Create PostgreSQL Database First

1. In Render Dashboard, click "New +" → "PostgreSQL"
2. Create a new PostgreSQL database:
   - **Name**: masidy-db
   - **Database**: masidy
   - **User**: masidy_user
   - **Plan**: Free (or desired)
3. Copy the internal connection string (you'll need this)
4. Click "Create"

*Note: The database must be created manually through Render UI before deploying services*

## Step 4: Deploy Using Blueprint (render.yaml)

1. **Select Repository**:
   - Find your masidy-ai repository
   - Click "Connect"

2. **Review Services**:
   - masidy-frontend (Static Site)
   - masidy-backend (Python service)
   - masidy-gateway (Node.js service)

3. **Verify Environment Variables** (in Render Dashboard):

   **Link Database to Services**:
   - masidy-backend → Environment → Link masidy-db database
   - masidy-gateway → Environment → Link masidy-db database
   - This auto-populates DATABASE_URL

   **For masidy-backend**:
   ```
   GROQ_API_KEY=sk-your-groq-key-here
   PYTHON_ENV=production
   DATABASE_URL=[auto-linked from masidy-db]
   ```

   **For masidy-gateway**:
   ```
   BACKEND_URL=https://masidy-backend.onrender.com
   NODE_ENV=production
   SERVER_PORT=3000
   DATABASE_URL=[auto-linked from masidy-db]
   ```

   **For masidy-frontend**:
   ```
   VITE_API_URL=https://masidy-gateway.onrender.com/api
   ```

4. **Click "Deploy Blueprint"**
   - Render will create all services
   - Deployment takes 5-10 minutes
   - Watch logs in Dashboard

## Step 5: Configure Groq API Key

1. Go to https://console.groq.com
2. Create API key
3. In Render Dashboard:
   - Go to masidy-backend → Environment
   - Set `GROQ_API_KEY` to your key
   - Click "Save"
   - Service will redeploy automatically

## Step 6: Verify Deployment

**Frontend**: https://masidy-frontend.onrender.com (should load chat UI)

**Backend Health**: https://masidy-backend.onrender.com/docs (FastAPI Swagger)

**Test Message**: Send a message through the frontend - should receive AI response

## Step 7: Configure Custom Domain (Optional)

1. In Render Dashboard → Settings
2. Add custom domain (e.g., masidy.ai)
3. Update VITE_API_URL if needed

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "Service won't start" | Build failed | Check logs in Render Dashboard |
| "API connection error" | Backend offline | Check BACKEND_URL is correct |
| "CORS errors" | Frontend/backend mismatch | Verify both URLs in env vars |
| "Database error" | No schema | Run `psql < backend/schema.sql` in Render |
| "Socket.io connection failed" | Websocket disabled | Render free tier has limitations |

## Deployment Complete!

Your Masidy AI is now live:

- **Frontend**: masidy-frontend.onrender.com
- **Backend**: masidy-backend.onrender.com
- **Database**: PostgreSQL on Render
- **Gateway**: Proxies through masidy-gateway

**Free Tier Limits**:
- Services spin down after 15 min inactivity
- Limited concurrency
- Upgrade to paid for production use

## Next Steps

1. **Monitor**: Check Render Dashboard for errors/uptime
2. **Scale**: Upgrade to paid tier if needed
3. **Backup**: Enable automatic PostgreSQL backups
4. **CI/CD**: Configure GitHub Actions for auto-deploy on push
