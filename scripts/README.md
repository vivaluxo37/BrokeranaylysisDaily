# Brokeranalysis Data Processing Scripts

This directory contains the complete data processing pipeline for the Brokeranalysis Platform, including content chunking, embedding generation, canonical broker mapping, and batch processing systems.

## Overview

The data processing pipeline consists of several interconnected components:

1. **Content Chunking** - Splits articles and broker reviews into ~300 token segments
2. **Embedding Generation** - Creates vector embeddings using sentence-transformers
3. **Canonical Broker Mapping** - Resolves broker name variations using fuzzy matching
4. **Batch Processing** - Orchestrates the complete pipeline and populates the database

## Prerequisites

### Python Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Database Setup

Ensure your Supabase database has the following tables:
- `articles` - Article content
- `brokers` - Broker information
- `documents` - Chunked content with embeddings
- `canonical_brokers` - Canonical broker mappings

### Environment Variables

Create a `.env` file in the scripts directory:

```env
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/postgres
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
```

## Scripts Overview

### 1. Content Chunker (`content_chunker.py`)

Splits long-form content into manageable chunks for embedding generation.

**Features:**
- Token-based chunking using tiktoken
- Configurable chunk size (default: 300 tokens)
- Metadata preservation
- Support for articles and broker reviews

**Usage:**
```bash
# Basic usage
python content_chunker.py --input articles.json --output chunks.json

# Custom chunk size
python content_chunker.py --input articles.json --output chunks.json --chunk-size 500

# Process specific content type
python content_chunker.py --input brokers.json --output broker_chunks.json --content-type broker
```

**Arguments:**
- `--input`: Input JSON file with content
- `--output`: Output JSON file for chunks
- `--chunk-size`: Target chunk size in tokens (default: 300)
- `--content-type`: Content type (article/broker)
- `--overlap`: Overlap between chunks in tokens (default: 50)

### 2. Embedding Generator (`embedding_generator.py`)

Generates vector embeddings using sentence-transformers models.

**Features:**
- Uses all-MiniLM-L6-v2 model (384-dimensional embeddings)
- Batch processing for efficiency
- Multiple output formats (JSON, Pickle, NumPy)
- Text preprocessing and normalization

**Usage:**
```bash
# Generate embeddings from chunks
python embedding_generator.py --input chunks.json --output embeddings.json

# Use different model
python embedding_generator.py --input chunks.json --output embeddings.json --model all-mpnet-base-v2

# Batch processing
python embedding_generator.py --input chunks.json --output embeddings.pkl --format pickle --batch-size 100
```

**Arguments:**
- `--input`: Input file with text content
- `--output`: Output file for embeddings
- `--model`: Sentence-transformers model name
- `--format`: Output format (json/pickle/numpy)
- `--batch-size`: Batch size for processing
- `--device`: Device for computation (cpu/cuda)

### 3. Canonical Broker Mapper (`canonical_broker_mapper.py`)

Resolves broker name variations and creates canonical mappings.

**Features:**
- Fuzzy string matching using rapidfuzz
- Configurable similarity thresholds
- Batch processing support
- Variation detection and normalization

**Usage:**
```bash
# Create canonical mappings
python canonical_broker_mapper.py --input broker_names.txt --output mappings.json

# Custom similarity threshold
python canonical_broker_mapper.py --input broker_names.txt --output mappings.json --threshold 85

# Analyze unmatched names
python canonical_broker_mapper.py --input broker_names.txt --output mappings.json --analyze-unmatched
```

**Arguments:**
- `--input`: Input file with broker names
- `--output`: Output file for mappings
- `--threshold`: Similarity threshold (0-100)
- `--analyze-unmatched`: Analyze unmatched names
- `--create-entities`: Create new canonical entities

### 4. Batch Processor (`batch_processor.py`)

Orchestrates the complete data processing pipeline.

**Features:**
- End-to-end processing pipeline
- Database integration with Supabase
- Progress tracking and logging
- Checkpoint system for resumability
- Configurable processing options

**Usage:**
```bash
# Full pipeline with default config
python batch_processor.py

# Use custom configuration
python batch_processor.py --config config.json

# Process articles only
python batch_processor.py --articles-only

# Process brokers only
python batch_processor.py --brokers-only

# Resume from checkpoint
python batch_processor.py --resume-from-checkpoint

# Skip embedding generation
python batch_processor.py --no-embeddings

# Custom batch size
python batch_processor.py --batch-size 100
```

**Arguments:**
- `--config`: Configuration file path
- `--articles-only`: Process articles only
- `--brokers-only`: Process brokers only
- `--resume-from-checkpoint`: Resume from checkpoint
- `--no-embeddings`: Skip embedding generation
- `--no-canonical-mapping`: Skip canonical mapping
- `--batch-size`: Batch size for processing
- `--output-dir`: Output directory
- `--log-level`: Logging level (DEBUG/INFO/WARNING/ERROR)

## Configuration

### Configuration File (`config.json`)

The batch processor uses a JSON configuration file:

```json
{
  "database_url": "postgresql://postgres:[password]@[host]:[port]/postgres",
  "chunk_size": 300,
  "batch_size": 50,
  "max_workers": 4,
  "output_dir": "./output",
  "checkpoint_dir": "./checkpoints",
  "process_articles": true,
  "process_brokers": true,
  "generate_embeddings": true,
  "update_canonical_mapping": true,
  "embedding_model": "all-MiniLM-L6-v2",
  "log_level": "INFO",
  "log_file": "batch_processing.log"
}
```

**Configuration Options:**
- `database_url`: PostgreSQL connection string
- `chunk_size`: Target chunk size in tokens
- `batch_size`: Batch size for database operations
- `max_workers`: Maximum number of worker threads
- `output_dir`: Directory for output files
- `checkpoint_dir`: Directory for checkpoint files
- `process_articles`: Enable article processing
- `process_brokers`: Enable broker processing
- `generate_embeddings`: Enable embedding generation
- `update_canonical_mapping`: Enable canonical mapping
- `embedding_model`: Sentence-transformers model name
- `log_level`: Logging level
- `log_file`: Log file path

## Workflow Examples

### Complete Pipeline

```bash
# 1. Setup environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# 2. Configure database connection
cp config.json.template config.json
# Edit config.json with your database URL

# 3. Run complete pipeline
python batch_processor.py --config config.json
```

### Incremental Processing

```bash
# Process new articles only
python batch_processor.py --articles-only --batch-size 25

# Update canonical mappings
python batch_processor.py --brokers-only --no-embeddings

# Generate embeddings for existing chunks
python batch_processor.py --no-canonical-mapping
```

### Development and Testing

```bash
# Test with small batch
python batch_processor.py --batch-size 10 --log-level DEBUG

# Process specific content type
python content_chunker.py --input test_articles.json --output test_chunks.json
python embedding_generator.py --input test_chunks.json --output test_embeddings.json
```

## Output Files

The processing pipeline generates several output files:

### Chunks Output
```json
[
  {
    "content": "Article content chunk...",
    "source_type": "article",
    "source_id": "123",
    "chunk_index": 0,
    "token_count": 287,
    "metadata": {
      "title": "Article Title",
      "author": "Author Name",
      "category": "forex"
    }
  }
]
```

### Embeddings Output
```json
[
  {
    "text": "Content text...",
    "embedding": [0.1, -0.2, 0.3, ...],
    "model": "all-MiniLM-L6-v2",
    "timestamp": "2024-01-15T10:30:00Z"
  }
]
```

### Canonical Mappings Output
```json
[
  {
    "canonical_name": "IC Markets",
    "variations": ["IC Markets", "IC Markets Global", "ICMarkets"],
    "confidence_scores": [100, 95, 90],
    "metadata": {
      "country": "Australia",
      "regulation": "ASIC"
    }
  }
]
```

## Database Schema

The scripts interact with the following database tables:

### Documents Table
```sql
CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    content_embedding vector(384),
    source_type VARCHAR(50) NOT NULL,
    source_id VARCHAR(255) NOT NULL,
    chunk_index INTEGER NOT NULL,
    token_count INTEGER,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Canonical Brokers Table
```sql
CREATE TABLE canonical_brokers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    variations TEXT[],
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Performance Optimization

### Memory Management
- Use appropriate batch sizes (50-100 for most systems)
- Monitor memory usage during embedding generation
- Consider using CPU vs GPU based on available resources

### Database Optimization
- Use connection pooling for concurrent operations
- Create appropriate indexes on frequently queried columns
- Use UPSERT operations to handle duplicate content

### Processing Optimization
- Process articles and brokers separately for large datasets
- Use checkpoints for long-running operations
- Monitor progress with detailed logging

## Troubleshooting

### Common Issues

1. **Memory Errors**
   - Reduce batch size
   - Use CPU instead of GPU for embedding generation
   - Process content types separately

2. **Database Connection Issues**
   - Verify database URL and credentials
   - Check network connectivity
   - Ensure database has required tables and extensions

3. **Embedding Generation Failures**
   - Verify sentence-transformers installation
   - Check available disk space for model downloads
   - Use smaller models for resource-constrained environments

4. **Chunking Issues**
   - Verify tiktoken installation
   - Check input data format
   - Adjust chunk size for content type

### Logging and Debugging

```bash
# Enable debug logging
python batch_processor.py --log-level DEBUG

# Check specific component
python content_chunker.py --input test.json --output test_chunks.json --verbose

# Monitor database operations
tail -f batch_processing.log
```

## Integration with Brokeranalysis Platform

These scripts are designed to integrate with the main Brokeranalysis Platform:

1. **RAG System**: Embeddings are used for semantic search in the AI chat interface
2. **Content Management**: Chunks enable efficient content retrieval and display
3. **Broker Matching**: Canonical mappings improve broker recommendation accuracy
4. **SEO Optimization**: Processed content supports programmatic page generation

## Contributing

When contributing to the data processing pipeline:

1. Follow the existing code structure and naming conventions
2. Add comprehensive logging for debugging
3. Include error handling for all external dependencies
4. Update this README with any new features or changes
5. Test with sample data before processing production datasets

## License

This code is part of the Brokeranalysis Platform and is subject to the project's license terms.