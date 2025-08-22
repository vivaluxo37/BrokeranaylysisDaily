# User Rules and Guidelines

This document contains the complete user guidelines for the Brokeranalysis Platform, including product overview, project structure, technology stack, and development instructions.

---

# Product Overview

**Brokeranalysis** is an AI-powered broker recommendation platform that helps traders find the best trading platforms for their specific strategies and needs.

## Core Features
- **AI-Powered Recommendations**: Evidence-backed broker suggestions based on trading style, capital, and preferences
- **Trust Scores**: Comprehensive 0-100 ratings evaluating broker reliability, regulation, and reputation
- **Broker Comparison**: Side-by-side analysis of trading platforms with detailed metrics
- **Location-Aware**: Geographically relevant broker recommendations
- **Educational Content**: Market insights, trading guides, and broker analysis

## Target Audience
- Individual traders (forex, stocks, crypto)
- Investment professionals seeking platform comparisons
- New traders looking for guidance on broker selection

## Key Value Propositions
- Evidence-based recommendations over marketing claims
- Transparent trust scoring methodology
- Personalized matching based on trading requirements
- Comprehensive broker database with real-time data

---

# Project Structure

## Core Directories

### `/app` - Next.js App Router
- **`layout.tsx`** - Root layout with metadata, SEO, and providers
- **`page.tsx`** - Homepage with component composition
- **`globals.css`** - Global styles and CSS variables
- **Mock data files** - `*MockData.ts` for development/testing
- **Page variants** - Multiple page implementations for A/B testing

### `/components` - React Components
- **UI Components** - Reusable interface elements
- **Feature Components** - Business logic components (Hero, Recommender, etc.)
- **Layout Components** - Headers, footers, navigation
- **`/ui`** - Radix UI wrapper components (shadcn/ui pattern)
- **`/navigation`** - Navigation-specific components

### `/lib` - Utilities & Configuration
- **`utils.ts`** - Common utilities (cn function for class merging)
- **`types.ts`** - TypeScript type definitions
- **`enums.ts`** - Application enums
- **`/contexts`** - React context providers
- **`/hooks`** - Custom React hooks
- **`/services`** - API and external service integrations

### `/scripts` - Database & Migration Scripts
- SQL migration files for data import
- Python scripts for data processing
- Database utilities and batch operations

## File Naming Conventions

### Components
- **PascalCase** for component files: `HeroSection.tsx`
- **camelCase** for utility files: `fetchWithMock.ts`
- **kebab-case** for page routes: `page.brokeranalysis.tsx`

### Data Files
- **camelCase** with descriptive suffixes: `homepageMockData.ts`
- **UPPERCASE** for constants: `DATABASE_DOCUMENTATION.md`

## Architecture Patterns

### Component Structure
- Use `'use client'` directive for interactive components
- Implement proper TypeScript interfaces
- Follow Radix UI patterns for accessible components
- Use `cn()` utility for conditional styling

### State Management
- React Context for global state (LocationProvider)
- Local state with useState for component-specific data
- Props drilling for simple parent-child communication

### Styling Approach
- Tailwind utility classes as primary styling method
- CSS variables for design system tokens
- Component variants using class-variance-authority
- Responsive design with Tailwind breakpoints

## Import Conventions
- Use `@/` path alias for all internal imports
- Group imports: external libraries, then internal modules
- Destructure imports when importing multiple items

---

# Technology Stack

## Framework & Runtime
- **Next.js 15.4.7** - React framework with App Router
- **React 19.1.1** - UI library with latest features
- **TypeScript 5** - Type-safe JavaScript
- **Node.js 20+** - Runtime environment

## Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Radix UI** - Headless component primitives
- **Lucide React** - Icon library
- **CSS Variables** - Design system tokens
- **tailwindcss-animate** - Animation utilities

## Development Tools
- **ESLint** - Code linting with Next.js config
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes
- **Turbopack** - Fast bundler for development

## Utilities
- **clsx & tailwind-merge** - Conditional CSS classes
- **class-variance-authority** - Component variant management

## Common Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Path Aliases
- `@/*` maps to project root for clean imports
- Use `@/components/*`, `@/lib/*`, `@/app/*` for imports

## Build Configuration
- **App Router** - Modern Next.js routing
- **TypeScript strict mode** - Enhanced type checking
- **Module resolution**: bundler mode for optimal imports

---

# Development Instructions and Guidelines

## MCP Server Usage
**CRITICAL REQUIREMENT**: Always use MCP servers for every task including:
- Error fixing and debugging
- Building new features
- Database operations
- API integrations
- Testing and validation
- Performance optimization
- Security implementations
- All development activities

MCP servers should be your primary tool for all development work.

## Data Migration Guidelines
**IMPORTANT**: We are currently migrating all our data from Dailyforex.com to Brokeranalysis.

### Migration Rules:
- **Immediate Action Required**: If you see anything that says "dailyforex" or "Dailyforex", immediately change it to "Brokeranalysis" or "brokeranalysis"
- This applies to:
  - Code comments
  - Variable names
  - File names
  - Database entries
  - Documentation
  - URLs and links
  - Configuration files
  - Any text content

### Search and Replace Priority:
- `Dailyforex.com` → `Brokeranalysis.com`
- `dailyforex` → `brokeranalysis`
- `Dailyforex` → `Brokeranalysis`
- `DAILYFOREX` → `BROKERANALYSIS`

## Company Information

### Official Company Details:
**Address:**
```
30 N Gould St Ste R
Sheridan, WY 82801, US
```

**Tax Information:**
- EIN: 384298140

**Contact Information:**
- Phone: (801)-893-2577

### Usage Guidelines:
- Use this information in:
  - Footer components
  - Contact pages
  - Legal documents
  - Business correspondence
  - API documentation
  - Terms of service
  - Privacy policies

## Development Workflow

1. **Always start with MCP servers** for any development task
2. **Check for dailyforex references** before implementing any feature
3. **Update company information** when creating new components or pages
4. **Follow the established project structure** outlined above
5. **Use the specified technology stack** and coding conventions
6. **Implement proper TypeScript interfaces** for all components
7. **Follow responsive design principles** with Tailwind CSS
8. **Test thoroughly** using the available testing frameworks

## Quality Assurance

- All code must be TypeScript compliant
- Follow ESLint rules and formatting guidelines
- Ensure mobile responsiveness for all components
- Implement proper error handling and loading states
- Use semantic HTML and accessibility best practices
- Optimize for performance and Core Web Vitals

---

## Agent Hooks System

The Brokeranalysis Platform includes 8 essential agent hooks designed to enhance code quality, performance, and accessibility while providing useful development automation.

### Automatic Hooks (Triggered on File Save)

#### 1. Test Runner
- **File**: `.kiro/hooks/test-runner.json`
- **Triggers**: On save of `.ts`, `.tsx`, `.js`, `.jsx` files
- **Actions**: 
  - Runs ESLint for code quality checks
  - Executes TypeScript compiler for type error detection
- **Settings**: 2-second debounce, background execution, notifications enabled

#### 2. SEO Optimizer
- **File**: `.kiro/hooks/seo-optimizer.json`
- **Triggers**: On save of `layout.tsx`, `page.tsx` files
- **Actions**: 
  - Reviews metadata completeness (title, description, keywords)
  - Validates Open Graph and Twitter Card implementation
  - Checks structured data (JSON-LD) for broker/financial services
  - Verifies canonical URLs and mobile-friendly meta tags
- **Settings**: 3-second debounce, foreground execution, notifications enabled

#### 3. Dependency Updater
- **File**: `.kiro/hooks/dependency-updater.json`
- **Triggers**: On save of `package.json`, `package-lock.json`
- **Actions**: 
  - Runs `npm audit` for security vulnerability checks
  - Analyzes package compatibility with React 19 and Next.js 15
  - Provides update recommendations and breaking change alerts
- **Settings**: 1-second debounce, background execution, notifications enabled

#### 4. Accessibility Checker
- **File**: `.kiro/hooks/accessibility-checker.json`
- **Triggers**: On save of component files in `components/` and `app/`
- **Actions**: 
  - Ensures WCAG 2.1 AA compliance
  - Validates keyboard navigation and screen reader support
  - Checks Radix UI integration for accessibility features
  - Reviews broker-specific accessibility (financial data tables, trust scores)
- **Settings**: 2-second debounce, background execution, notifications disabled

#### 5. Type Safety Enforcer
- **File**: `.kiro/hooks/type-safety-enforcer.json`
- **Triggers**: On save of `.ts`, `.tsx` files
- **Actions**: 
  - Enforces strict TypeScript compliance
  - Eliminates 'any' types and improves type definitions
  - Ensures proper component prop interfaces
  - Validates broker platform-specific type structures
- **Settings**: 1.5-second debounce, background execution, notifications disabled

### Manual Hooks (User-Triggered)

#### 6. Component Generator
- **File**: `.kiro/hooks/component-generator.json`
- **Trigger**: Manual activation via "Generate Component" button
- **Features**: 
  - Interactive component creation with TypeScript interfaces
  - Follows project structure patterns and Tailwind CSS styling
  - Supports Radix UI primitives integration
  - Uses proper import paths with `@/` alias
- **Inputs**: Component name, type, features, and folder location

#### 7. Performance Analyzer
- **File**: `.kiro/hooks/performance-analyzer.json`
- **Trigger**: Manual activation via "Analyze Performance" button
- **Features**: 
  - Comprehensive bundle size analysis
  - React performance optimization suggestions (memo, useMemo, useCallback)
  - Next.js Server/Client component optimization
  - Tailwind CSS utility class optimization
  - Broker platform-specific performance checks (data fetching, caching)

#### 8. Build Optimizer
- **File**: `.kiro/hooks/build-optimizer.json`
- **Trigger**: Manual activation via "Optimize Build" button
- **Features**: 
  - Production build analysis and optimization
  - Bundle size review and code splitting suggestions
  - Core Web Vitals and SEO metadata verification
  - Security headers and CSP review
  - Broker platform deployment readiness checks

### Key Benefits

- **Broker-Specific**: Hooks include considerations for financial platforms, trust scores, and broker comparisons
- **Tech Stack Aware**: Optimized for Next.js 15, React 19, TypeScript, and Radix UI
- **Performance Focused**: Multiple hooks target different aspects of performance optimization
- **Accessibility First**: Dedicated WCAG compliance checking with screen reader support
- **SEO Optimized**: Automatic SEO review for better search visibility
- **Security Conscious**: Dependency vulnerability scanning and type safety enforcement
- **Development Efficiency**: Automated code quality checks and component generation

**Remember**: These guidelines are mandatory for all development work on the Brokeranalysis Platform. Always prioritize MCP server usage, data migration accuracy, and proper company information implementation.