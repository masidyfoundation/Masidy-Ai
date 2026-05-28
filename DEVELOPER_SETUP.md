# Masidy AI - Developer Setup Guide

Set up Masidy for local development or custom extensions.

## System Requirements

- Node.js 18+ and npm 9+
- Python 3.10+
- Git
- 2GB RAM minimum
- macOS, Linux, or Windows

## Quick Start (5 minutes)

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/masidy-ai.git
cd masidy-ai
```

### 2. Install Dependencies

```bash
# Install Node dependencies
npm install

# Install Python backend dependencies
pip install -r backend/requirements.txt
```

### 3. Set Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add:

```
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
DATABASE_URL=sqlite:///./local_db.json
```

Get Groq API key from https://console.groq.com

### 4. Start Development Server

```bash
# Starts frontend dev server (http://localhost:3000)
npm run dev
```

### 5. Test It

Open http://localhost:3000 in your browser. You should see the Masidy interface.

---

## Project Structure

```
masidy-ai/
├── src/                    # Frontend React components
│   ├── App.tsx            # Main application
│   ├── components/        # UI components
│   └── styles/            # Styling
├── backend/               # Python FastAPI backend
│   ├── app.py            # API endpoints
│   ├── logic/            # AI processing
│   └── requirements.txt   # Python dependencies
├── dist/                  # Production build output
├── package.json           # Node dependencies
├── vite.config.ts        # Build configuration
└── server.ts             # Express gateway
```

---

## Available Commands

### Development

```bash
# Start dev server with hot reload
npm run dev

# Run linter (TypeScript check)
npm run lint

# Preview production build
npm run preview
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start

# Clean build artifacts
npm run clean
```

### Database

```bash
# Initialize database schema
sqlite3 local_db.json < backend/schema.sql

# View database (if using PostgreSQL)
psql postgresql://user:pass@localhost/masidy
```

---

## Adding New Features

### 1. Add Frontend Component

Create in `src/components/YourComponent.tsx`:

```typescript
import React from 'react';

export default function YourComponent() {
  return (
    <div>
      Your component here
    </div>
  );
}
```

Then import in `src/App.tsx`:

```typescript
import YourComponent from './components/YourComponent';
```

### 2. Add API Endpoint

Edit `backend/app.py`:

```python
@app.post("/api/your-endpoint")
async def your_endpoint(request_body: dict):
    # Process request
    result = process_data(request_body)
    return {"status": "success", "data": result}
```

### 3. Add New AI Model

1. Register in `backend/logic/models.py`:

```python
MODELS = {
    "your-model": {
        "name": "Your Model",
        "description": "What it does",
        "speed": "fast"
    }
}
```

2. Add model selection in frontend `src/components/InputBar.tsx`

### 4. Add Webhook Handler

Edit `server.ts` to add webhook endpoint:

```typescript
app.post('/api/webhooks/your-event', async (req, res) => {
  // Handle webhook
  res.json({ status: 'received' });
});
```

---

## Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Masidy AI
```

### Backend (.env)

```
GROQ_API_KEY=sk-...
DATABASE_URL=sqlite:///./local_db.json
PYTHON_ENV=development
```

### Deployment (.env.production)

```
VITE_API_URL=https://api.masidy.com
NODE_ENV=production
```

---

## Database

### Using SQLite (Default)

Data stored in `local_db.json`. Good for development.

```bash
# View data
cat local_db.json | python -m json.tool
```

### Using PostgreSQL

For production-ready setup:

1. Create PostgreSQL database
2. Set `DATABASE_URL`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/masidy
```

3. Run migrations:

```bash
sqlite3 backend/schema.sql | psql postgresql://...
```

---

## Debugging

### Frontend Debugging

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Use React DevTools extension
4. Check Network tab for API calls

### Backend Debugging

Enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

Check logs in terminal running `npm run dev`

### API Debugging

Use cURL or Postman to test endpoints:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "hello", "model": "masidy-pro"}'
```

---

## Testing

### Run Linter

```bash
npm run lint
```

Checks TypeScript syntax and types.

### Manual Testing Checklist

- [ ] Frontend loads without errors
- [ ] Can send messages
- [ ] Conversations save correctly
- [ ] Model switching works
- [ ] File uploads work
- [ ] No console errors

### Automated Testing (Optional)

Set up with Jest for unit tests:

```bash
npm install --save-dev jest
```

---

## Performance Optimization

### Frontend

- Use React DevTools Profiler
- Check bundle size: `npm run build`
- Enable browser caching

### Backend

- Monitor API response times
- Use database indexing
- Cache frequent queries

---

## Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Set production environment variables
- [ ] Test API endpoints
- [ ] Verify database connectivity
- [ ] Enable SSL/HTTPS
- [ ] Set up monitoring/logging
- [ ] Review security settings

See [RENDER_STEPS.md](RENDER_STEPS.md) for deployment guide.

---

## Troubleshooting

### "Module not found" error

```bash
npm install
pip install -r backend/requirements.txt
```

### Port 3000 already in use

```bash
# Find process using port 3000
lsof -i :3000

# Or use different port
PORT=3001 npm run dev
```

### Database connection error

Check `DATABASE_URL` in `.env`:

```bash
# For SQLite
DATABASE_URL=sqlite:///./local_db.json

# For PostgreSQL
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### API not responding

- Check backend is running
- Verify `GROQ_API_KEY` is set
- Check firewall/network settings
- Review server logs

---

## IDE Setup

### VS Code (Recommended)

Install extensions:
- ESLint
- Prettier
- Thunder Client (for API testing)
- GitLens

### Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Contributing

To contribute improvements:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and test locally
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Open Pull Request

---

## Resources

- **Documentation**: https://docs.masidy.com
- **Community**: https://community.masidy.com
- **Issue Tracker**: https://github.com/YOUR_USERNAME/masidy-ai/issues
- **Discussions**: https://github.com/YOUR_USERNAME/masidy-ai/discussions

---

## Support

- **Forum**: https://community.masidy.com
- **Email**: dev-support@masidy.com
- **Discord**: https://discord.gg/masidy

---

**Last Updated**: May 2026  
**Version**: 1.0.0
