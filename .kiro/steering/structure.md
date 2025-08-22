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