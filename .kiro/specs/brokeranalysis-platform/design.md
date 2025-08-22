# Design Document

## Overview

The Brokeranalysis Platform design builds upon the existing Next.js foundation and Supabase infrastructure to create a comprehensive AI-powered broker recommendation system. The architecture leverages the current 2GB+ database, multiple AI API integrations, and modern UI components to deliver a scalable, performant platform with RAG capabilities, real-time data processing, and programmatic SEO.

## Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js 15 App Router]
        B[React 19 Components]
        C[Tailwind CSS + Radix UI]
        D[Real-time Subscriptions]
    end
    
    subgraph "API Layer"
        E[/api/recommend - Broker Matching]
        F[/api/ask - RAG Chat]
        G[/api/search - Vector Search]
        H[/api/market - Real-time Data]
        I[/api/sitemap - SEO]
    end
    
    subgraph "AI Services Layer"
        J[Groq API - Primary]
        K[OpenRouter API - Fallback]
        L[Sentence Transformers - Embeddings]
        M[Model Router - 15+ Models]
    end
    
    subgraph "Data Layer"
        N[Supabase PostgreSQL]
        O[pgvector Extension]
        P[Real-time Subscriptions]
        Q[Row Level Security]
    end
    
    subgraph "Background Services"
        R[Embedding Pipeline]
        S[Market Data Sync]
        T[Trust Score Calculator]
        U[Programmatic Page Generator]
    end
    
    A --> E
    A --> F
    A --> G
    A --> H
    E --> J
    F --> J
    J --> K
    E --> N
    F --> O
    G --> O
    H --> P
    R --> O
    S --> N
    T --> N
    U --> N
```

### Technology Stack

**Frontend:**
- Next.js 15.4.7 with App Router and React 19
- TypeScript for type safety
- Tailwind CSS with custom design system
- Radix UI primitives for accessible components
- Lucide React icons
- Real-time subscriptions via Supabase client

**Backend:**
- Next.js API routes for serverless functions
- Supabase PostgreSQL with pgvector extension
- Row Level Security (RLS) for data protection
- Real-time subscriptions for live data

**AI/ML:**
- Primary: Groq API (deepseek-r1, qwen3-32b, gemma2-9b-it)
- Fallback: OpenRouter API (horizon-beta, glm4.5-air, kimi-k2, etc.)
- Embeddings: sentence-transformers (all-MiniLM-L6-v2)
- Vector similarity search with HNSW/IVFFlat indexes

**Infrastructure:**
- Vercel for deployment and edge functions
- Supabase for database and real-time features
- Environment-based configuration management

## Components and Interfaces

### Core Components

#### 1. AI Recommender System
```typescript
interface RecommenderInput {
  strategy: TradingStrategy;
  capital: number;
  country: string;
  instruments: string[];
  latency_requirements?: 'low' | 'medium' | 'high';
}

interface RecommenderOutput {
  brokers: BrokerRecommendation[];
  reasoning: string;
  confidence: number;
  evidence_sources: EvidenceChunk[];
}

interface BrokerRecommendation {
  broker_slug: string;
  name: string;
  trust_score: number;
  match_score: number;
  one_liner: string;
  metrics: BrokerMetrics;
  evidence: EvidenceChunk[];
}
```

#### 2. RAG Chat System
```typescript
interface ChatRequest {
  user_prompt: string;
  context?: UserContext;
  top_k?: number;
  model_preference?: string;
}

interface ChatResponse {
  answer_html: string;
  sources: EvidenceSource[];
  tokens_used: number;
  model_used: string;
  confidence: number;
}

interface EvidenceChunk {
  chunk_id: string;
  content: string;
  source_url: string;
  broker_name?: string;
  publication_date: string;
  relevance_score: number;
}
```

#### 3. Vector Search Engine
```typescript
interface VectorSearchRequest {
  query: string;
  filters?: {
    broker_ids?: string[];
    content_types?: string[];
    date_range?: DateRange;
  };
  top_k: number;
}

interface VectorSearchResult {
  chunks: EvidenceChunk[];
  total_results: number;
  search_time_ms: number;
}
```

#### 4. Real-time Market Data
```typescript
interface MarketDataSubscription {
  currency_pairs: CurrencyPair[];
  market_signals: MarketSignal[];
  economic_events: EconomicEvent[];
  broker_alerts: BrokerAlert[];
}

interface CurrencyPair {
  pair_name: string;
  current_rate: number;
  bid_price: number;
  ask_price: number;
  daily_change_percent: number;
  last_updated: Date;
}
```

### UI Component Architecture

#### 1. Homepage Components (Existing + Enhanced)
- **HeroSection**: Enhanced with real-time broker count and trust score stats
- **AIRecommenderWidget**: Connected to /api/recommend endpoint
- **TopBrokersGrid**: Dynamic data from brokers table with real-time trust scores
- **AIAssistantPreview**: Connected to /api/ask endpoint
- **BlogInsights**: Dynamic content from articles table
- **ProgrammaticCards**: Generated from programmatic_pages table

#### 2. New Core Components
- **VectorSearchInterface**: Advanced search with filters and suggestions
- **BrokerComparisonTool**: Side-by-side broker analysis
- **TrustScoreBreakdown**: Interactive trust score visualization
- **MarketDataDashboard**: Real-time market information
- **EvidenceModal**: Source citations and supporting documentation

## Data Models

### Extended Database Schema

#### 1. New RAG Tables
```sql
-- Documents table for RAG functionality
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID REFERENCES brokers(id),
  article_id UUID REFERENCES articles(id),
  title TEXT,
  source_url TEXT,
  content_chunk TEXT NOT NULL,
  chunk_index INTEGER,
  metadata JSONB,
  embedding VECTOR(384), -- sentence-transformers dimension
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Canonical broker names for fuzzy matching
CREATE TABLE canonical_brokers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name TEXT UNIQUE NOT NULL,
  canonical_slug TEXT UNIQUE NOT NULL,
  aliases JSONB, -- Array of alternative names
  broker_id UUID REFERENCES brokers(id),
  confidence_score DECIMAL(3,2)
);

-- Programmatic SEO pages
CREATE TABLE programmatic_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  intro_content TEXT,
  faq_content JSONB,
  target_keywords TEXT[],
  strategy VARCHAR(50),
  country VARCHAR(3),
  status VARCHAR(20) DEFAULT 'draft',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed TIMESTAMPTZ
);

-- AI model usage tracking
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint VARCHAR(50),
  model_used VARCHAR(100),
  tokens_input INTEGER,
  tokens_output INTEGER,
  response_time_ms INTEGER,
  user_session VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. Enhanced Existing Tables
```sql
-- Add vector search capabilities to existing tables
ALTER TABLE brokers ADD COLUMN embedding VECTOR(384);
ALTER TABLE articles ADD COLUMN embedding VECTOR(384);

-- Add trust score components
ALTER TABLE brokers ADD COLUMN trust_score_components JSONB;
ALTER TABLE brokers ADD COLUMN last_trust_score_update TIMESTAMPTZ;

-- Add real-time monitoring
ALTER TABLE brokers ADD COLUMN monitoring_enabled BOOLEAN DEFAULT true;
ALTER TABLE brokers ADD COLUMN last_monitored TIMESTAMPTZ;
```

### Trust Score Calculation Model

```typescript
interface TrustScoreComponents {
  regulation: {
    score: number; // 0-100
    weight: 0.30;
    factors: {
      primary_regulator: string;
      additional_licenses: string[];
      regulatory_history: 'clean' | 'warnings' | 'violations';
    };
  };
  financial_stability: {
    score: number;
    weight: 0.25;
    factors: {
      years_in_business: number;
      capital_adequacy: 'strong' | 'adequate' | 'weak';
      insurance_coverage: number;
    };
  };
  user_feedback: {
    score: number;
    weight: 0.20;
    factors: {
      average_rating: number;
      review_count: number;
      complaint_ratio: number;
    };
  };
  transparency: {
    score: number;
    weight: 0.15;
    factors: {
      fee_disclosure: 'excellent' | 'good' | 'poor';
      terms_clarity: number;
      audit_frequency: 'annual' | 'biannual' | 'none';
    };
  };
  platform_reliability: {
    score: number;
    weight: 0.10;
    factors: {
      uptime_percentage: number;
      execution_speed: number;
      slippage_rate: number;
    };
  };
}
```

## Error Handling

### API Error Handling Strategy

```typescript
interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  request_id: string;
}

// Error hierarchy
enum ErrorCodes {
  // AI Service Errors
  AI_SERVICE_UNAVAILABLE = 'AI_001',
  AI_RATE_LIMIT_EXCEEDED = 'AI_002',
  AI_INVALID_RESPONSE = 'AI_003',
  
  // Database Errors
  DB_CONNECTION_FAILED = 'DB_001',
  DB_QUERY_TIMEOUT = 'DB_002',
  DB_CONSTRAINT_VIOLATION = 'DB_003',
  
  // Vector Search Errors
  VECTOR_INDEX_UNAVAILABLE = 'VS_001',
  EMBEDDING_GENERATION_FAILED = 'VS_002',
  
  // Business Logic Errors
  INSUFFICIENT_DATA = 'BL_001',
  INVALID_COUNTRY_CODE = 'BL_002',
  BROKER_NOT_AVAILABLE = 'BL_003'
}
```

### Fallback Mechanisms

1. **AI Service Fallbacks**:
   - Primary: Groq API models
   - Secondary: OpenRouter API models
   - Tertiary: Cached responses for common queries

2. **Database Fallbacks**:
   - Primary: Real-time Supabase queries
   - Secondary: Cached results from Redis (if implemented)
   - Tertiary: Static fallback data

3. **Search Fallbacks**:
   - Primary: Vector similarity search
   - Secondary: Full-text search on existing indexes
   - Tertiary: Simple keyword matching

## Testing Strategy

### Unit Testing
- **Components**: React Testing Library for UI components
- **API Routes**: Jest for API endpoint testing
- **Utilities**: Jest for helper functions and calculations
- **AI Integration**: Mock AI responses for consistent testing

### Integration Testing
- **Database Operations**: Test Supabase queries and real-time subscriptions
- **AI Pipeline**: End-to-end testing of RAG workflow
- **Vector Search**: Test embedding generation and similarity search
- **Trust Score Calculation**: Validate scoring algorithm accuracy

### Performance Testing
- **API Response Times**: Target <500ms for recommendations
- **Vector Search Performance**: Target <100ms for similarity queries
- **Database Query Optimization**: Monitor slow query log
- **Real-time Subscription Load**: Test concurrent user limits

### E2E Testing
- **User Journeys**: Complete recommendation flow testing
- **Cross-browser Compatibility**: Chrome, Firefox, Safari, Edge
- **Mobile Responsiveness**: iOS Safari, Chrome Mobile
- **Accessibility**: WCAG 2.1 AA compliance testing

## Security Considerations

### Data Protection
- **Row Level Security**: Implemented on all Supabase tables
- **API Authentication**: JWT tokens for protected endpoints
- **Rate Limiting**: Prevent abuse of AI and search endpoints
- **Input Sanitization**: Validate all user inputs and prompts

### AI Security
- **Prompt Injection Prevention**: Sanitize user prompts before AI processing
- **Response Filtering**: Validate AI responses for inappropriate content
- **Model Access Control**: Secure API keys and rotate regularly
- **Usage Monitoring**: Track and alert on unusual AI usage patterns

### Infrastructure Security
- **Environment Variables**: Secure storage of API keys and secrets
- **HTTPS Enforcement**: All communications encrypted in transit
- **CORS Configuration**: Restrict cross-origin requests appropriately
- **Audit Logging**: Track all administrative actions and data changes

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: Next.js Image component with WebP support
- **Caching Strategy**: Static generation for programmatic pages
- **Bundle Analysis**: Monitor and optimize JavaScript bundle size

### Backend Optimization
- **Database Indexing**: Optimize queries with appropriate indexes
- **Connection Pooling**: Efficient database connection management
- **Caching Layer**: Redis for frequently accessed data
- **CDN Integration**: Static asset delivery optimization

### AI Service Optimization
- **Model Selection**: Route queries to most appropriate models
- **Batch Processing**: Group similar requests for efficiency
- **Response Caching**: Cache common AI responses
- **Token Optimization**: Minimize token usage while maintaining quality

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with Supabase local instance
- **Staging**: Vercel preview deployments with staging database
- **Production**: Vercel production with production Supabase instance

### CI/CD Pipeline
1. **Code Quality**: ESLint, TypeScript checking, Prettier
2. **Testing**: Unit tests, integration tests, E2E tests
3. **Build**: Next.js production build with optimization
4. **Deploy**: Automatic deployment to Vercel on main branch merge
5. **Monitoring**: Post-deployment health checks and monitoring

### Monitoring and Observability
- **Application Monitoring**: Vercel Analytics and error tracking
- **Database Monitoring**: Supabase dashboard and query performance
- **AI Usage Tracking**: Custom logging for AI service usage and costs
- **User Analytics**: Privacy-compliant user behavior tracking