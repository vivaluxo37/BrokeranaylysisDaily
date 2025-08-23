#!/usr/bin/env python3
"""
Content Chunking Script for Brokeranalysis Platform
Processes articles and broker reviews into ~300 token segments for RAG system

Author: Brokeranalysis AI System
Date: 2024
"""

import os
import re
import json
import logging
import tiktoken
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from pathlib import Path
import argparse
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('content_chunking.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class ContentChunk:
    """Represents a content chunk with metadata"""
    content: str
    token_count: int
    chunk_index: int
    source_type: str  # 'article' or 'broker_review'
    source_id: str
    title: str
    metadata: Dict
    overlap_tokens: int = 50  # Overlap with previous chunk

class ContentChunker:
    """Handles content chunking for articles and broker reviews"""
    
    def __init__(self, target_tokens: int = 300, overlap_tokens: int = 50):
        self.target_tokens = target_tokens
        self.overlap_tokens = overlap_tokens
        self.encoding = tiktoken.get_encoding("cl100k_base")  # GPT-4 encoding
        self.chunks_processed = 0
        self.total_tokens_processed = 0
        
    def count_tokens(self, text: str) -> int:
        """Count tokens in text using tiktoken"""
        return len(self.encoding.encode(text))
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text content"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove HTML tags if any
        text = re.sub(r'<[^>]+>', '', text)
        
        # Fix common encoding issues
        text = text.replace('â€™', "'")
        text = text.replace('â€œ', '"')
        text = text.replace('â€\x9d', '"')
        text = text.replace('â€"', '–')
        
        # Replace old brand references
        text = text.replace('Dailyforex', 'Brokeranalysis')
        text = text.replace('dailyforex', 'brokeranalysis')
        text = text.replace('DailyForex', 'Brokeranalysis')
        
        return text.strip()
    
    def split_by_sentences(self, text: str) -> List[str]:
        """Split text into sentences for better chunking boundaries"""
        # Enhanced sentence splitting that handles financial abbreviations
        sentence_endings = r'[.!?]+'
        sentences = re.split(f'({sentence_endings})\s+', text)
        
        # Rejoin sentences with their punctuation
        result = []
        for i in range(0, len(sentences) - 1, 2):
            if i + 1 < len(sentences):
                sentence = sentences[i] + sentences[i + 1]
                result.append(sentence.strip())
            else:
                result.append(sentences[i].strip())
        
        return [s for s in result if s]
    
    def chunk_content(self, content: str, source_type: str, source_id: str, 
                     title: str, metadata: Dict) -> List[ContentChunk]:
        """Chunk content into target token segments with overlap"""
        cleaned_content = self.clean_text(content)
        sentences = self.split_by_sentences(cleaned_content)
        
        chunks = []
        current_chunk = ""
        current_tokens = 0
        chunk_index = 0
        overlap_content = ""
        
        for sentence in sentences:
            sentence_tokens = self.count_tokens(sentence)
            
            # If adding this sentence would exceed target, finalize current chunk
            if current_tokens + sentence_tokens > self.target_tokens and current_chunk:
                # Create chunk with overlap from previous
                full_chunk_content = overlap_content + current_chunk
                
                chunk = ContentChunk(
                    content=full_chunk_content.strip(),
                    token_count=self.count_tokens(full_chunk_content),
                    chunk_index=chunk_index,
                    source_type=source_type,
                    source_id=source_id,
                    title=title,
                    metadata=metadata,
                    overlap_tokens=self.count_tokens(overlap_content)
                )
                chunks.append(chunk)
                
                # Prepare overlap for next chunk
                overlap_sentences = current_chunk.split('. ')[-2:]  # Last 2 sentences
                overlap_content = '. '.join(overlap_sentences) + '. ' if len(overlap_sentences) > 1 else ''
                overlap_tokens = self.count_tokens(overlap_content)
                
                # Start new chunk
                current_chunk = sentence
                current_tokens = sentence_tokens
                chunk_index += 1
            else:
                current_chunk += " " + sentence if current_chunk else sentence
                current_tokens += sentence_tokens
        
        # Handle remaining content
        if current_chunk:
            full_chunk_content = overlap_content + current_chunk
            chunk = ContentChunk(
                content=full_chunk_content.strip(),
                token_count=self.count_tokens(full_chunk_content),
                chunk_index=chunk_index,
                source_type=source_type,
                source_id=source_id,
                title=title,
                metadata=metadata,
                overlap_tokens=self.count_tokens(overlap_content)
            )
            chunks.append(chunk)
        
        self.chunks_processed += len(chunks)
        self.total_tokens_processed += sum(chunk.token_count for chunk in chunks)
        
        return chunks
    
    def process_article(self, article_data: Dict) -> List[ContentChunk]:
        """Process a single article into chunks"""
        content = article_data.get('content', '')
        excerpt = article_data.get('excerpt', '')
        
        # Combine title, excerpt, and content
        full_content = f"{article_data.get('title', '')}\n\n{excerpt}\n\n{content}"
        
        metadata = {
            'author': article_data.get('author', ''),
            'published_date': article_data.get('published_date', ''),
            'category': article_data.get('category', ''),
            'tags': article_data.get('tags', []),
            'url_slug': article_data.get('slug', ''),
            'seo_keywords': article_data.get('seo_keywords', []),
            'reading_time': article_data.get('reading_time', 0)
        }
        
        return self.chunk_content(
            content=full_content,
            source_type='article',
            source_id=str(article_data.get('id', '')),
            title=article_data.get('title', ''),
            metadata=metadata
        )
    
    def process_broker_review(self, broker_data: Dict) -> List[ContentChunk]:
        """Process a single broker review into chunks"""
        # Combine all broker text content
        content_parts = [
            broker_data.get('name', ''),
            broker_data.get('description', ''),
            broker_data.get('features', ''),
            broker_data.get('regulation_info', ''),
            broker_data.get('review_content', ''),
            broker_data.get('pros', ''),
            broker_data.get('cons', ''),
            broker_data.get('trading_conditions', '')
        ]
        
        full_content = '\n\n'.join([part for part in content_parts if part])
        
        metadata = {
            'broker_name': broker_data.get('name', ''),
            'trust_score': broker_data.get('trust_score', 0),
            'regulation': broker_data.get('regulation', []),
            'founded_year': broker_data.get('founded_year', ''),
            'headquarters': broker_data.get('headquarters', ''),
            'min_deposit': broker_data.get('min_deposit', 0),
            'max_leverage': broker_data.get('max_leverage', ''),
            'spread_type': broker_data.get('spread_type', ''),
            'platforms': broker_data.get('platforms', []),
            'account_types': broker_data.get('account_types', [])
        }
        
        return self.chunk_content(
            content=full_content,
            source_type='broker_review',
            source_id=str(broker_data.get('id', '')),
            title=f"Broker Review: {broker_data.get('name', '')}",
            metadata=metadata
        )
    
    def save_chunks_to_json(self, chunks: List[ContentChunk], output_file: str):
        """Save chunks to JSON file for further processing"""
        chunks_data = []
        for chunk in chunks:
            chunks_data.append({
                'content': chunk.content,
                'token_count': chunk.token_count,
                'chunk_index': chunk.chunk_index,
                'source_type': chunk.source_type,
                'source_id': chunk.source_id,
                'title': chunk.title,
                'metadata': chunk.metadata,
                'overlap_tokens': chunk.overlap_tokens,
                'created_at': datetime.now().isoformat()
            })
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(chunks_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved {len(chunks)} chunks to {output_file}")
    
    def get_processing_stats(self) -> Dict:
        """Get processing statistics"""
        return {
            'chunks_processed': self.chunks_processed,
            'total_tokens_processed': self.total_tokens_processed,
            'average_tokens_per_chunk': self.total_tokens_processed / max(self.chunks_processed, 1),
            'target_tokens': self.target_tokens,
            'overlap_tokens': self.overlap_tokens
        }

def main():
    """Main function to run content chunking"""
    parser = argparse.ArgumentParser(description='Chunk content for RAG system')
    parser.add_argument('--input-dir', required=True, help='Directory containing input JSON files')
    parser.add_argument('--output-dir', required=True, help='Directory to save chunked content')
    parser.add_argument('--target-tokens', type=int, default=300, help='Target tokens per chunk')
    parser.add_argument('--overlap-tokens', type=int, default=50, help='Overlap tokens between chunks')
    parser.add_argument('--content-type', choices=['articles', 'brokers', 'both'], default='both')
    
    args = parser.parse_args()
    
    # Create output directory
    Path(args.output_dir).mkdir(parents=True, exist_ok=True)
    
    chunker = ContentChunker(args.target_tokens, args.overlap_tokens)
    
    logger.info(f"Starting content chunking with target {args.target_tokens} tokens per chunk")
    
    all_chunks = []
    
    # Process articles if requested
    if args.content_type in ['articles', 'both']:
        articles_file = Path(args.input_dir) / 'articles.json'
        if articles_file.exists():
            logger.info("Processing articles...")
            with open(articles_file, 'r', encoding='utf-8') as f:
                articles = json.load(f)
            
            for article in articles:
                try:
                    chunks = chunker.process_article(article)
                    all_chunks.extend(chunks)
                    logger.info(f"Processed article '{article.get('title', 'Unknown')}' into {len(chunks)} chunks")
                except Exception as e:
                    logger.error(f"Error processing article {article.get('id', 'unknown')}: {e}")
    
    # Process broker reviews if requested
    if args.content_type in ['brokers', 'both']:
        brokers_file = Path(args.input_dir) / 'brokers.json'
        if brokers_file.exists():
            logger.info("Processing broker reviews...")
            with open(brokers_file, 'r', encoding='utf-8') as f:
                brokers = json.load(f)
            
            for broker in brokers:
                try:
                    chunks = chunker.process_broker_review(broker)
                    all_chunks.extend(chunks)
                    logger.info(f"Processed broker '{broker.get('name', 'Unknown')}' into {len(chunks)} chunks")
                except Exception as e:
                    logger.error(f"Error processing broker {broker.get('id', 'unknown')}: {e}")
    
    # Save all chunks
    output_file = Path(args.output_dir) / f'content_chunks_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
    chunker.save_chunks_to_json(all_chunks, str(output_file))
    
    # Log statistics
    stats = chunker.get_processing_stats()
    logger.info(f"Processing complete: {stats}")
    
    # Save statistics
    stats_file = Path(args.output_dir) / f'chunking_stats_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
    with open(stats_file, 'w') as f:
        json.dump(stats, f, indent=2)

if __name__ == '__main__':
    main()
"},"query_language":"English"}}