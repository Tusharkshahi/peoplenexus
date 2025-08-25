# 🤝 Contributing to PeopleNexus

Thank you for your interest in contributing to PeopleNexus! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🎯 How Can I Contribute?

### Reporting Bugs

- Use the GitHub issue tracker
- Include detailed steps to reproduce the bug
- Provide your operating system and browser information
- Include screenshots if applicable

### Suggesting Enhancements

- Use the GitHub issue tracker with the "enhancement" label
- Describe the feature and why it would be useful
- Include mockups or examples if possible

### Code Contributions

- Fork the repository
- Create a feature branch
- Make your changes
- Add tests if applicable
- Submit a pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Local Development

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/Tusharkshahi/peoplenexus-frontend.git
   cd peoplenexus-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure your code follows the coding standards**
2. **Add tests for new functionality**
3. **Update documentation if needed**
4. **Run the test suite**
5. **Check that the build passes**

### Pull Request Guidelines

1. **Use a clear and descriptive title**
2. **Provide a detailed description of changes**
3. **Include screenshots for UI changes**
4. **Reference any related issues**
5. **Ensure all CI checks pass**

### Commit Message Format

Use conventional commit messages:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add OAuth2 authentication
fix(dashboard): resolve layout issues on mobile
docs(readme): update installation instructions
```

## 📝 Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper types for all functions and variables
- Avoid `any` type when possible
- Use interfaces for object shapes

### React/Next.js

- Use functional components with hooks
- Follow the App Router patterns
- Use proper TypeScript for props
- Implement proper error boundaries

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design
- Maintain accessibility standards

### File Organization

- Keep components small and focused
- Use descriptive file names
- Group related files in directories
- Follow the existing project structure

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use trailing commas in objects and arrays
- Use meaningful variable names

## 🧪 Testing

### Writing Tests

- Write tests for new features
- Ensure good test coverage
- Use descriptive test names
- Test both success and error cases

### Running Tests

```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex logic
- Include examples for components
- Keep documentation up to date

### README Updates

- Update README for new features
- Include setup instructions
- Add usage examples
- Update screenshots if needed

## 🏷️ Issue Labels

We use the following labels to categorize issues:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high`: High priority issue
- `priority: low`: Low priority issue
- `priority: medium`: Medium priority issue

## 🎉 Recognition

Contributors will be recognized in the following ways:

- Added to the contributors list in README
- Mentioned in release notes
- Given credit in the project documentation

## 📞 Getting Help

If you need help with contributing:

- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Join our community chat (if available)
- Contact the maintainers directly

## 🙏 Thank You

Thank you for contributing to PeopleNexus! Your contributions help make this project better for everyone.

---

**Happy coding! 🚀** 