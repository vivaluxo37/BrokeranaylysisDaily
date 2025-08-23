#!/usr/bin/env python3
"""
Batch Processing System for Brokeranalysis Platform

This script orchestrates the complete data processing pipeline:
1. Content chunking for articles and broker reviews
2. Embedding generation using sentence-transformers
3. Canonical broker name mapping
4. Database population with processed data

Usage:
    python batch_processor.py --config config.json
    python batch_processor.py --articles-only
    python batch_processor.py --brokers-only
    python batch_processor.py --resume-from-checkpoint
"""

import os
import sys
import json
import logging
import argparse
import asyncio
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
import traceback

# Third-party imports
import asyncpg
import numpy as np
from tqdm import tqdm

# Local imports
from content_chunker import ContentChunker, ContentChunk
from embedding_generator import EmbeddingGenerator, EmbeddingResult
from canonical_broker_mapper import CanonicalBrokerMapper, BrokerEntity, MatchResult


@dataclass
class ProcessingConfig:
    """Configuration for batch processing"""
    # Database configuration
    database_url: str
    
    # Processing options
    chunk_size: int = 300
    batch_size: int = 100
    max_workers: int = 4
    
    # File paths
    output_dir: str = "./output"
    checkpoint_dir: str = "./checkpoints"
    
    # Processing flags
    process_articles: bool = True
    process_brokers: bool = True
    generate_embeddings: bool = True
    update_canonical_mapping: bool = True
    
    # Embedding model
    embedding_model: str = "all-MiniLM-L6-v2"
    
    # Logging
    log_level: str = "INFO"
    log_file: Optional[str] = None


@dataclass
class ProcessingStats:
    """Statistics for processing session"""
    start_time: datetime
    end_time: Optional[datetime] = None
    
    # Articles processing
    articles_processed: int = 0
    articles_failed: int = 0
    article_chunks_created: int = 0
    
    # Brokers processing
    brokers_processed: int = 0
    brokers_failed: int = 0
    broker_chunks_created: int = 0
    
    # Embeddings
    embeddings_generated: int = 0
    embeddings_failed: int = 0
    
    # Database operations
    documents_inserted: int = 0
    documents_updated: int = 0
    database_errors: int = 0
    
    # Canonical mapping
    canonical_mappings_created: int = 0
    canonical_mappings_updated: int = 0
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert stats to dictionary"""
        return asdict(self)
    
    def get_summary(self) -> str:
        """Get human-readable summary"""
        duration = (self.end_time - self.start_time).total_seconds() if self.end_time else 0
        
        return f"""
Processing Summary:
==================
Duration: {duration:.2f} seconds

Content Processing:
- Articles: {self.articles_processed} processed, {self.articles_failed} failed
- Article chunks: {self.article_chunks_created} created
- Brokers: {self.brokers_processed} processed, {self.brokers_failed} failed
- Broker chunks: {self.broker_chunks_created} created

Embeddings:
- Generated: {self.embeddings_generated}
- Failed: {self.embeddings_failed}

Database Operations:
- Documents inserted: {self.documents_inserted}
- Documents updated: {self.documents_updated}
- Database errors: {self.database_errors}

Canonical Mapping:
- Mappings created: {self.canonical_mappings_created}
- Mappings updated: {self.canonical_mappings_updated}
"""


class CheckpointManager:
    """Manages processing checkpoints for resumability"""
    
    def __init__(self, checkpoint_dir: str):
        self.checkpoint_dir = Path(checkpoint_dir)
        self.checkpoint_dir.mkdir(exist_ok=True)
        self.checkpoint_file = self.checkpoint_dir / "processing_checkpoint.json"
    
    def save_checkpoint(self, data: Dict[str, Any]) -> None:
        """Save checkpoint data"""
        try:
            with open(self.checkpoint_file, 'w') as f:
                json.dump(data, f, indent=2, default=str)
            logging.info(f"Checkpoint saved to {self.checkpoint_file}")
        except Exception as e:
            logging.error(f"Failed to save checkpoint: {e}")
    
    def load_checkpoint(self) -> Optional[Dict[str, Any]]:
        """Load checkpoint data"""
        try:
            if self.checkpoint_file.exists():
                with open(self.checkpoint_file, 'r') as f:
                    data = json.load(f)
                logging.info(f"Checkpoint loaded from {self.checkpoint_file}")
                return data
        except Exception as e:
            logging.error(f"Failed to load checkpoint: {e}")
        return None
    
    def clear_checkpoint(self) -> None:
        """Clear checkpoint file"""
        try:
            if self.checkpoint_file.exists():
                self.checkpoint_file.unlink()
                logging.info("Checkpoint cleared")
        except Exception as e:
            logging.error(f"Failed to clear checkpoint: {e}")


class BatchProcessor:
    """Main batch processing orchestrator"""
    
    def __init__(self, config: ProcessingConfig):
        self.config = config
        self.stats = ProcessingStats(start_time=datetime.now())
        self.checkpoint_manager = CheckpointManager(config.checkpoint_dir)
        
        # Initialize components
        self.chunker = ContentChunker(chunk_size=config.chunk_size)
        self.embedding_generator = EmbeddingGenerator(model_name=config.embedding_model)
        self.broker_mapper = CanonicalBrokerMapper()
        
        # Database connection
        self.db_pool: Optional[asyncpg.Pool] = None
        
        # Setup logging
        self._setup_logging()
        
        # Output directory
        self.output_dir = Path(config.output_dir)
        self.output_dir.mkdir(exist_ok=True)
    
    def _setup_logging(self) -> None:
        """Setup logging configuration"""
        log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        
        handlers = [logging.StreamHandler(sys.stdout)]
        
        if self.config.log_file:
            handlers.append(logging.FileHandler(self.config.log_file))
        
        logging.basicConfig(
            level=getattr(logging, self.config.log_level.upper()),
            format=log_format,
            handlers=handlers
        )
        
        # Set third-party loggers to WARNING
        logging.getLogger('asyncpg').setLevel(logging.WARNING)
        logging.getLogger('sentence_transformers').setLevel(logging.WARNING)
    
    async def initialize_database(self) -> None:
        """Initialize database connection pool"""
        try:
            self.db_pool = await asyncpg.create_pool(
                self.config.database_url,
                min_size=2,
                max_size=self.config.max_workers + 2
            )
            logging.info("Database connection pool initialized")
        except Exception as e:
            logging.error(f"Failed to initialize database: {e}")
            raise
    
    async def close_database(self) -> None:
        """Close database connection pool"""
        if self.db_pool:
            await self.db_pool.close()
            logging.info("Database connection pool closed")
    
    async def fetch_articles(self) -> List[Dict[str, Any]]:
        """Fetch articles from database"""
        query = """
        SELECT id, title, content, excerpt, author, published_at, 
               category, tags, meta_description, slug
        FROM articles 
        WHERE content IS NOT NULL AND content != ''
        ORDER BY published_at DESC
        """
        
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(query)
            return [dict(row) for row in rows]
    
    async def fetch_brokers(self) -> List[Dict[str, Any]]:
        """Fetch brokers from database"""
        query = """
        SELECT id, name, description, features, regulation_info, 
               review_summary, trust_score, website_url, 
               country, founded_year, min_deposit
        FROM brokers 
        WHERE (description IS NOT NULL AND description != '') 
           OR (features IS NOT NULL AND features != '')
           OR (review_summary IS NOT NULL AND review_summary != '')
        ORDER BY trust_score DESC NULLS LAST
        """
        
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(query)
            return [dict(row) for row in rows]
    
    async def process_articles(self, articles: List[Dict[str, Any]]) -> List[ContentChunk]:
        """Process articles into chunks"""
        all_chunks = []
        
        for article in tqdm(articles, desc="Processing articles"):
            try:
                # Combine article content
                content_parts = []
                if article.get('title'):
                    content_parts.append(f"Title: {article['title']}")
                if article.get('excerpt'):
                    content_parts.append(f"Excerpt: {article['excerpt']}")
                if article.get('content'):
                    content_parts.append(article['content'])
                
                full_content = "\n\n".join(content_parts)
                
                # Create chunks
                chunks = self.chunker.chunk_content(
                    content=full_content,
                    source_type="article",
                    source_id=str(article['id']),
                    metadata={
                        'title': article.get('title'),
                        'author': article.get('author'),
                        'category': article.get('category'),
                        'tags': article.get('tags'),
                        'published_at': str(article.get('published_at')),
                        'slug': article.get('slug')
                    }
                )
                
                all_chunks.extend(chunks)
                self.stats.articles_processed += 1
                self.stats.article_chunks_created += len(chunks)
                
            except Exception as e:
                logging.error(f"Failed to process article {article.get('id')}: {e}")
                self.stats.articles_failed += 1
        
        return all_chunks
    
    async def process_brokers(self, brokers: List[Dict[str, Any]]) -> List[ContentChunk]:
        """Process brokers into chunks"""
        all_chunks = []
        
        for broker in tqdm(brokers, desc="Processing brokers"):
            try:
                # Combine broker content
                content_parts = []
                if broker.get('name'):
                    content_parts.append(f"Broker: {broker['name']}")
                if broker.get('description'):
                    content_parts.append(f"Description: {broker['description']}")
                if broker.get('features'):
                    content_parts.append(f"Features: {broker['features']}")
                if broker.get('regulation_info'):
                    content_parts.append(f"Regulation: {broker['regulation_info']}")
                if broker.get('review_summary'):
                    content_parts.append(f"Review: {broker['review_summary']}")
                
                full_content = "\n\n".join(content_parts)
                
                # Create chunks
                chunks = self.chunker.chunk_content(
                    content=full_content,
                    source_type="broker",
                    source_id=str(broker['id']),
                    metadata={
                        'name': broker.get('name'),
                        'country': broker.get('country'),
                        'trust_score': broker.get('trust_score'),
                        'website_url': broker.get('website_url'),
                        'founded_year': broker.get('founded_year'),
                        'min_deposit': broker.get('min_deposit')
                    }
                )
                
                all_chunks.extend(chunks)
                self.stats.brokers_processed += 1
                self.stats.broker_chunks_created += len(chunks)
                
            except Exception as e:
                logging.error(f"Failed to process broker {broker.get('id')}: {e}")
                self.stats.brokers_failed += 1
        
        return all_chunks
    
    async def generate_embeddings_batch(self, chunks: List[ContentChunk]) -> List[Tuple[ContentChunk, np.ndarray]]:
        """Generate embeddings for chunks in batches"""
        results = []
        
        # Process in batches
        for i in tqdm(range(0, len(chunks), self.config.batch_size), desc="Generating embeddings"):
            batch = chunks[i:i + self.config.batch_size]
            
            try:
                # Extract texts for batch processing
                texts = [chunk.content for chunk in batch]
                
                # Generate embeddings
                embeddings = self.embedding_generator.generate_embeddings_batch(texts)
                
                # Pair chunks with embeddings
                for chunk, embedding in zip(batch, embeddings):
                    results.append((chunk, embedding))
                    self.stats.embeddings_generated += 1
                
            except Exception as e:
                logging.error(f"Failed to generate embeddings for batch: {e}")
                self.stats.embeddings_failed += len(batch)
        
        return results
    
    async def insert_documents_batch(self, chunk_embedding_pairs: List[Tuple[ContentChunk, np.ndarray]]) -> None:
        """Insert documents into database in batches"""
        insert_query = """
        INSERT INTO documents (
            content, content_embedding, source_type, source_id, 
            chunk_index, token_count, metadata, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (source_type, source_id, chunk_index) 
        DO UPDATE SET 
            content = EXCLUDED.content,
            content_embedding = EXCLUDED.content_embedding,
            token_count = EXCLUDED.token_count,
            metadata = EXCLUDED.metadata,
            updated_at = CURRENT_TIMESTAMP
        """
        
        async with self.db_pool.acquire() as conn:
            for i in tqdm(range(0, len(chunk_embedding_pairs), self.config.batch_size), desc="Inserting documents"):
                batch = chunk_embedding_pairs[i:i + self.config.batch_size]
                
                try:
                    # Prepare batch data
                    batch_data = []
                    for chunk, embedding in batch:
                        batch_data.append((
                            chunk.content,
                            embedding.tolist(),  # Convert numpy array to list for JSON
                            chunk.source_type,
                            chunk.source_id,
                            chunk.chunk_index,
                            chunk.token_count,
                            json.dumps(chunk.metadata),
                            datetime.now()
                        ))
                    
                    # Execute batch insert
                    await conn.executemany(insert_query, batch_data)
                    self.stats.documents_inserted += len(batch)
                    
                except Exception as e:
                    logging.error(f"Failed to insert document batch: {e}")
                    self.stats.database_errors += len(batch)
    
    async def update_canonical_mappings(self, brokers: List[Dict[str, Any]]) -> None:
        """Update canonical broker mappings"""
        try:
            # Extract broker names
            broker_names = [broker['name'] for broker in brokers if broker.get('name')]
            
            # Process mappings
            results = self.broker_mapper.process_names_batch(broker_names)
            
            # Update database with canonical mappings
            async with self.db_pool.acquire() as conn:
                for result in results:
                    if result.canonical_entity:
                        try:
                            await conn.execute(
                                """
                                INSERT INTO canonical_brokers (name, variations, metadata)
                                VALUES ($1, $2, $3)
                                ON CONFLICT (name) 
                                DO UPDATE SET 
                                    variations = EXCLUDED.variations,
                                    metadata = EXCLUDED.metadata,
                                    updated_at = CURRENT_TIMESTAMP
                                """,
                                result.canonical_entity.name,
                                json.dumps(result.canonical_entity.variations),
                                json.dumps(result.canonical_entity.metadata)
                            )
                            self.stats.canonical_mappings_created += 1
                        except Exception as e:
                            logging.error(f"Failed to update canonical mapping for {result.canonical_entity.name}: {e}")
            
        except Exception as e:
            logging.error(f"Failed to update canonical mappings: {e}")
    
    async def save_processing_results(self, chunks: List[ContentChunk], 
                                    embeddings: List[Tuple[ContentChunk, np.ndarray]]) -> None:
        """Save processing results to files"""
        try:
            # Save chunks
            chunks_file = self.output_dir / f"chunks_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(chunks_file, 'w') as f:
                json.dump([asdict(chunk) for chunk in chunks], f, indent=2, default=str)
            
            # Save embeddings metadata
            embeddings_meta_file = self.output_dir / f"embeddings_meta_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            embeddings_meta = [
                {
                    'chunk': asdict(chunk),
                    'embedding_shape': embedding.shape,
                    'embedding_norm': float(np.linalg.norm(embedding))
                }
                for chunk, embedding in embeddings
            ]
            with open(embeddings_meta_file, 'w') as f:
                json.dump(embeddings_meta, f, indent=2, default=str)
            
            logging.info(f"Results saved to {self.output_dir}")
            
        except Exception as e:
            logging.error(f"Failed to save results: {e}")
    
    async def run(self, resume_from_checkpoint: bool = False) -> ProcessingStats:
        """Run the complete batch processing pipeline"""
        try:
            # Load checkpoint if resuming
            checkpoint_data = None
            if resume_from_checkpoint:
                checkpoint_data = self.checkpoint_manager.load_checkpoint()
            
            # Initialize database
            await self.initialize_database()
            
            all_chunks = []
            
            # Process articles
            if self.config.process_articles:
                logging.info("Fetching articles from database...")
                articles = await self.fetch_articles()
                logging.info(f"Found {len(articles)} articles to process")
                
                if articles:
                    article_chunks = await self.process_articles(articles)
                    all_chunks.extend(article_chunks)
                    logging.info(f"Created {len(article_chunks)} article chunks")
            
            # Process brokers
            brokers = []
            if self.config.process_brokers:
                logging.info("Fetching brokers from database...")
                brokers = await self.fetch_brokers()
                logging.info(f"Found {len(brokers)} brokers to process")
                
                if brokers:
                    broker_chunks = await self.process_brokers(brokers)
                    all_chunks.extend(broker_chunks)
                    logging.info(f"Created {len(broker_chunks)} broker chunks")
            
            # Generate embeddings
            embeddings = []
            if self.config.generate_embeddings and all_chunks:
                logging.info(f"Generating embeddings for {len(all_chunks)} chunks...")
                embeddings = await self.generate_embeddings_batch(all_chunks)
                logging.info(f"Generated {len(embeddings)} embeddings")
                
                # Insert into database
                if embeddings:
                    logging.info("Inserting documents into database...")
                    await self.insert_documents_batch(embeddings)
                    logging.info(f"Inserted {self.stats.documents_inserted} documents")
            
            # Update canonical mappings
            if self.config.update_canonical_mapping and brokers:
                logging.info("Updating canonical broker mappings...")
                await self.update_canonical_mappings(brokers)
                logging.info(f"Updated {self.stats.canonical_mappings_created} canonical mappings")
            
            # Save results
            if all_chunks:
                await self.save_processing_results(all_chunks, embeddings)
            
            # Clear checkpoint on successful completion
            self.checkpoint_manager.clear_checkpoint()
            
        except Exception as e:
            logging.error(f"Processing failed: {e}")
            logging.error(traceback.format_exc())
            
            # Save checkpoint for resuming
            checkpoint_data = {
                'timestamp': datetime.now().isoformat(),
                'stats': self.stats.to_dict(),
                'error': str(e)
            }
            self.checkpoint_manager.save_checkpoint(checkpoint_data)
            raise
        
        finally:
            # Finalize stats
            self.stats.end_time = datetime.now()
            
            # Close database
            await self.close_database()
        
        return self.stats


def load_config(config_file: str) -> ProcessingConfig:
    """Load configuration from JSON file"""
    try:
        with open(config_file, 'r') as f:
            config_data = json.load(f)
        return ProcessingConfig(**config_data)
    except Exception as e:
        logging.error(f"Failed to load config from {config_file}: {e}")
        raise


def create_default_config() -> ProcessingConfig:
    """Create default configuration"""
    return ProcessingConfig(
        database_url=os.getenv('DATABASE_URL', 'postgresql://user:pass@localhost/brokeranalysis'),
        chunk_size=300,
        batch_size=50,
        max_workers=4,
        output_dir="./output",
        checkpoint_dir="./checkpoints",
        process_articles=True,
        process_brokers=True,
        generate_embeddings=True,
        update_canonical_mapping=True,
        embedding_model="all-MiniLM-L6-v2",
        log_level="INFO",
        log_file="batch_processing.log"
    )


async def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Batch processing system for Brokeranalysis Platform")
    parser.add_argument('--config', type=str, help='Configuration file path')
    parser.add_argument('--articles-only', action='store_true', help='Process articles only')
    parser.add_argument('--brokers-only', action='store_true', help='Process brokers only')
    parser.add_argument('--resume-from-checkpoint', action='store_true', help='Resume from checkpoint')
    parser.add_argument('--no-embeddings', action='store_true', help='Skip embedding generation')
    parser.add_argument('--no-canonical-mapping', action='store_true', help='Skip canonical mapping')
    parser.add_argument('--batch-size', type=int, default=50, help='Batch size for processing')
    parser.add_argument('--output-dir', type=str, default='./output', help='Output directory')
    parser.add_argument('--log-level', type=str, default='INFO', choices=['DEBUG', 'INFO', 'WARNING', 'ERROR'])
    
    args = parser.parse_args()
    
    # Load or create configuration
    if args.config:
        config = load_config(args.config)
    else:
        config = create_default_config()
    
    # Override config with command line arguments
    if args.articles_only:
        config.process_articles = True
        config.process_brokers = False
    elif args.brokers_only:
        config.process_articles = False
        config.process_brokers = True
    
    if args.no_embeddings:
        config.generate_embeddings = False
    
    if args.no_canonical_mapping:
        config.update_canonical_mapping = False
    
    if args.batch_size:
        config.batch_size = args.batch_size
    
    if args.output_dir:
        config.output_dir = args.output_dir
    
    if args.log_level:
        config.log_level = args.log_level
    
    # Create processor and run
    processor = BatchProcessor(config)
    
    try:
        logging.info("Starting batch processing...")
        stats = await processor.run(resume_from_checkpoint=args.resume_from_checkpoint)
        
        # Print summary
        print("\n" + "="*50)
        print("BATCH PROCESSING COMPLETED")
        print("="*50)
        print(stats.get_summary())
        
        return 0
        
    except Exception as e:
        logging.error(f"Batch processing failed: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))