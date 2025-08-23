#!/usr/bin/env python3
"""
Embedding Generation Script for Brokeranalysis Platform
Generates embeddings using sentence-transformers all-MiniLM-L6-v2 model

Author: Brokeranalysis AI System
Date: 2024
"""

import os
import json
import logging
import numpy as np
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from pathlib import Path
import argparse
from datetime import datetime
import time
import pickle
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("Please install sentence-transformers: pip install sentence-transformers")
    exit(1)

try:
    import torch
except ImportError:
    print("Please install torch: pip install torch")
    exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('embedding_generation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class EmbeddingResult:
    """Represents an embedding result with metadata"""
    content_id: str
    embedding: np.ndarray
    content_type: str
    token_count: int
    processing_time: float
    model_name: str
    embedding_dimension: int
    created_at: str

class EmbeddingGenerator:
    """Handles embedding generation using sentence-transformers"""
    
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2', batch_size: int = 32, 
                 device: Optional[str] = None):
        self.model_name = model_name
        self.batch_size = batch_size
        self.device = device or ('cuda' if torch.cuda.is_available() else 'cpu')
        
        logger.info(f"Initializing embedding model: {model_name} on {self.device}")
        
        # Load the model
        self.model = SentenceTransformer(model_name, device=self.device)
        self.embedding_dimension = self.model.get_sentence_embedding_dimension()
        
        # Statistics tracking
        self.embeddings_generated = 0
        self.total_processing_time = 0.0
        self.failed_embeddings = 0
        
        # Thread safety
        self.lock = threading.Lock()
        
        logger.info(f"Model loaded successfully. Embedding dimension: {self.embedding_dimension}")
    
    def preprocess_text(self, text: str) -> str:
        """Preprocess text before embedding generation"""
        # Clean and normalize text
        text = text.strip()
        
        # Replace brand references
        text = text.replace('Dailyforex', 'Brokeranalysis')
        text = text.replace('dailyforex', 'brokeranalysis')
        text = text.replace('DailyForex', 'Brokeranalysis')
        
        # Limit text length to prevent memory issues
        max_length = 8000  # Conservative limit for sentence-transformers
        if len(text) > max_length:
            text = text[:max_length] + "..."
            logger.warning(f"Text truncated to {max_length} characters")
        
        return text
    
    def generate_single_embedding(self, text: str, content_id: str, 
                                content_type: str) -> Optional[EmbeddingResult]:
        """Generate embedding for a single text"""
        try:
            start_time = time.time()
            
            # Preprocess text
            processed_text = self.preprocess_text(text)
            
            # Generate embedding
            embedding = self.model.encode(processed_text, convert_to_numpy=True)
            
            processing_time = time.time() - start_time
            
            # Update statistics
            with self.lock:
                self.embeddings_generated += 1
                self.total_processing_time += processing_time
            
            result = EmbeddingResult(
                content_id=content_id,
                embedding=embedding,
                content_type=content_type,
                token_count=len(processed_text.split()),
                processing_time=processing_time,
                model_name=self.model_name,
                embedding_dimension=self.embedding_dimension,
                created_at=datetime.now().isoformat()
            )
            
            logger.debug(f"Generated embedding for {content_id} in {processing_time:.3f}s")
            return result
            
        except Exception as e:
            with self.lock:
                self.failed_embeddings += 1
            logger.error(f"Failed to generate embedding for {content_id}: {e}")
            return None
    
    def generate_batch_embeddings(self, texts: List[str], content_ids: List[str], 
                                content_types: List[str]) -> List[Optional[EmbeddingResult]]:
        """Generate embeddings for a batch of texts"""
        try:
            start_time = time.time()
            
            # Preprocess all texts
            processed_texts = [self.preprocess_text(text) for text in texts]
            
            # Generate embeddings in batch
            embeddings = self.model.encode(processed_texts, convert_to_numpy=True, 
                                         batch_size=self.batch_size, show_progress_bar=False)
            
            processing_time = time.time() - start_time
            
            # Create results
            results = []
            for i, (text, content_id, content_type, embedding) in enumerate(
                zip(processed_texts, content_ids, content_types, embeddings)):
                
                result = EmbeddingResult(
                    content_id=content_id,
                    embedding=embedding,
                    content_type=content_type,
                    token_count=len(text.split()),
                    processing_time=processing_time / len(texts),  # Average time per item
                    model_name=self.model_name,
                    embedding_dimension=self.embedding_dimension,
                    created_at=datetime.now().isoformat()
                )
                results.append(result)
            
            # Update statistics
            with self.lock:
                self.embeddings_generated += len(results)
                self.total_processing_time += processing_time
            
            logger.info(f"Generated {len(results)} embeddings in batch ({processing_time:.3f}s)")
            return results
            
        except Exception as e:
            with self.lock:
                self.failed_embeddings += len(texts)
            logger.error(f"Failed to generate batch embeddings: {e}")
            return [None] * len(texts)
    
    def process_content_chunks(self, chunks_data: List[Dict]) -> List[EmbeddingResult]:
        """Process content chunks and generate embeddings"""
        logger.info(f"Processing {len(chunks_data)} content chunks")
        
        results = []
        
        # Process in batches
        for i in range(0, len(chunks_data), self.batch_size):
            batch = chunks_data[i:i + self.batch_size]
            
            texts = [chunk['content'] for chunk in batch]
            content_ids = [f"{chunk['source_type']}_{chunk['source_id']}_{chunk['chunk_index']}" 
                          for chunk in batch]
            content_types = [chunk['source_type'] for chunk in batch]
            
            batch_results = self.generate_batch_embeddings(texts, content_ids, content_types)
            
            # Filter out None results
            valid_results = [r for r in batch_results if r is not None]
            results.extend(valid_results)
            
            # Progress logging
            progress = min(i + self.batch_size, len(chunks_data))
            logger.info(f"Progress: {progress}/{len(chunks_data)} chunks processed")
            
            # Add small delay to prevent overwhelming the system
            time.sleep(0.1)
        
        return results
    
    def save_embeddings(self, embeddings: List[EmbeddingResult], output_file: str, 
                       format: str = 'json'):
        """Save embeddings to file in specified format"""
        if format == 'json':
            self._save_embeddings_json(embeddings, output_file)
        elif format == 'pickle':
            self._save_embeddings_pickle(embeddings, output_file)
        elif format == 'numpy':
            self._save_embeddings_numpy(embeddings, output_file)
        else:
            raise ValueError(f"Unsupported format: {format}")
    
    def _save_embeddings_json(self, embeddings: List[EmbeddingResult], output_file: str):
        """Save embeddings as JSON (embeddings as lists)"""
        embeddings_data = []
        for emb in embeddings:
            embeddings_data.append({
                'content_id': emb.content_id,
                'embedding': emb.embedding.tolist(),
                'content_type': emb.content_type,
                'token_count': emb.token_count,
                'processing_time': emb.processing_time,
                'model_name': emb.model_name,
                'embedding_dimension': emb.embedding_dimension,
                'created_at': emb.created_at
            })
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(embeddings_data, f, indent=2)
        
        logger.info(f"Saved {len(embeddings)} embeddings to {output_file} (JSON format)")
    
    def _save_embeddings_pickle(self, embeddings: List[EmbeddingResult], output_file: str):
        """Save embeddings as pickle file"""
        with open(output_file, 'wb') as f:
            pickle.dump(embeddings, f)
        
        logger.info(f"Saved {len(embeddings)} embeddings to {output_file} (Pickle format)")
    
    def _save_embeddings_numpy(self, embeddings: List[EmbeddingResult], output_file: str):
        """Save embeddings as numpy arrays with metadata"""
        embedding_matrix = np.array([emb.embedding for emb in embeddings])
        metadata = {
            'content_ids': [emb.content_id for emb in embeddings],
            'content_types': [emb.content_type for emb in embeddings],
            'token_counts': [emb.token_count for emb in embeddings],
            'processing_times': [emb.processing_time for emb in embeddings],
            'model_name': embeddings[0].model_name if embeddings else '',
            'embedding_dimension': embeddings[0].embedding_dimension if embeddings else 0,
            'created_at': datetime.now().isoformat()
        }
        
        np.savez_compressed(output_file, 
                           embeddings=embedding_matrix, 
                           metadata=metadata)
        
        logger.info(f"Saved {len(embeddings)} embeddings to {output_file} (NumPy format)")
    
    def get_processing_stats(self) -> Dict:
        """Get processing statistics"""
        avg_time = self.total_processing_time / max(self.embeddings_generated, 1)
        
        return {
            'embeddings_generated': self.embeddings_generated,
            'failed_embeddings': self.failed_embeddings,
            'total_processing_time': self.total_processing_time,
            'average_processing_time': avg_time,
            'model_name': self.model_name,
            'embedding_dimension': self.embedding_dimension,
            'device': self.device,
            'batch_size': self.batch_size
        }

def main():
    """Main function to run embedding generation"""
    parser = argparse.ArgumentParser(description='Generate embeddings for content chunks')
    parser.add_argument('--input-file', required=True, help='Input JSON file with content chunks')
    parser.add_argument('--output-dir', required=True, help='Directory to save embeddings')
    parser.add_argument('--model-name', default='all-MiniLM-L6-v2', help='Sentence transformer model name')
    parser.add_argument('--batch-size', type=int, default=32, help='Batch size for processing')
    parser.add_argument('--device', help='Device to use (cuda/cpu)')
    parser.add_argument('--output-format', choices=['json', 'pickle', 'numpy'], default='json')
    parser.add_argument('--max-chunks', type=int, help='Maximum number of chunks to process')
    
    args = parser.parse_args()
    
    # Create output directory
    Path(args.output_dir).mkdir(parents=True, exist_ok=True)
    
    # Load content chunks
    logger.info(f"Loading content chunks from {args.input_file}")
    with open(args.input_file, 'r', encoding='utf-8') as f:
        chunks_data = json.load(f)
    
    # Limit chunks if specified
    if args.max_chunks:
        chunks_data = chunks_data[:args.max_chunks]
        logger.info(f"Limited to {len(chunks_data)} chunks")
    
    # Initialize embedding generator
    generator = EmbeddingGenerator(
        model_name=args.model_name,
        batch_size=args.batch_size,
        device=args.device
    )
    
    # Generate embeddings
    logger.info(f"Starting embedding generation for {len(chunks_data)} chunks")
    start_time = time.time()
    
    embeddings = generator.process_content_chunks(chunks_data)
    
    total_time = time.time() - start_time
    logger.info(f"Embedding generation completed in {total_time:.2f} seconds")
    
    # Save embeddings
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = Path(args.output_dir) / f'embeddings_{timestamp}.{args.output_format}'
    
    generator.save_embeddings(embeddings, str(output_file), args.output_format)
    
    # Save statistics
    stats = generator.get_processing_stats()
    stats['total_runtime'] = total_time
    stats['chunks_processed'] = len(chunks_data)
    stats['successful_embeddings'] = len(embeddings)
    
    stats_file = Path(args.output_dir) / f'embedding_stats_{timestamp}.json'
    with open(stats_file, 'w') as f:
        json.dump(stats, f, indent=2)
    
    logger.info(f"Processing statistics: {stats}")
    
    # Memory cleanup
    del generator.model
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

if __name__ == '__main__':
    main()