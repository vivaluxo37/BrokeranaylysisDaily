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