#!/usr/bin/env python3
"""
Data Processing Script for Broker Analysis RAG System

This script processes broker and article data, generates embeddings,
and populates the Supabase database for the RAG system.
"""

import os
import sys
import json
import asyncio
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime
import logging

# Third-party imports
import numpy as np
from supabase import create_client, Client
from sentence_transformers import SentenceTransformer
from openai import OpenAI
from dotenv import load_dotenv
import tiktoken
from bs4 import BeautifulSoup
import requests
from tqdm import tqdm

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('data_processing.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class BrokerData:
    """Data structure for broker information"""
    name: str
    description: str
    regulation: str
    min_deposit: float
    spreads: str
    platforms: str
    features: List[str]
    pros: List[str]
    cons: List[str]
    trust_score: float
    website_url: str
    logo_url: Optional[str] = None
    year_founded: Optional[int] = None
    headquarters: Optional[str] = None

@dataclass
class ArticleData:
    """Data structure for article information"""
    title: str
    content: str
    summary: str
    category: str
    tags: List[str]
    author: str
    published_at: datetime
    slug: str
    meta_description: str
    featured_image: Optional[str] = None

class EmbeddingGenerator:
    """Handles embedding generation using multiple models"""
    
    def __init__(self):
        self.sentence_transformer = SentenceTransformer('all-MiniLM-L6-v2')
        self.openai_client = None
        self.encoding = tiktoken.get_encoding("cl100k_base")
        
        # Initialize OpenAI if API key is available
        openai_key = os.getenv('OPENAI_API_KEY')
        if openai_key and openai_key != 'your_openai_api_key_here':
            self.openai_client = OpenAI(api_key=openai_key)
            logger.info("OpenAI client initialized")
        else:
            logger.warning("OpenAI API key not found, using only SentenceTransformer")
    
    def generate_embedding(self, text: str, model: str = 'sentence_transformer') -> List[float]:
        """Generate embedding for given text"""
        try:
            if model == 'openai' and self.openai_client:
                response = self.openai_client.embeddings.create(
                    input=text,
                    model="text-embedding-3-small"
                )
                return response.data[0].embedding
            else:
                # Use SentenceTransformer as default/fallback
                embedding = self.sentence_transformer.encode(text)
                return embedding.tolist()
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            # Fallback to SentenceTransformer
            embedding = self.sentence_transformer.encode(text)
            return embedding.tolist()
    
    def chunk_text(self, text: str, max_tokens: int = 500, overlap: int = 50) -> List[str]:
        """Split text into chunks for processing"""
        tokens = self.encoding.encode(text)
        chunks = []
        
        for i in range(0, len(tokens), max_tokens - overlap):
            chunk_tokens = tokens[i:i + max_tokens]
            chunk_text = self.encoding.decode(chunk_tokens)
            chunks.append(chunk_text)
        
        return chunks

class DatabaseManager:
    """Manages Supabase database operations"""
    
    def __init__(self):
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not supabase_url or not supabase_key:
            raise ValueError("Supabase credentials not found in environment variables")
        
        self.client: Client = create_client(supabase_url, supabase_key)
        logger.info("Supabase client initialized")
    
    def insert_broker(self, broker: BrokerData, embedding: List[float]) -> bool:
        """Insert broker data into database"""
        try:
            data = {
                'name': broker.name,
                'description': broker.description,
                'regulation': broker.regulation,
                'min_deposit': broker.min_deposit,
                'spreads': broker.spreads,
                'platforms': broker.platforms,
                'features': broker.features,
                'pros': broker.pros,
                'cons': broker.cons,
                'trust_score': broker.trust_score,
                'website_url': broker.website_url,
                'logo_url': broker.logo_url,
                'year_founded': broker.year_founded,
                'headquarters': broker.headquarters,
                'embedding': embedding
            }
            
            result = self.client.table('brokers').insert(data).execute()
            logger.info(f"Inserted broker: {broker.name}")
            return True
        except Exception as e:
            logger.error(f"Error inserting broker {broker.name}: {e}")
            return False
    
    def insert_article(self, article: ArticleData, embedding: List[float]) -> bool:
        """Insert article data into database"""
        try:
            data = {
                'title': article.title,
                'content': article.content,
                'summary': article.summary,
                'category': article.category,
                'tags': article.tags,
                'author': article.author,
                'published_at': article.published_at.isoformat(),
                'slug': article.slug,
                'meta_description': article.meta_description,
                'featured_image': article.featured_image,
                'embedding': embedding
            }
            
            result = self.client.table('articles').insert(data).execute()
            logger.info(f"Inserted article: {article.title}")
            return True
        except Exception as e:
            logger.error(f"Error inserting article {article.title}: {e}")
            return False
    
    def insert_document(self, title: str, content: str, source_type: str, 
                       metadata: Dict[str, Any], embedding: List[float]) -> bool:
        """Insert document into documents table"""
        try:
            data = {
                'title': title,
                'content': content,
                'source_type': source_type,
                'metadata': metadata,
                'embedding': embedding,
                'chunk_index': 0,
                'token_count': len(content.split())
            }
            
            result = self.client.table('documents').insert(data).execute()
            logger.info(f"Inserted document: {title}")
            return True
        except Exception as e:
            logger.error(f"Error inserting document {title}: {e}")
            return False

class DataProcessor:
    """Main data processing class"""
    
    def __init__(self):
        self.embedding_generator = EmbeddingGenerator()
        self.db_manager = DatabaseManager()
    
    def create_sample_brokers(self) -> List[BrokerData]:
        """Create sample broker data for testing"""
        return [
            BrokerData(
                name="IG Markets",
                description="IG is a leading online trading provider offering CFDs, spread betting, and forex trading with competitive spreads and advanced platforms.",
                regulation="FCA, ASIC, MAS",
                min_deposit=250.0,
                spreads="From 0.6 pips EUR/USD",
                platforms="IG Trading Platform, MetaTrader 4, ProRealTime",
                features=["Advanced charting", "Risk management tools", "Mobile trading", "Educational resources"],
                pros=["Highly regulated", "Competitive spreads", "Excellent platform", "Strong research"],
                cons=["High minimum deposit for some accounts", "Complex fee structure"],
                trust_score=9.2,
                website_url="https://www.ig.com",
                logo_url="https://example.com/ig-logo.png",
                year_founded=1974,
                headquarters="London, UK"
            ),
            BrokerData(
                name="XM Group",
                description="XM offers forex and CFD trading with tight spreads, fast execution, and comprehensive educational resources for traders of all levels.",
                regulation="CySEC, ASIC, IFSC",
                min_deposit=5.0,
                spreads="From 1.0 pips EUR/USD",
                platforms="MetaTrader 4, MetaTrader 5, XM WebTrader",
                features=["No deposit fees", "24/5 customer support", "Educational webinars", "Multiple account types"],
                pros=["Low minimum deposit", "Good customer support", "Educational resources", "Multiple platforms"],
                cons=["Higher spreads on some pairs", "Limited research tools"],
                trust_score=8.7,
                website_url="https://www.xm.com",
                logo_url="https://example.com/xm-logo.png",
                year_founded=2009,
                headquarters="Limassol, Cyprus"
            ),
            BrokerData(
                name="OANDA",
                description="OANDA provides forex and CFD trading with transparent pricing, advanced analytics, and institutional-grade execution.",
                regulation="FCA, NFA, CFTC, ASIC",
                min_deposit=0.0,
                spreads="From 1.2 pips EUR/USD",
                platforms="OANDA Trade, MetaTrader 4, TradingView",
                features=["No minimum deposit", "Advanced analytics", "API access", "Historical data"],
                pros=["No minimum deposit", "Transparent pricing", "Good analytics", "Reliable execution"],
                cons=["Limited educational resources", "Higher spreads than some competitors"],
                trust_score=8.9,
                website_url="https://www.oanda.com",
                logo_url="https://example.com/oanda-logo.png",
                year_founded=1996,
                headquarters="Toronto, Canada"
            )
        ]
    
    def create_sample_articles(self) -> List[ArticleData]:
        """Create sample article data for testing"""
        return [
            ArticleData(
                title="Understanding Forex Spreads: A Comprehensive Guide",
                content="""Forex spreads are one of the most important concepts for traders to understand. A spread is the difference between the bid price and the ask price of a currency pair. This difference represents the cost of trading and is how brokers make money from forex transactions.
                
                There are two main types of spreads: fixed and variable. Fixed spreads remain constant regardless of market conditions, while variable spreads fluctuate based on market volatility and liquidity. Most retail brokers offer variable spreads, which tend to be tighter during major trading sessions.
                
                Several factors affect spread sizes: market volatility, liquidity, time of day, and economic events. Major currency pairs like EUR/USD typically have the tightest spreads due to high liquidity, while exotic pairs have wider spreads due to lower trading volume.
                
                To minimize spread costs, traders should: trade during major market sessions, focus on major currency pairs, avoid trading during news events, and choose brokers with competitive spreads. Understanding spreads is crucial for developing profitable trading strategies.""",
                summary="A comprehensive guide explaining forex spreads, their types, factors affecting them, and strategies to minimize spread costs.",
                category="Education",
                tags=["forex", "spreads", "trading costs", "education"],
                author="Broker Analysis Team",
                published_at=datetime.now(),
                slug="understanding-forex-spreads-guide",
                meta_description="Learn about forex spreads, how they work, and strategies to minimize trading costs in this comprehensive guide.",
                featured_image="https://example.com/forex-spreads.jpg"
            ),
            ArticleData(
                title="Top 5 Forex Trading Platforms in 2024",
                content="""Choosing the right trading platform is crucial for forex trading success. Here are the top 5 platforms that stand out in 2024:
                
                1. MetaTrader 4 (MT4): The most popular platform worldwide, offering advanced charting, automated trading, and extensive customization options. Perfect for both beginners and experienced traders.
                
                2. MetaTrader 5 (MT5): The successor to MT4 with additional features like more timeframes, economic calendar integration, and improved order management.
                
                3. cTrader: Known for its intuitive interface, advanced charting tools, and transparent pricing. Popular among professional traders and scalpers.
                
                4. TradingView: Web-based platform with exceptional charting capabilities, social trading features, and extensive technical analysis tools.
                
                5. NinjaTrader: Advanced platform offering sophisticated analysis tools, automated trading capabilities, and professional-grade features.
                
                When choosing a platform, consider factors like ease of use, available tools, mobile compatibility, and broker integration. The best platform depends on your trading style and experience level.""",
                summary="Review of the top 5 forex trading platforms in 2024, comparing their features and suitability for different types of traders.",
                category="Reviews",
                tags=["trading platforms", "MetaTrader", "cTrader", "TradingView", "reviews"],
                author="Broker Analysis Team",
                published_at=datetime.now(),
                slug="top-forex-trading-platforms-2024",
                meta_description="Discover the top 5 forex trading platforms in 2024 and find the best one for your trading needs.",
                featured_image="https://example.com/trading-platforms.jpg"
            )
        ]
    
    async def process_brokers(self, brokers: List[BrokerData]):
        """Process and insert broker data"""
        logger.info(f"Processing {len(brokers)} brokers...")
        
        for broker in tqdm(brokers, desc="Processing brokers"):
            # Create comprehensive text for embedding
            broker_text = f"""
            Broker: {broker.name}
            Description: {broker.description}
            Regulation: {broker.regulation}
            Minimum Deposit: ${broker.min_deposit}
            Spreads: {broker.spreads}
            Platforms: {broker.platforms}
            Features: {', '.join(broker.features)}
            Pros: {', '.join(broker.pros)}
            Cons: {', '.join(broker.cons)}
            Trust Score: {broker.trust_score}/10
            Founded: {broker.year_founded}
            Headquarters: {broker.headquarters}
            """
            
            # Generate embedding
            embedding = self.embedding_generator.generate_embedding(broker_text)
            
            # Insert into database
            success = self.db_manager.insert_broker(broker, embedding)
            if not success:
                logger.error(f"Failed to insert broker: {broker.name}")
    
    async def process_articles(self, articles: List[ArticleData]):
        """Process and insert article data"""
        logger.info(f"Processing {len(articles)} articles...")
        
        for article in tqdm(articles, desc="Processing articles"):
            # Create comprehensive text for embedding
            article_text = f"""
            Title: {article.title}
            Summary: {article.summary}
            Category: {article.category}
            Tags: {', '.join(article.tags)}
            Content: {article.content}
            """
            
            # Generate embedding
            embedding = self.embedding_generator.generate_embedding(article_text)
            
            # Insert into database
            success = self.db_manager.insert_article(article, embedding)
            if not success:
                logger.error(f"Failed to insert article: {article.title}")
    
    async def process_documents(self):
        """Process and insert general documents"""
        documents = [
            {
                'title': 'Forex Trading Basics',
                'content': 'Forex trading involves buying and selling currencies in the foreign exchange market. It is the largest financial market in the world with daily trading volume exceeding $6 trillion.',
                'type': 'guide',
                'metadata': {'category': 'education', 'difficulty': 'beginner'}
            },
            {
                'title': 'Risk Management in Trading',
                'content': 'Risk management is crucial for successful trading. Key principles include position sizing, stop losses, diversification, and never risking more than you can afford to lose.',
                'type': 'guide',
                'metadata': {'category': 'education', 'difficulty': 'intermediate'}
            }
        ]
        
        logger.info(f"Processing {len(documents)} documents...")
        
        for doc in tqdm(documents, desc="Processing documents"):
            # Create text for embedding
            doc_text = f"Title: {doc['title']}\nContent: {doc['content']}"
            
            # Generate embedding
            embedding = self.embedding_generator.generate_embedding(doc_text)
            
            # Insert into database
            success = self.db_manager.insert_document(
                doc['title'], doc['content'], doc['type'], doc['metadata'], embedding
            )
            if not success:
                logger.error(f"Failed to insert document: {doc['title']}")

async def main():
    """Main function to run the data processing"""
    logger.info("Starting data processing...")
    
    try:
        processor = DataProcessor()
        
        # Create sample data
        brokers = processor.create_sample_brokers()
        articles = processor.create_sample_articles()
        
        # Process all data
        await processor.process_brokers(brokers)
        await processor.process_articles(articles)
        await processor.process_documents()
        
        logger.info("Data processing completed successfully!")
        
    except Exception as e:
        logger.error(f"Error during data processing: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())