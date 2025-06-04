# Contributing to FreelanceVerse

Thank you for considering contributing to FreelanceVerse! We welcome contributions from everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Issue Reporting](#issue-reporting)

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment
4. Create a branch for your changes
5. Make your changes
6. Test your changes
7. Submit a pull request

## 💻 Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### Setup Steps
```bash
# Clone your fork
git clone https://github.com/your-username/Freelancing-website.git
cd Freelancing-website

# Install dependencies
npm install
cd backend && npm install && cd ..

# Create environment file
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Start development servers
# Terminal 1 - Backend
cd backend && node server.js

# Terminal 2 - Frontend
npm start
```

## 🔄 Making Changes

### Branch Naming
- `feature/feature-name` - for new features
- `bugfix/issue-description` - for bug fixes
- `hotfix/critical-issue` - for critical fixes
- `docs/documentation-update` - for documentation changes

### Commit Messages
Follow conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(auth): add JWT token refresh functionality`
- `fix(chat): resolve message ordering issue`
- `docs(readme): update installation instructions`

## 🎯 Style Guidelines

### Frontend (React)
- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Ensure accessibility compliance (ARIA labels, semantic HTML)
- Use TypeScript when possible

### Backend (Node.js)
- Use async/await instead of callbacks
- Implement proper error handling
- Validate all inputs
- Follow RESTful API conventions
- Use meaningful variable and function names

### Code Formatting
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Maximum line length: 100 characters

## 📝 Submitting Changes

### Before Submitting
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New features include appropriate tests
- [ ] Documentation is updated
- [ ] Commit messages are descriptive

### Pull Request Process
1. Update README.md with details of changes if applicable
2. Update version numbers following [SemVer](https://semver.org/)
3. Include screenshots for UI changes
4. Request review from maintainers

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
```

## 🐛 Issue Reporting

### Bug Reports
Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, versions)

### Feature Requests
Include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (if any)
- Screenshots or mockups (if applicable)

### Issue Labels
- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements
- `help wanted` - Extra attention needed
- `good first issue` - Good for newcomers

## 🏗️ Architecture Guidelines

### Component Structure
```
components/
├── ComponentName/
│   ├── index.js        # Main component
│   ├── styles.css      # Component-specific styles
│   ├── utils.js        # Component utilities
│   └── tests.js        # Component tests
```

### State Management
- Use React Context for global state
- Use local state for component-specific data
- Consider Redux for complex state management

### API Integration
- Use the existing API utility functions
- Implement proper error handling
- Add loading states
- Cache data when appropriate

## 🧪 Testing Guidelines

### Unit Tests
- Test individual functions and components
- Use Jest and React Testing Library
- Aim for >80% code coverage

### Integration Tests
- Test component interactions
- Test API endpoints
- Test user workflows

### Manual Testing
- Test on different screen sizes
- Test accessibility with screen readers
- Test across different browsers

## 📚 Documentation

### Code Documentation
- Use JSDoc for function documentation
- Add comments for complex logic
- Keep comments up to date

### User Documentation
- Update README for new features
- Add examples for new APIs
- Include screenshots for UI changes

## 🤝 Community

### Getting Help
- Check existing issues and documentation
- Ask questions in GitHub Discussions
- Join our community chat (if available)

### Mentorship
- Look for `good first issue` labels
- Experienced contributors can mentor newcomers
- Don't hesitate to ask for help

## 📞 Contact

For questions about contributing:
- Create an issue for feature discussions
- Use GitHub Discussions for general questions
- Contact maintainers directly for security issues

Thank you for contributing to FreelanceVerse! 🎉
