# Contributing to Masidy AI

Thank you for interest in contributing to Masidy AI! This document provides guidelines for contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch**: `git checkout -b feature/amazing-feature`
4. **Set up development environment** (see [DEVELOPER_SETUP.md](DEVELOPER_SETUP.md))
5. **Make your changes**
6. **Test thoroughly**
7. **Commit with clear messages**: `git commit -m "Add amazing feature"`
8. **Push to your fork**: `git push origin feature/amazing-feature`
9. **Open a Pull Request**

## Development Setup

```bash
git clone https://github.com/YOUR_USERNAME/masidy-ai.git
cd masidy-ai
npm install
pip install -r backend/requirements.txt
cp .env.example .env
# Edit .env and add GROQ_API_KEY
npm run dev
```

See [DEVELOPER_SETUP.md](DEVELOPER_SETUP.md) for full instructions.

## Types of Contributions

### Bug Reports
- Check existing issues first
- Provide clear description
- Include steps to reproduce
- Add screenshots if relevant
- Share environment details

### Feature Requests
- Describe the feature clearly
- Explain use case
- Suggest implementation approach
- Link related issues

### Documentation
- Fix typos and unclear sections
- Add examples
- Improve clarity
- Update outdated info

### Code Contributions
- Follow our code style
- Add tests if applicable
- Update documentation
- Keep commits focused
- Reference related issues

## Code Style

### TypeScript/JavaScript
```typescript
// Use TypeScript for type safety
// Follow prettier formatting
// Use descriptive variable names
// Add comments for complex logic
```

### Python
```python
# Follow PEP 8 style guide
# Use type hints
# Keep functions focused
# Add docstrings
```

### Git Commits
```
feat: Add amazing new feature
fix: Resolve critical bug
docs: Update README
refactor: Improve code quality
test: Add test coverage
```

## Pull Request Process

1. **Update documentation** if adding features
2. **Add tests** for new functionality
3. **Run linter**: `npm run lint`
4. **Build successfully**: `npm run build`
5. **Provide clear description** of changes
6. **Reference related issues**: "Fixes #123"
7. **Be responsive** to review feedback

## Review Guidelines

All PRs require:
- ✅ Code review by maintainer
- ✅ All tests passing
- ✅ No linting errors
- ✅ Documentation updated
- ✅ No merge conflicts

## Questions?

- **Discord**: https://discord.gg/masidy
- **GitHub Discussions**: https://github.com/masidy-ai/masidy-ai/discussions
- **Email**: dev-support@masidy.ai

## Recognition

All contributors are recognized in:
- GitHub contributors page
- Monthly newsletter
- CONTRIBUTORS.md file
- Release notes (major contributions)

---

**Thank you for contributing to Masidy AI!** 🎉
