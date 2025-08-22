-- RAG System Database Schema Extension
-- This migration adds the necessary tables and functions for the RAG system

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table for RAG content
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    url TEXT,
    category TEXT,
    author TEXT,
    broker_id UUID REFERENCES brokers(id),
    source_type TEXT CHECK (source_type IN ('article', 'review', 'guide', 'news', 'analysis')),
    chunk_index INTEGER DEFAULT 0,
    parent_document_id UUID REFERENCES documents(id),
    embedding vector(1536), -- OpenAI text-embedding-3-small dimensions
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create canonical_brokers table for broker mapping
CREATE TABLE IF NOT EXISTS canonical_brokers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_name TEXT NOT NULL UNIQUE,
    aliases TEXT[] DEFAULT '{}',
    broker_id UUID REFERENCES brokers(id),
    confidence_score DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create programmatic_pages table for SEO pages
CREATE TABLE IF NOT EXISTS programmatic_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_type TEXT NOT NULL CHECK (page_type IN ('broker_review', 'comparison', 'category', 'location')),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    meta_description TEXT,
    content_template TEXT,
    broker_ids UUID[] DEFAULT '{}',
    category TEXT,
    location TEXT,
    embedding vector(1536),
    seo_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_usage_logs table for analytics
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id TEXT,
    user_message TEXT NOT NULL,
    ai_response TEXT,
    documents_used UUID[] DEFAULT '{}',
    response_time_ms INTEGER,
    model_used TEXT,
    request_type TEXT CHECK (request_type IN ('chat', 'recommendation', 'search')),
    user_id UUID, -- For future user tracking
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add embedding column to existing brokers table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'brokers' AND column_name = 'embedding') THEN
        ALTER TABLE brokers ADD COLUMN embedding vector(1536);
    END IF;
END $$;

-- Add embedding column to existing articles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'articles' AND column_name = 'embedding') THEN
        ALTER TABLE articles ADD COLUMN embedding vector(1536);
    END IF;
END $$;

-- Create indexes for vector similarity search (HNSW for fast approximate search)
CREATE INDEX IF NOT EXISTS documents_embedding_idx ON documents 
USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS brokers_embedding_idx ON brokers 
USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS articles_embedding_idx ON articles 
USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS programmatic_pages_embedding_idx ON programmatic_pages 
USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

-- Create regular indexes for filtering
CREATE INDEX IF NOT EXISTS documents_category_idx ON documents(category);
CREATE INDEX IF NOT EXISTS documents_author_idx ON documents(author);
CREATE INDEX IF NOT EXISTS documents_broker_id_idx ON documents(broker_id);
CREATE INDEX IF NOT EXISTS documents_source_type_idx ON documents(source_type);
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at);

CREATE INDEX IF NOT EXISTS ai_usage_logs_conversation_id_idx ON ai_usage_logs(conversation_id);
CREATE INDEX IF NOT EXISTS ai_usage_logs_request_type_idx ON ai_usage_logs(request_type);
CREATE INDEX IF NOT EXISTS ai_usage_logs_created_at_idx ON ai_usage_logs(created_at);

CREATE INDEX IF NOT EXISTS programmatic_pages_page_type_idx ON programmatic_pages(page_type);
CREATE INDEX IF NOT EXISTS programmatic_pages_slug_idx ON programmatic_pages(slug);

-- Create function for document similarity search
CREATE OR REPLACE FUNCTION search_documents(
    query_embedding vector(1536),
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
    similarity float
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
        1 - (d.embedding <=> query_embedding) AS similarity
    FROM documents d
    WHERE d.embedding IS NOT NULL
        AND 1 - (d.embedding <=> query_embedding) > match_threshold
    ORDER BY d.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Create function for broker similarity search
CREATE OR REPLACE FUNCTION search_brokers(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.5,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id uuid,
    name text,
    slug text,
    description text,
    logo_url text,
    overall_rating decimal,
    trust_score decimal,
    regulation_info jsonb,
    trading_platforms text[],
    instruments_offered text[],
    pros text[],
    cons text[],
    best_for text[],
    minimum_deposit decimal,
    similarity float
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
        1 - (b.embedding <=> query_embedding) AS similarity
    FROM brokers b
    WHERE b.embedding IS NOT NULL
        AND 1 - (b.embedding <=> query_embedding) > match_threshold
    ORDER BY b.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Create function for hybrid search (documents + brokers)
CREATE OR REPLACE FUNCTION search_all_content(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.6,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id uuid,
    title text,
    content text,
    content_type text,
    url text,
    similarity float
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
            1 - (d.embedding <=> query_embedding) AS similarity
        FROM documents d
        WHERE d.embedding IS NOT NULL
            AND 1 - (d.embedding <=> query_embedding) > match_threshold
    )
    UNION ALL
    (
        SELECT 
            b.id,
            b.name as title,
            b.description as content,
            'broker' as content_type,
            '/brokers/' || b.slug as url,
            1 - (b.embedding <=> query_embedding) AS similarity
        FROM brokers b
        WHERE b.embedding IS NOT NULL
            AND 1 - (b.embedding <=> query_embedding) > match_threshold
    )
    ORDER BY similarity DESC
    LIMIT match_count;
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_canonical_brokers_updated_at BEFORE UPDATE ON canonical_brokers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programmatic_pages_updated_at BEFORE UPDATE ON programmatic_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies (Row Level Security)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE canonical_brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmatic_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to documents and brokers
CREATE POLICY "Public read access for documents" ON documents
    FOR SELECT USING (true);

CREATE POLICY "Public read access for canonical_brokers" ON canonical_brokers
    FOR SELECT USING (true);

CREATE POLICY "Public read access for programmatic_pages" ON programmatic_pages
    FOR SELECT USING (true);

-- Restrict ai_usage_logs to service role only
CREATE POLICY "Service role access for ai_usage_logs" ON ai_usage_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON documents TO anon, authenticated;
GRANT SELECT ON canonical_brokers TO anon, authenticated;
GRANT SELECT ON programmatic_pages TO anon, authenticated;
GRANT INSERT ON ai_usage_logs TO anon, authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION search_documents TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_brokers TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_all_content TO anon, authenticated;

COMMIT;