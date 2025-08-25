-- Enhanced Vector Search Functions for Advanced Filtering and Ranking
-- This migration adds enhanced search functions with better filtering capabilities

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS search_documents_enhanced(vector(1536), float, int, boolean);
DROP FUNCTION IF EXISTS search_brokers_enhanced(vector(1536), float, int, boolean);

-- Create enhanced document search function with metadata support
CREATE OR REPLACE FUNCTION search_documents_enhanced(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.6,
    match_count int DEFAULT 10,
    include_metadata boolean DEFAULT false
)
RETURNS TABLE (
    id uuid,
    title text,
    content text,
    url text,
    category text,
    author text,
    source_type text,
    broker_id uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    similarity float,
    chunk_index int,
    parent_document_id uuid,
    metadata jsonb
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        d.id,
        d.title,
        d.content,
        d.url,
        d.category,
        d.author,
        d.source_type,
        d.broker_id,
        d.created_at,
        d.updated_at,
        1 - (d.embedding <=> query_embedding) AS similarity,
        d.chunk_index,
        d.parent_document_id,
        CASE 
            WHEN include_metadata THEN d.metadata 
            ELSE NULL 
        END as metadata
    FROM documents d
    WHERE d.embedding IS NOT NULL
        AND 1 - (d.embedding <=> query_embedding) > match_threshold
    ORDER BY d.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Create enhanced broker search function with metadata support
CREATE OR REPLACE FUNCTION search_brokers_enhanced(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.5,
    match_count int DEFAULT 10,
    include_metadata boolean DEFAULT false
)
RETURNS TABLE (
    id uuid,
    name text,
    slug text,
    description text,
    logo_url text,
    overall_rating numeric,
    trust_score numeric,
    regulation_info jsonb,
    trading_platforms text[],
    instruments_offered text[],
    pros text[],
    cons text[],
    best_for text[],
    minimum_deposit numeric,
    country text,
    regulatory_status text,
    similarity float,
    metadata jsonb
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        b.id,
        b.name,
        b.slug,
        b.description,
        b.logo_url,
        b.overall_rating,
        b.trust_score,
        b.regulation_info,
        b.trading_platforms,
        b.instruments_offered,
        b.pros,
        b.cons,
        b.best_for,
        b.minimum_deposit,
        b.country,
        b.regulatory_status,
        1 - (b.embedding <=> query_embedding) AS similarity,
        CASE 
            WHEN include_metadata THEN jsonb_build_object(
                'created_at', b.created_at,
                'updated_at', b.updated_at,
                'verification_status', b.verification_status,
                'last_updated', b.last_updated
            )
            ELSE NULL 
        END as metadata
    FROM brokers b
    WHERE b.embedding IS NOT NULL
        AND 1 - (b.embedding <=> query_embedding) > match_threshold
    ORDER BY b.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Create function for hybrid search with content type filtering
CREATE OR REPLACE FUNCTION search_all_content_enhanced(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.6,
    match_count int DEFAULT 10,
    content_types text[] DEFAULT ARRAY['document', 'broker']
)
RETURNS TABLE (
    id uuid,
    title text,
    content text,
    content_type text,
    url text,
    similarity float,
    metadata jsonb
)
LANGUAGE sql
STABLE
AS $$
    (
        SELECT 
            d.id,
            d.title,
            d.content,
            'document' as content_type,
            d.url,
            1 - (d.embedding <=> query_embedding) AS similarity,
            jsonb_build_object(
                'category', d.category,
                'author', d.author,
                'source_type', d.source_type,
                'broker_id', d.broker_id,
                'created_at', d.created_at
            ) as metadata
        FROM documents d
        WHERE d.embedding IS NOT NULL
            AND 1 - (d.embedding <=> query_embedding) > match_threshold
            AND 'document' = ANY(content_types)
    )
    UNION ALL
    (
        SELECT 
            b.id,
            b.name as title,
            b.description as content,
            'broker' as content_type,
            '/brokers/' || b.slug as url,
            1 - (b.embedding <=> query_embedding) AS similarity,
            jsonb_build_object(
                'trust_score', b.trust_score,
                'overall_rating', b.overall_rating,
                'country', b.country,
                'regulatory_status', b.regulatory_status,
                'minimum_deposit', b.minimum_deposit
            ) as metadata
        FROM brokers b
        WHERE b.embedding IS NOT NULL
            AND 1 - (b.embedding <=> query_embedding) > match_threshold
            AND 'broker' = ANY(content_types)
    )
    ORDER BY similarity DESC
    LIMIT match_count;
$$;

-- Create function for semantic search with date range filtering
CREATE OR REPLACE FUNCTION search_documents_by_date_range(
    query_embedding vector(1536),
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    match_threshold float DEFAULT 0.6,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id uuid,
    title text,
    content text,
    url text,
    category text,
    author text,
    created_at timestamp with time zone,
    similarity float,
    days_old int
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        d.id,
        d.title,
        d.content,
        d.url,
        d.category,
        d.author,
        d.created_at,
        1 - (d.embedding <=> query_embedding) AS similarity,
        EXTRACT(DAY FROM NOW() - d.created_at)::int as days_old
    FROM documents d
    WHERE d.embedding IS NOT NULL
        AND 1 - (d.embedding <=> query_embedding) > match_threshold
        AND d.created_at >= start_date
        AND d.created_at <= end_date
    ORDER BY d.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Create function for broker search with trust score filtering
CREATE OR REPLACE FUNCTION search_brokers_by_trust_score(
    query_embedding vector(1536),
    min_trust_score numeric DEFAULT 0,
    match_threshold float DEFAULT 0.5,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id uuid,
    name text,
    slug text,
    description text,
    trust_score numeric,
    overall_rating numeric,
    country text,
    regulatory_status text,
    similarity float,
    trust_category text
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        b.id,
        b.name,
        b.slug,
        b.description,
        b.trust_score,
        b.overall_rating,
        b.country,
        b.regulatory_status,
        1 - (b.embedding <=> query_embedding) AS similarity,
        CASE 
            WHEN b.trust_score >= 80 THEN 'excellent'
            WHEN b.trust_score >= 60 THEN 'good'
            WHEN b.trust_score >= 40 THEN 'fair'
            ELSE 'poor'
        END as trust_category
    FROM brokers b
    WHERE b.embedding IS NOT NULL
        AND 1 - (b.embedding <=> query_embedding) > match_threshold
        AND (b.trust_score IS NULL OR b.trust_score >= min_trust_score)
    ORDER BY b.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Add indexes for improved performance on new filtering columns
CREATE INDEX IF NOT EXISTS idx_documents_source_type_created ON documents(source_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_broker_category ON documents(broker_id, category);
CREATE INDEX IF NOT EXISTS idx_brokers_trust_score ON brokers(trust_score DESC) WHERE trust_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_brokers_country_rating ON brokers(country, overall_rating DESC);
CREATE INDEX IF NOT EXISTS idx_brokers_regulatory_status ON brokers(regulatory_status) WHERE regulatory_status IS NOT NULL;

-- Create composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_documents_composite_search ON documents(source_type, category, created_at DESC) 
WHERE embedding IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_brokers_composite_search ON brokers(country, trust_score DESC, overall_rating DESC) 
WHERE embedding IS NOT NULL;

-- Create search analytics table for performance monitoring
CREATE TABLE IF NOT EXISTS search_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    intent TEXT,
    search_time_ms INTEGER,
    results_count INTEGER,
    cache_hit BOOLEAN DEFAULT false,
    filters_applied TEXT[],
    user_context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation TEXT NOT NULL,
    duration_ms INTEGER NOT NULL,
    success BOOLEAN NOT NULL,
    error_type TEXT,
    error_message TEXT,
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quality metrics table
CREATE TABLE IF NOT EXISTS quality_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id TEXT NOT NULL,
    query TEXT NOT NULL,
    intent TEXT,
    quality_score NUMERIC(3,2),
    confidence_score NUMERIC(3,2),
    user_feedback TEXT CHECK (user_feedback IN ('positive', 'negative', 'neutral')),
    issues TEXT[],
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create error events table
CREATE TABLE IF NOT EXISTS error_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation TEXT NOT NULL,
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_context JSONB,
    request_data JSONB,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_search_analytics_created_at ON search_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_analytics_intent ON search_analytics(intent);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics(query);
CREATE INDEX IF NOT EXISTS idx_search_analytics_cache_hit ON search_analytics(cache_hit);

-- Create indexes for performance metrics
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_operation ON performance_metrics(operation);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_success ON performance_metrics(success);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_duration ON performance_metrics(duration_ms DESC);

-- Create indexes for quality metrics
CREATE INDEX IF NOT EXISTS idx_quality_metrics_timestamp ON quality_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_quality_metrics_intent ON quality_metrics(intent);
CREATE INDEX IF NOT EXISTS idx_quality_metrics_quality_score ON quality_metrics(quality_score);
CREATE INDEX IF NOT EXISTS idx_quality_metrics_user_feedback ON quality_metrics(user_feedback);

-- Create indexes for error events
CREATE INDEX IF NOT EXISTS idx_error_events_timestamp ON error_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_error_events_operation ON error_events(operation);
CREATE INDEX IF NOT EXISTS idx_error_events_severity ON error_events(severity);
CREATE INDEX IF NOT EXISTS idx_error_events_error_type ON error_events(error_type);

-- Add comments for documentation
COMMENT ON FUNCTION search_documents_enhanced IS 'Enhanced document search with metadata support and advanced filtering capabilities';
COMMENT ON FUNCTION search_brokers_enhanced IS 'Enhanced broker search with metadata support and trust score filtering';
COMMENT ON FUNCTION search_all_content_enhanced IS 'Hybrid search across documents and brokers with content type filtering';
COMMENT ON FUNCTION search_documents_by_date_range IS 'Document search with date range filtering for time-sensitive queries';
COMMENT ON FUNCTION search_brokers_by_trust_score IS 'Broker search with trust score filtering and categorization';
COMMENT ON TABLE search_analytics IS 'Analytics table for tracking search performance and user query patterns';
