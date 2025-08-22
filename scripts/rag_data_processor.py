#!/usr/bin/env python3
"""
RAG Data Processing Pipeline
Extracts, chunks, and embeds broker documentation for the RAG system.

This script processes articles, reviews, and broker data to create embeddings
for vector similarity search in the RAG system.
"""

import os
import sys
import json
import asyncio
import logging
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import re
import hashlib
from dataclasses import dataclass

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import openai
from supabase import create_client, Client
from sentence_transformers import SentenceTransformer
import tiktoken
from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin, urlparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('rag_processing.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class DocumentChunk:
    """Represents a document chunk for embedding."""
    title: str
    content: str
    url: Optional[str]
    category: str
    author: Optional[str]
    broker_id: Optional[str]
    source_type: str
    chunk_index: int
    parent_document_id: Optional[str]
    metadata: Dict[str, Any]

class RAGDataProcessor:
    """Processes and embeds data for the RAG system."""
    
    def __init__(self):
        # Initialize Supabase client
        self.supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Missing Supabase credentials")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        
        # Initialize OpenAI for embeddings
        openai.api_key = os.getenv('OPENAI_API_KEY')
        if not openai.api_key:
            raise ValueError("Missing OpenAI API key")
        
        # Initialize sentence transformer as fallback
        try:
            self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("Loaded sentence-transformers model")
        except Exception as e:
            logger.warning(f"Failed to load sentence-transformers: {e}")
            self.sentence_model = None
        
        # Initialize tokenizer for chunk size calculation
        self.tokenizer = tiktoken.get_encoding("cl100k_base")
        
        # Configuration
        self.max_chunk_tokens = 300
        self.overlap_tokens = 50
        self.batch_size = 100
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in text using tiktoken."""
        return len(self.tokenizer.encode(text))
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text content."""
        if not text:
            return ""
        
        # Remove HTML tags
        soup = BeautifulSoup(text, 'html.parser')
        text = soup.get_text()
        
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text)
        text = text.strip()
        
        # Remove excessive punctuation
        text = re.sub(r'[.]{3,}', '...', text)
        text = re.sub(r'[!]{2,}', '!', text)
        text = re.sub(r'[?]{2,}', '?', text)
        
        return text
    
    def chunk_text(self, text: str, title: str = "") -> List[str]:
        """Split text into chunks of approximately max_chunk_tokens."""
        if not text:
            return []
        
        # Clean the text first
        text = self.clean_text(text)
        
        # If text is short enough, return as single chunk
        if self.count_tokens(text) <= self.max_chunk_tokens:
            return [text]
        
        chunks = []
        sentences = re.split(r'(?<=[.!?])\s+', text)
        
        current_chunk = ""
        current_tokens = 0
        
        # Add title context to first chunk if provided
        if title and title not in text[:100]:
            title_context = f"Title: {title}\n\n"
            current_chunk = title_context
            current_tokens = self.count_tokens(title_context)
        
        for sentence in sentences:
            sentence_tokens = self.count_tokens(sentence)
            
            # If adding this sentence would exceed max tokens, save current chunk
            if current_tokens + sentence_tokens > self.max_chunk_tokens and current_chunk:
                chunks.append(current_chunk.strip())
                
                # Start new chunk with overlap
                overlap_text = self.get_overlap_text(current_chunk, self.overlap_tokens)
                current_chunk = overlap_text + " " + sentence
                current_tokens = self.count_tokens(current_chunk)
            else:
                current_chunk += " " + sentence if current_chunk else sentence
                current_tokens += sentence_tokens
        
        # Add the last chunk if it has content
        if current_chunk.strip():
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def get_overlap_text(self, text: str, max_overlap_tokens: int) -> str:
        """Get the last part of text for overlap, up to max_overlap_tokens."""
        words = text.split()
        overlap_text = ""
        
        for i in range(len(words) - 1, -1, -1):
            candidate = " ".join(words[i:])
            if self.count_tokens(candidate) <= max_overlap_tokens:
                overlap_text = candidate
                break
        
        return overlap_text
    
    async def generate_embedding(self, text: str, use_openai: bool = True) -> List[float]:
        """Generate embedding for text using OpenAI or sentence-transformers."""
        if not text.strip():
            return [0.0] * 1536  # Return zero vector for empty text
        
        try:
            if use_openai:
                # Use OpenAI text-embedding-3-small
                response = await openai.Embedding.acreate(
                    model="text-embedding-3-small",
                    input=text
                )
                return response['data'][0]['embedding']
            else:
                # Fallback to sentence-transformers
                if self.sentence_model:
                    embedding = self.sentence_model.encode(text)
                    # Pad or truncate to 1536 dimensions to match OpenAI
                    if len(embedding) < 1536:
                        embedding = list(embedding) + [0.0] * (1536 - len(embedding))
                    elif len(embedding) > 1536:
                        embedding = embedding[:1536]
                    return embedding.tolist()
                else:
                    raise Exception("No embedding model available")
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            if use_openai and self.sentence_model:
                # Fallback to sentence-transformers
                return await self.generate_embedding(text, use_openai=False)
            else:
                return [0.0] * 1536
    
    async def process_articles(self) -> int:
        """Process articles from the database and create document chunks."""
        logger.info("Processing articles...")
        
        try:
            # Fetch articles from Supabase
            response = self.supabase.table('articles').select('*').execute()
            articles = response.data
            
            logger.info(f"Found {len(articles)} articles to process")
            
            processed_count = 0
            
            for article in articles:
                try:
                    # Create document chunks for each article
                    content = article.get('content', '') or article.get('excerpt', '')
                    title = article.get('title', '')
                    
                    if not content:
                        logger.warning(f"Skipping article {article['id']} - no content")
                        continue
                    
                    chunks = self.chunk_text(content, title)
                    
                    for i, chunk_content in enumerate(chunks):
                        chunk = DocumentChunk(
                            title=title,
                            content=chunk_content,
                            url=f"/articles/{article.get('slug', article['id'])}",
                            category=article.get('category', 'general'),
                            author=article.get('author', ''),
                            broker_id=article.get('broker_id'),
                            source_type='article',
                            chunk_index=i,
                            parent_document_id=article['id'],
                            metadata={
                                'published_at': article.get('published_at'),
                                'tags': article.get('tags', []),
                                'reading_time': article.get('reading_time'),
                                'featured': article.get('featured', False)
                            }
                        )
                        
                        await self.store_document_chunk(chunk)
                    
                    processed_count += 1
                    
                    if processed_count % 10 == 0:
                        logger.info(f"Processed {processed_count} articles")
                        
                except Exception as e:
                    logger.error(f"Error processing article {article.get('id')}: {e}")
                    continue
            
            logger.info(f"Completed processing {processed_count} articles")
            return processed_count
            
        except Exception as e:
            logger.error(f"Error fetching articles: {e}")
            return 0
    
    async def process_brokers(self) -> int:
        """Process broker data and create embeddings."""
        logger.info("Processing brokers...")
        
        try:
            # Fetch brokers from Supabase
            response = self.supabase.table('brokers').select('*').execute()
            brokers = response.data
            
            logger.info(f"Found {len(brokers)} brokers to process")
            
            processed_count = 0
            
            for broker in brokers:
                try:
                    # Create comprehensive broker description for embedding
                    broker_text = self.create_broker_description(broker)
                    
                    if not broker_text:
                        logger.warning(f"Skipping broker {broker['id']} - no content")
                        continue
                    
                    # Generate embedding
                    embedding = await self.generate_embedding(broker_text)
                    
                    # Update broker with embedding
                    self.supabase.table('brokers').update({
                        'embedding': embedding
                    }).eq('id', broker['id']).execute()
                    
                    processed_count += 1
                    
                    if processed_count % 5 == 0:
                        logger.info(f"Processed {processed_count} brokers")
                        
                except Exception as e:
                    logger.error(f"Error processing broker {broker.get('id')}: {e}")
                    continue
            
            logger.info(f"Completed processing {processed_count} brokers")
            return processed_count
            
        except Exception as e:
            logger.error(f"Error fetching brokers: {e}")
            return 0
    
    def create_broker_description(self, broker: Dict[str, Any]) -> str:
        """Create a comprehensive text description of a broker for embedding."""
        parts = []
        
        # Basic info
        if broker.get('name'):
            parts.append(f"Broker: {broker['name']}")
        
        if broker.get('description'):
            parts.append(f"Description: {broker['description']}")
        
        # Regulation and trust
        if broker.get('regulation_info'):
            reg_info = broker['regulation_info']
            if isinstance(reg_info, dict):
                regulators = reg_info.get('regulators', [])
                if regulators:
                    parts.append(f"Regulated by: {', '.join(regulators)}")
        
        if broker.get('trust_score'):
            parts.append(f"Trust Score: {broker['trust_score']}/10")
        
        # Trading features
        if broker.get('trading_platforms'):
            platforms = broker['trading_platforms']
            if isinstance(platforms, list):
                parts.append(f"Trading Platforms: {', '.join(platforms)}")
        
        if broker.get('instruments_offered'):
            instruments = broker['instruments_offered']
            if isinstance(instruments, list):
                parts.append(f"Instruments: {', '.join(instruments)}")
        
        # Pros and cons
        if broker.get('pros'):
            pros = broker['pros']
            if isinstance(pros, list):
                parts.append(f"Pros: {', '.join(pros)}")
        
        if broker.get('cons'):
            cons = broker['cons']
            if isinstance(cons, list):
                parts.append(f"Cons: {', '.join(cons)}")
        
        # Best for
        if broker.get('best_for'):
            best_for = broker['best_for']
            if isinstance(best_for, list):
                parts.append(f"Best for: {', '.join(best_for)}")
        
        # Account details
        if broker.get('minimum_deposit'):
            parts.append(f"Minimum Deposit: ${broker['minimum_deposit']}")
        
        if broker.get('maximum_leverage'):
            parts.append(f"Maximum Leverage: {broker['maximum_leverage']}")
        
        # Spreads and fees
        if broker.get('spreads_info'):
            spreads = broker['spreads_info']
            if isinstance(spreads, dict):
                for pair, spread in spreads.items():
                    parts.append(f"{pair} spread: {spread}")
        
        return ". ".join(parts)
    
    async def store_document_chunk(self, chunk: DocumentChunk):
        """Store a document chunk with its embedding in the database."""
        try:
            # Generate embedding for the chunk
            embedding = await self.generate_embedding(chunk.content)
            
            # Insert into documents table
            self.supabase.table('documents').insert({
                'title': chunk.title,
                'content': chunk.content,
                'url': chunk.url,
                'category': chunk.category,
                'author': chunk.author,
                'broker_id': chunk.broker_id,
                'source_type': chunk.source_type,
                'chunk_index': chunk.chunk_index,
                'parent_document_id': chunk.parent_document_id,
                'embedding': embedding,
                'metadata': chunk.metadata
            }).execute()
            
        except Exception as e:
            logger.error(f"Error storing document chunk: {e}")
            raise
    
    async def create_canonical_broker_mappings(self):
        """Create canonical broker name mappings."""
        logger.info("Creating canonical broker mappings...")
        
        try:
            # Fetch all brokers
            response = self.supabase.table('brokers').select('id, name, slug').execute()
            brokers = response.data
            
            for broker in brokers:
                # Create canonical mapping
                canonical_name = broker['name'].lower().strip()
                aliases = [
                    broker['name'],
                    broker['slug'],
                    canonical_name,
                    broker['name'].replace(' ', ''),
                    broker['name'].replace(' ', '-')
                ]
                
                # Remove duplicates and empty strings
                aliases = list(set([alias for alias in aliases if alias]))
                
                self.supabase.table('canonical_brokers').upsert({
                    'canonical_name': canonical_name,
                    'aliases': aliases,
                    'broker_id': broker['id'],
                    'confidence_score': 1.0
                }).execute()
            
            logger.info(f"Created canonical mappings for {len(brokers)} brokers")
            
        except Exception as e:
            logger.error(f"Error creating canonical broker mappings: {e}")
    
    async def run_full_pipeline(self):
        """Run the complete RAG data processing pipeline."""
        logger.info("Starting RAG data processing pipeline...")
        start_time = datetime.now()
        
        try:
            # Process articles
            articles_processed = await self.process_articles()
            
            # Process brokers
            brokers_processed = await self.process_brokers()
            
            # Create canonical broker mappings
            await self.create_canonical_broker_mappings()
            
            end_time = datetime.now()
            duration = end_time - start_time
            
            logger.info(f"RAG processing pipeline completed in {duration}")
            logger.info(f"Processed {articles_processed} articles and {brokers_processed} brokers")
            
            return {
                'articles_processed': articles_processed,
                'brokers_processed': brokers_processed,
                'duration_seconds': duration.total_seconds()
            }
            
        except Exception as e:
            logger.error(f"Error in RAG processing pipeline: {e}")
            raise

async def main():
    """Main function to run the RAG data processor."""
    try:
        processor = RAGDataProcessor()
        result = await processor.run_full_pipeline()
        print(f"Processing completed: {result}")
    except Exception as e:
        logger.error(f"Failed to run RAG processor: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())