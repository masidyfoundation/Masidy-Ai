# Deployment Guide - Render Platform

**Recommended Platform**: Render (all-in-one full-stack hosting)

## Quick Start

1. Push code to GitHub with render.yaml
2. Connect GitHub to Render
3. Deploy blueprint from Render Dashboard
4. Set Groq API key
5. Your app is live!

See [RENDER_STEPS.md](RENDER_STEPS.md) for detailed step-by-step instructions.

## Environment Setup

### 1. Frontend Variables
- `VITE_API_URL`: API endpoint URL (e.g., `https://api.yourdomain.com`)
- `VITE_APP_NAME`: Application display name
- `VITE_APP_VERSION`: Current app version

### 2. Backend Variables
- `BACKEND_PORT`: FastAPI port (default: 8000)
- `DATABASE_URL`: Database connection string
- `GROQ_API_KEY`: Groq API key for LLM access
- `DEFAULT_MODEL`: Initial model selection

### 3. Server Variables
- `SERVER_PORT`: Express gateway port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `CORS_ORIGIN`: Allowed frontend origin

### 4. Security Variables
- `SESSION_SECRET`: Secret for session management
- `CSRF_PROTECTION`: Enable CSRF protection (true/false)

## Deployment Platforms

### Option 1: Vercel (Recommended for Frontend)
```bash
npm install -g vercel
vercel deploy
```
- Automatic deployments from Git
- Environment variables via Vercel dashboard
- Free tier available
- Built-in CI/CD

### Option 2: Railway (Full Stack)
```bash
railway login
railway init
railway up
```
- Full stack deployment (frontend + backend)
- PostgreSQL support
- Integrated environment management
- Pay-as-you-go pricing

### Option 3: Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main
```
- Simple Git-based deployment
- Add-ons for PostgreSQL, Redis
- Hobby dyno free tier

## Pre-Deployment Checklist

- [ ] Build production bundle: `npm run build`
- [ ] Test build locally: `npm run preview`
- [ ] Set environment variables
- [ ] Configure CORS origins
- [ ] Setup database backups
- [ ] Enable rate limiting
- [ ] Configure logging
- [ ] Setup monitoring/alerting
- [ ] Security audit completed
- [ ] Performance benchmarks reviewed

## Post-Deployment Verification

1. Health check: `GET /api/health`
2. Models endpoint: `GET /api/models`
3. Send test message: `POST /api/chat`
4. Check logs for errors
5. Monitor API response times
