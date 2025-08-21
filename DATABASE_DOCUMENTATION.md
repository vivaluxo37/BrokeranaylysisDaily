# Broker Analysis Database Documentation

## Overview

This document provides comprehensive documentation for the Broker Analysis database schema, migration process, and functionality. The database is built on Supabase (PostgreSQL) and contains 10 main tables for managing forex trading content, broker information, market data, and user interactions.

## Database Schema

### 1. Articles Table
**Purpose**: Store forex trading articles and educational content

```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  author_id UUID REFERENCES authors(id),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  meta_description TEXT,
  meta_keywords TEXT,
  featured_image_url TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  tags TEXT[],
  language VARCHAR(10) DEFAULT 'en'
);
```

**Indexes**:
- Full-text search indexes on title, content, excerpt, meta_description
- Performance indexes on author_id, category, published_at, status, slug, tags

### 2. Brokers Table
**Purpose**: Store forex broker information and reviews

```sql
CREATE TABLE brokers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  full_review TEXT,
  overall_rating DECIMAL(3,2),
  trust_score DECIMAL(3,2),
  regulation_info JSONB,
  trading_platforms TEXT[],
  account_types JSONB,
  minimum_deposit DECIMAL(15,2),
  maximum_leverage INTEGER,
  spreads_info JSONB,
  deposit_methods TEXT[],
  withdrawal_methods TEXT[],
  customer_support JSONB,
  pros TEXT[],
  cons TEXT[],
  founded_year INTEGER,
  headquarters VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes**:
- Full-text search indexes on name, description, full_review
- Performance indexes on overall_rating, is_featured, slug

### 3. Authors Table
**Purpose**: Store author information for articles

```sql
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB,
  expertise_areas TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Categories Table
**Purpose**: Hierarchical categorization system

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. Currencies Table
**Purpose**: Store currency information

```sql
CREATE TABLE currencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(3) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10),
  country VARCHAR(100),
  is_major BOOLEAN DEFAULT false,
  is_crypto BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. Currency Pairs Table
**Purpose**: Store forex currency pair data and rates

```sql
CREATE TABLE currency_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency VARCHAR(3) NOT NULL,
  quote_currency VARCHAR(3) NOT NULL,
  pair_name VARCHAR(10) NOT NULL,
  current_rate DECIMAL(15,8),
  bid_price DECIMAL(15,8),
  ask_price DECIMAL(15,8),
  spread DECIMAL(15,8),
  daily_high DECIMAL(15,8),
  daily_low DECIMAL(15,8),
  daily_change DECIMAL(15,8),
  daily_change_percent DECIMAL(8,4),
  is_major_pair BOOLEAN DEFAULT false,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(base_currency, quote_currency)
);
```

### 7. Commodities Table
**Purpose**: Store commodity trading information

```sql
CREATE TABLE commodities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(10) UNIQUE NOT NULL,
  category VARCHAR(100),
  unit VARCHAR(50),
  current_price DECIMAL(15,4),
  daily_change DECIMAL(15,4),
  daily_change_percent DECIMAL(8,4),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 8. Market Signals Table
**Purpose**: Store trading signals and recommendations

```sql
CREATE TABLE market_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument VARCHAR(20) NOT NULL,
  signal_type VARCHAR(20) NOT NULL,
  entry_price DECIMAL(15,8),
  stop_loss DECIMAL(15,8),
  take_profit DECIMAL(15,8),
  confidence_level VARCHAR(20),
  analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'active'
);
```

### 9. Economic Events Table
**Purpose**: Store economic calendar events

```sql
CREATE TABLE economic_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  currency VARCHAR(3),
  impact_level VARCHAR(20),
  event_time TIMESTAMPTZ NOT NULL,
  actual_value VARCHAR(100),
  forecast_value VARCHAR(100),
  previous_value VARCHAR(100),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 10. User Interactions Table
**Purpose**: Track user engagement and analytics

```sql
CREATE TABLE user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  content_type VARCHAR(50),
  content_id UUID,
  action VARCHAR(50),
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with the following policies:

1. **Public Read Access**: Articles, brokers, currencies, currency_pairs, authors, commodities, market_signals, economic_events, categories
2. **User Interactions**: 
   - Allow inserts for all users
   - Users can read their own interactions based on session_id

### Real-time Subscriptions
Enabled for:
- currency_pairs (live rate updates)
- market_signals (new trading signals)
- economic_events (upcoming events)
- articles (new content)
- brokers (broker updates)

## Search Functionality

### Full-text Search
- **Articles**: Search across title, content, excerpt, meta_description
- **Brokers**: Search across name, description, full_review

### Search Functions
```sql
-- Search articles
SELECT * FROM search_articles('forex trading');

-- Search brokers
SELECT * FROM search_brokers('trading platform');
```

## Real-time Views

### Live Currency Rates
```sql
SELECT * FROM live_currency_rates;
```

### Active Market Signals
```sql
SELECT * FROM active_market_signals;
```

### Upcoming Economic Events
```sql
SELECT * FROM upcoming_economic_events;
```

### Market Summary
```sql
SELECT get_market_summary();
```

## Migration Process

### Data Sources
Migrated from Daily Forex scraped data including:
- 1,000+ articles
- 50+ broker reviews
- 10+ authors
- Currency and commodity data
- Economic events
- Market signals
- User interaction data

### Migration Scripts
1. **create_supabase_tables.py**: Creates all database tables and indexes
2. **migrate_to_supabase.py**: Migrates articles, brokers, and authors
3. **migrate_additional_tables.py**: Migrates remaining data (currencies, commodities, etc.)

### Data Validation
All migrations include:
- Data type validation
- Foreign key constraint checking
- Duplicate prevention
- Error handling and logging

## Performance Optimization

### Indexes
- **B-tree indexes**: For exact matches and range queries
- **GIN indexes**: For full-text search and array operations
- **Unique indexes**: For data integrity

### Query Optimization
- Proper use of indexes for frequent queries
- Efficient joins between related tables
- Optimized search functions with ranking

## Database Statistics

Final record counts after migration:
- **Articles**: 1,000 records
- **Brokers**: 50 records
- **Authors**: 10 records
- **Categories**: 20 records
- **Currencies**: 30 records
- **Currency Pairs**: 7 records
- **Commodities**: 20 records
- **Economic Events**: 40 records
- **Market Signals**: 10 records
- **User Interactions**: 50 records

## API Integration

The database is ready for integration with:
- Supabase JavaScript/TypeScript client
- REST API endpoints
- GraphQL queries
- Real-time subscriptions

## Maintenance

### Regular Tasks
1. Update currency rates (real-time or scheduled)
2. Archive expired market signals
3. Clean up old user interactions
4. Monitor database performance
5. Update economic events calendar

### Backup Strategy
- Automated daily backups via Supabase
- Point-in-time recovery available
- Export capabilities for data portability

## Contact Information

**Broker Analysis**
30 N Gould St Ste R
Sheridan, WY 82801, US
EIN: 384298140
Phone: (801)-893-2577

---

*This documentation was generated as part of the database migration from Daily Forex to Broker Analysis platform.*