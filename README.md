<div align="center">
  <h1>🤖 Masidy AI</h1>
  <p><strong>Your Intelligent AI Workspace Assistant</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#documentation">Docs</a> •
    <a href="#deployment">Deploy</a> •
    <a href="#support">Support</a>
  </p>
</div>

---

## Overview

Masidy AI is a powerful AI workspace assistant that helps you:
- 💬 Chat with 5 specialized AI models
- 📁 Upload files for context and analysis
- 🎤 Use voice input for hands-free messaging
- 💾 Maintain organized conversation history
- 🚀 Access via web, with mobile coming soon

Perfect for writing, coding, research, learning, and creative projects.

---

## Features

### 🎯 5 Specialized Models
- **Masidy Pro** - General purpose AI assistant
- **Masidy Research** - In-depth analysis and fact-checking
- **Masidy Creative** - Creative writing and ideation
- **Masidy Code** - Programming help and debugging
- **Masidy Tutor** - Educational explanations

### ✨ Smart Capabilities
- Intelligent conversation memory
- File attachment support
- Voice input transcription
- Mid-conversation model switching
- Automatic conversation saving
- Search and organization

### 🛡️ Privacy & Security
- End-to-end encrypted conversations
- No data sold to third parties
- Auto-backup of conversations
- User-controlled data retention

For more details, see [FEATURES.md](FEATURES.md).

---

## Quick Start

### For Users (5 minutes)

1. **Open Masidy**
   - Web: https://masidy.com
   - Or local: http://localhost:3000 (after setup)

2. **Select Your Model**
   - Choose from 5 specialized models

3. **Start Chatting**
   - Type your message
   - Attach files if needed
   - Hit Send!

**New to Masidy?** See [USER_GUIDE.md](USER_GUIDE.md)

### For Developers (10 minutes)

**Prerequisites:** Node.js 18+, Python 3.10+

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/masidy-ai.git
cd masidy-ai

# 2. Install dependencies
npm install
pip install -r backend/requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# 4. Start development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

**Full setup?** See [DEVELOPER_SETUP.md](DEVELOPER_SETUP.md)

---

## Documentation

| Document | Purpose |
|----------|---------|
| [USER_GUIDE.md](USER_GUIDE.md) | How to use all features |
| [FEATURES.md](FEATURES.md) | Detailed feature descriptions |
| [API_DOCS.md](API_DOCS.md) | API endpoints for integrations |
| [DEVELOPER_SETUP.md](DEVELOPER_SETUP.md) | Local development & extensions |
| [RENDER_STEPS.md](RENDER_STEPS.md) | Deploy to Render |

---

## Deployment

### One-Click Deploy to Render

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Go to Render.com
# 3. New ➜ Blueprint
# 4. Select your GitHub repository
# 5. Set GROQ_API_KEY environment variable
# 6. Deploy!
```

Your app will be live in ~10 minutes at `https://masidy-frontend.onrender.com`

**Need help?** See [RENDER_STEPS.md](RENDER_STEPS.md)

### Other Platforms

- Vercel (frontend only)
- Railway (full stack)
- AWS / Google Cloud
- Custom VPS

---

## Use Cases

### 📝 Writing
Draft emails, articles, social media content, creative stories

### 💻 Programming
Debug code, get programming help, learn best practices

### 📚 Learning
Get explanations, learn new concepts, practice problems

### 🔬 Research
Analyze topics, compare ideas, fact-check information

### 🧠 Brainstorming
Generate ideas, explore possibilities, creative projects

---

## Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| **Free** | Free | 5 chats/day, basic models |
| **Pro** | $9.99/mo | Unlimited, all models, priority support |
| **Enterprise** | Custom | API access, team features, SLA |

[View pricing](https://masidy.com/pricing)

---

## Architecture

Masidy is built with modern technologies:

**Frontend**: Web interface with 5 AI models selection

**Backend**: FastAPI server for message routing

**Database**: PostgreSQL for conversation storage

**AI Engine**: Groq Llama 3.1 for intelligent responses

**Deployment**: Render for full-stack hosting

See [DEVELOPER_SETUP.md](DEVELOPER_SETUP.md) for technical details.

---

## API Integration

Want to build on Masidy? Use our API:

```bash
# Send a message
curl -X POST https://api.masidy.com/api/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "Hello!", "model": "masidy-pro"}'
```

Full API reference: [API_DOCS.md](API_DOCS.md)

---

## Roadmap

### 🎯 Planned Features
- 📱 iOS & Android apps
- 🗣️ Voice response audio
- 🔗 Third-party integrations
- 👥 Team collaboration
- 🎨 Custom model fine-tuning

### 📅 Timeline
- **Now**: Web app, 5 models, core features
- **Q3 2026**: Mobile apps
- **Q4 2026**: Integrations & collaboration
- **2027**: Enterprise features

---

## Community

- **Forum**: https://community.masidy.com
- **GitHub**: https://github.com/YOUR_USERNAME/masidy-ai
- **Discord**: https://discord.gg/masidy
- **Twitter**: @MasidyAI

---

## Support

### Getting Help

- **FAQ**: https://masidy.com/faq
- **Email**: support@masidy.com
- **Community**: https://community.masidy.com
- **Status**: https://status.masidy.com

### Report Issues

Found a bug? [Open an issue](https://github.com/YOUR_USERNAME/masidy-ai/issues)

### Feature Requests

Have an idea? [Share feedback](https://feedback.masidy.com)

---

## Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details on how to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

## License

Masidy AI is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## Legal

- **Terms of Service**: https://masidy.com/terms
- **Privacy Policy**: https://masidy.com/privacy
- **Cookie Policy**: https://masidy.com/cookies

---

<div align="center">
  <p>
    Made with ❤️ by the Masidy team
  </p>
  <p>
    <a href="https://masidy.com">Website</a> •
    <a href="https://blog.masidy.com">Blog</a> •
    <a href="https://twitter.com/MasidyAI">Twitter</a>
  </p>
</div>

---

**Version**: 1.0.0  
**Last Updated**: May 2026
