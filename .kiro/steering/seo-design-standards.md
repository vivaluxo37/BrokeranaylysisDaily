# SEO & Design Standards

## Overview
This document ensures all new pages, features, and components follow comprehensive SEO optimization, maintain visual consistency, and are optimized for both search engines and AI crawlers.

## SEO Requirements

### Metadata Standards
Every new page MUST include:

```typescript
// Required metadata structure
export const metadata: Metadata = {
  title: 'Specific Page Title — Brokeranalysis',
  description: 'Compelling 150-160 character description with target keywords',
  keywords: 'primary keyword, secondary keyword, broker comparison, trading platform',
  authors: [{ name: 'Brokeranalysis' }],
  creator: 'Brokeranalysis',
  publisher: 'Brokeranalysis',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brokeranalysis.com/page-url',
    title: 'Page Title — Brokeranalysis',
    description: 'Same as meta description',
    siteName: 'Brokeranalysis',
    images: [{
      url: '/og-images/page-specific-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Descriptive alt text'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page Title — Brokeranalysis',
    description: 'Same as meta description',
    creator: '@brokeranalysis',
    images: ['/og-images/page-specific-image.jpg']
  },
  alternates: {
    canonical: 'https://brokeranalysis.com/page-url'
  }
}
```

### Structured Data Requirements
All pages MUST include relevant JSON-LD structured data:

```typescript
// Financial service pages
const financialServiceSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "Page/Service Name",
  "description": "Service description",
  "url": "https://brokeranalysis.com/page-url",
  "serviceType": "Broker Comparison",
  "areaServed": "Global",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Broker Recommendations",
    "itemListElement": [
      // Broker listings
    ]
  }
}

// FAQ pages
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text with relevant keywords"
      }
    }
  ]
}

// Article/Blog pages
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article title",
  "description": "Article description",
  "author": {
    "@type": "Organization",
    "name": "Brokeranalysis"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Brokeranalysis",
    "logo": {
      "@type": "ImageObject",
      "url": "https://brokeranalysis.com/logo.png"
    }
  },
  "datePublished": "2024-01-01",
  "dateModified": "2024-01-01"
}
```

### URL Structure Standards
- Use kebab-case for all URLs: `/best-forex-brokers-usa`
- Include target keywords in URL path
- Keep URLs under 60 characters when possible
- Use logical hierarchy: `/brokers/[country]/[category]`
- Implement proper canonical URLs for duplicate content

### Content SEO Requirements
1. **Heading Structure**: Proper H1-H6 hierarchy with target keywords
2. **Internal Linking**: Link to relevant broker pages and comparisons
3. **External Linking**: Link to authoritative financial sources
4. **Image Optimization**: Alt text, proper sizing, WebP format
5. **Content Length**: Minimum 800 words for informational pages
6. **Keyword Density**: 1-2% for primary keywords, natural placement

## Design System Standards

### Typography Hierarchy
```css
/* Use these predefined classes for consistent typography */
.text-heading-hero    /* 5xl-7xl, hero sections only */
.text-heading-xl      /* 4xl-6xl, main page titles */
.text-heading-lg      /* 3xl-4xl, section headers */
.text-heading-md      /* 2xl-3xl, subsection headers */
.text-heading-sm      /* xl-2xl, component headers */
.text-body-xl         /* xl, large body text */
.text-body-lg         /* lg, emphasized body text */
.text-body            /* base, standard body text */
.text-body-sm         /* sm, small body text */
```

### Color System
```css
/* Primary brand colors */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
--gradient-accent: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* Trust score colors */
--trust-score-excellent: #10b981; /* 90+ */
--trust-score-good: #3b82f6;      /* 80-89 */
--trust-score-fair: #f59e0b;      /* 70-79 */
--trust-score-poor: #ef4444;      /* <70 */

/* Dark theme colors */
--dark-bg-primary: #0a0a0a;
--dark-bg-secondary: #1a1a1a;
--dark-bg-tertiary: #2a2a2a;
```

### Component Standards

#### Glass Morphism Cards
```tsx
// Use these classes for consistent card styling
<div className="glass-card">           // Basic glass card
<div className="glass-card-hover">     // Interactive glass card
<div className="modern-card">          // Enhanced modern card
<div className="modern-card-hover">    // Interactive modern card
```

#### Button Variants
```tsx
// Primary CTA buttons
<button className="cta-primary">Primary Action</button>

// Secondary buttons
<button className="cta-secondary">Secondary Action</button>

// Glass buttons
<button className="btn-glass">Glass Button</button>

// Gradient buttons
<button className="btn-gradient">Gradient Button</button>
```

#### Trust Score Components
```tsx
// Trust score pills with automatic color coding
<span className={`trust-score-pill ${getTrustScoreClass(score)}`}>
  {score}/100
</span>

// Trust score breakdown component
<TrustScoreBreakdown 
  score={score}
  components={trustScoreComponents}
  showDetails={true}
/>
```

### Animation Standards
```css
/* Use predefined animations for consistency */
.floating-card        /* Hover lift effect */
.pulse-glow          /* Glowing pulse animation */
.orbital-element     /* Floating background elements */
.glass-card-hover    /* Smooth hover transitions */
```

## Technical Implementation Standards

### Component Structure
```tsx
'use client'; // Only when client-side features needed

import React from 'react';
import { cn } from '@/lib/utils';
import { ComponentProps } from '@/lib/types';

interface ComponentNameProps {
  // Explicit TypeScript interfaces
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ComponentName({ 
  title, 
  description, 
  className,
  children,
  ...props 
}: ComponentNameProps) {
  return (
    <div className={cn(
      "base-classes",
      "responsive-classes",
      className
    )} {...props}>
      <h2 className="text-heading-lg text-gradient">
        {title}
      </h2>
      {description && (
        <p className="text-body text-white/80">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
```

### Performance Requirements
1. **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
2. **Image Optimization**: Use Next.js Image component with WebP
3. **Code Splitting**: Dynamic imports for heavy components
4. **Bundle Size**: Monitor and optimize JavaScript bundles
5. **Caching**: Implement proper caching strategies

### Accessibility Standards
1. **WCAG 2.1 AA Compliance**: All components must meet standards
2. **Keyboard Navigation**: Full keyboard accessibility
3. **Screen Reader Support**: Proper ARIA labels and semantic HTML
4. **Color Contrast**: Minimum 4.5:1 ratio for normal text
5. **Focus Management**: Visible focus indicators

## AI & Search Engine Optimization

### AI Crawler Optimization
1. **Structured Content**: Use semantic HTML5 elements
2. **Clear Information Hierarchy**: Logical content organization
3. **Rich Snippets**: Implement relevant schema markup
4. **Content Quality**: High-quality, informative content
5. **Internal Linking**: Strong internal link structure

### Search Engine Features
1. **Featured Snippets**: Structure content for snippet optimization
2. **Local SEO**: Include location-specific content where relevant
3. **Voice Search**: Optimize for conversational queries
4. **Mobile-First**: Ensure mobile optimization
5. **Page Speed**: Optimize for fast loading times

## Content Guidelines

### Broker-Specific Content
1. **Trust Scores**: Always include and explain trust score methodology
2. **Evidence-Based**: Support claims with credible sources
3. **Comparison Tables**: Use structured data for broker comparisons
4. **User Reviews**: Include authentic user feedback when available
5. **Regulatory Information**: Always include regulatory status

### Financial Content Standards
1. **Disclaimers**: Include appropriate risk disclaimers
2. **Accuracy**: Ensure all financial information is current and accurate
3. **Transparency**: Clearly explain methodologies and limitations
4. **Compliance**: Follow financial advertising regulations
5. **Updates**: Regular content updates for accuracy

## Quality Assurance Checklist

### Pre-Launch Checklist
- [ ] Metadata complete and optimized
- [ ] Structured data implemented
- [ ] Internal linking strategy implemented
- [ ] Images optimized with alt text
- [ ] Mobile responsiveness verified
- [ ] Accessibility testing completed
- [ ] Performance metrics meet standards
- [ ] SEO audit passed
- [ ] Content review completed
- [ ] Legal/compliance review (for financial content)

### Post-Launch Monitoring
- [ ] Search Console monitoring setup
- [ ] Analytics tracking implemented
- [ ] Core Web Vitals monitoring
- [ ] User feedback collection
- [ ] Regular content updates scheduled

## Tools and Resources

### SEO Tools
- Google Search Console
- Google PageSpeed Insights
- Lighthouse audits
- Schema markup validators
- Accessibility testing tools

### Design Tools
- Tailwind CSS documentation
- Radix UI component library
- Figma design system (if available)
- Color contrast checkers
- Typography scale generators