# Render Deployment Guide

## Prerequisites

1. **Render Account**: https://render.com (free tier available)
2. **GitHub Repository**: Push your code to GitHub
3. **Groq API Key**: From https://console.groq.com

## One-Click Deployment Setup

### Step 1: Connect GitHub to Render

1. Go to https://render.com
2. Sign up/Login with GitHub account
3. Grant Render access to your repositories

### Step 2: Deploy Using render.yaml

The `render.yaml` file defines your entire infrastructure:

- **Frontend**: Static site deployment (dist folder)
- **Backend**: Python FastAPI with Gunicorn
- **Gateway**: Node.js Express server
- **Database**: PostgreSQL

### Step 3: Deploy via Render Dashboard

1. Go to Dashboard → "New +" → "Blueprint"
2. Select your GitHub repository containing `render.yaml`
3. Render will parse and show all services:
   - masidy-frontend (Static)
   - masidy-backend (Python)
   - masidy-gateway (Node.js)
   - masidy-db (PostgreSQL)
4. Click "Create Blueprint"

### Step 4: Configure Environment Variables

In Render Dashboard for each service:

**masidy-backend**:
```
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://...
PYTHON_ENV=production
```

**masidy-gateway**:
```
BACKEND_URL=https://masidy-backend.onrender.com
NODE_ENV=production
SERVER_PORT=3000
DATABASE_URL=postgresql://...
```

**masidy-frontend**:
```
VITE_API_URL=https://masidy-gateway.onrender.com/api
```

### Step 5: Deploy

1. Push changes to GitHub main branch
2. Render automatically deploys
3. Monitor deployment in Render Dashboard
4. Access your app at: `https://masidy-frontend.onrender.com`

## Manual Deployment (Alternative)

If you prefer manual setup without blueprint:

```bash
# Create web services one by one in Render dashboard
1. Frontend: Connect GitHub → Static Site → Select dist folder
2. Backend: Connect GitHub → Python → Start command: gunicorn
3. Gateway: Connect GitHub → Node → Start command: node dist/server.cjs
4. Database: PostgreSQL → PostgreSQL 14
```

## Environment Variables Reference

| Service | Variable | Example |
|---------|----------|---------|
| Backend | GROQ_API_KEY | sk-proj-... |
| Backend | DATABASE_URL | postgresql://user:pass@host:5432/db |
| Gateway | BACKEND_URL | https://backend.onrender.com |
| Gateway | NODE_ENV | production |
| Frontend | VITE_API_URL | https://gateway.onrender.com/api |

## Database Setup

PostgreSQL is created automatically. To initialize schema:

1. Connect to PostgreSQL in Render Dashboard
2. Run schema.sql from backend/schema.sql
3. Or access via psql:

```bash
psql postgresql://user:password@hostname:5432/masidy < backend/schema.sql
```

## Post-Deployment Verification

1. Check Frontend: https://masidy-frontend.onrender.com
2. Check Backend Health: https://masidy-backend.onrender.com/health
3. Check Gateway: https://masidy-gateway.onrender.com
4. Test API: POST to /api/chat with sample message

## Monitoring & Logs

- View logs in Render Dashboard → Service → Logs
- Check error rates and uptime
- Enable alerting for service issues

## Cost Estimation (Render Free Tier)

- Frontend Static Site: FREE
- Backend: $0/month (free tier with limits)
- Gateway: $0/month (free tier with limits)
- Database: $0/month (free tier with limits)

**Limits**: Services spin down after 15 min inactivity. Upgrade to paid for production.

## Deployment Troubleshooting

**Build fails**: Check build logs in Render Dashboard
**Service won't start**: Verify start command and PORT environment variable
**Database connection error**: Check DATABASE_URL format
**CORS errors**: Verify BACKEND_URL in gateway environment
**API timeouts**: Backend may be spinning up (free tier delay)

## Next Steps

1. Commit and push render.yaml to GitHub
2. Create Render blueprint
3. Deploy services
4. Test end-to-end flow
5. Scale to paid tier if needed for production
