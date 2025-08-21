import os
import json
import re
from bs4 import BeautifulSoup
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EnhancedDataParser:
    def __init__(self, base_path):
        self.base_path = base_path
        self.brokers_data = []
        self.articles_data = []
        
    def extract_meta_content(self, soup, name):
        """Extract content from meta tags"""
        meta_tag = soup.find('meta', {'name': name}) or soup.find('meta', {'property': f'og:{name}'})
        return meta_tag.get('content', '') if meta_tag else ''
    
    def extract_text_content(self, soup):
        """Extract main text content from HTML"""
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Try to find main content areas
        content_selectors = [
            'article', '.article-content', '.content', '.main-content',
            '.post-content', '.entry-content', 'main', '.article-body'
        ]
        
        for selector in content_selectors:
            content = soup.select_one(selector)
            if content:
                return content.get_text(strip=True)
        
        # Fallback to body content
        body = soup.find('body')
        if body:
            return body.get_text(strip=True)[:2000]  # Limit to first 2000 chars
        
        return ''
    
    def extract_broker_details(self, soup, file_path):
        """Extract detailed broker information"""
        text_content = self.extract_text_content(soup)
        
        # Extract rating using regex
        rating_patterns = [
            r'rating[:\s]*([0-9](?:\.[0-9])?)[\s/]*(?:out of )?[0-9]?',
            r'score[:\s]*([0-9](?:\.[0-9])?)',
            r'([0-9](?:\.[0-9])?)[\s]*(?:out of|/)[\s]*[0-9]'
        ]
        
        rating = ''
        for pattern in rating_patterns:
            match = re.search(pattern, text_content, re.IGNORECASE)
            if match:
                rating = match.group(1)
                break
        
        # Extract minimum deposit
        deposit_patterns = [
            r'minimum deposit[:\s]*\$?([0-9,]+)',
            r'min deposit[:\s]*\$?([0-9,]+)',
            r'deposit[:\s]*\$?([0-9,]+)'
        ]
        
        min_deposit = ''
        for pattern in deposit_patterns:
            match = re.search(pattern, text_content, re.IGNORECASE)
            if match:
                min_deposit = f"${match.group(1)}"
                break
        
        # Extract leverage
        leverage_patterns = [
            r'leverage[:\s]*([0-9]+:[0-9]+)',
            r'leverage[:\s]*([0-9]+x)',
            r'([0-9]+:[0-9]+)[\s]*leverage'
        ]
        
        leverage = ''
        for pattern in leverage_patterns:
            match = re.search(pattern, text_content, re.IGNORECASE)
            if match:
                leverage = match.group(1)
                break
        
        # Extract regulation info
        regulation_patterns = [
            r'regulated by[:\s]*([A-Z]{2,10})',
            r'regulation[:\s]*([A-Z]{2,10})',
            r'([A-Z]{2,10})[\s]*regulated'
        ]
        
        regulation = ''
        for pattern in regulation_patterns:
            match = re.search(pattern, text_content, re.IGNORECASE)
            if match:
                regulation = match.group(1)
                break
        
        # Extract pros and cons
        pros = []
        cons = []
        
        # Look for pros/advantages
        pros_section = re.search(r'pros?[:\s]*([^\n]*(?:\n[^\n]*){0,5})', text_content, re.IGNORECASE)
        if pros_section:
            pros_text = pros_section.group(1)
            pros = [p.strip() for p in re.split(r'[•\-\*]', pros_text) if p.strip()]
        
        # Look for cons/disadvantages
        cons_section = re.search(r'cons?[:\s]*([^\n]*(?:\n[^\n]*){0,5})', text_content, re.IGNORECASE)
        if cons_section:
            cons_text = cons_section.group(1)
            cons = [c.strip() for c in re.split(r'[•\-\*]', cons_text) if c.strip()]
        
        return {
            'rating': rating,
            'minimum_deposit': min_deposit,
            'leverage': leverage,
            'regulation': regulation,
            'pros': pros[:5],  # Limit to 5 items
            'cons': cons[:5]   # Limit to 5 items
        }
    
    def parse_broker_file(self, file_path):
        """Parse individual broker HTML file"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            soup = BeautifulSoup(content, 'html.parser')
            
            # Extract basic info
            title = self.extract_meta_content(soup, 'title') or soup.find('title').get_text() if soup.find('title') else ''
            description = self.extract_meta_content(soup, 'description')
            keywords = self.extract_meta_content(soup, 'keywords')
            
            # Extract broker name from filename
            filename = os.path.basename(file_path)
            broker_name = filename.replace('-review.html', '').replace('-', ' ').title()
            
            # Extract detailed broker information
            broker_details = self.extract_broker_details(soup, file_path)
            
            broker_data = {
                'name': broker_name,
                'title': title,
                'description': description,
                'keywords': keywords,
                'file_path': file_path,
                'rating': broker_details['rating'],
                'minimum_deposit': broker_details['minimum_deposit'],
                'leverage': broker_details['leverage'],
                'regulation': broker_details['regulation'],
                'pros': broker_details['pros'],
                'cons': broker_details['cons'],
                'website_url': '',  # Will be populated later
                'founded_year': '',
                'headquarters': '',
                'spreads': '',
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            return broker_data
            
        except Exception as e:
            logger.error(f"Error parsing broker file {file_path}: {str(e)}")
            return None
    
    def parse_article_file(self, file_path):
        """Parse individual article HTML file"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            soup = BeautifulSoup(content, 'html.parser')
            
            # Extract basic info
            title = self.extract_meta_content(soup, 'title') or soup.find('title').get_text() if soup.find('title') else ''
            description = self.extract_meta_content(soup, 'description')
            keywords = self.extract_meta_content(soup, 'keywords')
            
            # Extract article content
            article_content = self.extract_text_content(soup)
            
            # Extract date from file path
            date_match = re.search(r'(\d{4})/(\d{2})/', file_path)
            published_date = ''
            if date_match:
                year, month = date_match.groups()
                published_date = f"{year}-{month.zfill(2)}-01"  # Default to first of month
            
            # Extract article ID from filename
            filename = os.path.basename(file_path)
            article_id = re.search(r'(\d+)', filename)
            article_id = article_id.group(1) if article_id else ''
            
            # Determine category from path
            category = 'forex-news'
            if 'commodities' in file_path:
                category = 'commodities'
            elif 'financial-news' in file_path:
                category = 'financial-news'
            elif 'stocks' in file_path:
                category = 'stocks'
            
            article_data = {
                'id': article_id,
                'title': title,
                'description': description,
                'content': article_content[:5000],  # Limit content length
                'keywords': keywords,
                'category': category,
                'published_date': published_date,
                'author': 'Broker Analysis',  # Default author
                'file_path': file_path,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            return article_data
            
        except Exception as e:
            logger.error(f"Error parsing article file {file_path}: {str(e)}")
            return None
    
    def scan_brokers(self):
        """Scan and parse all broker files"""
        brokers_dir = os.path.join(self.base_path, 'daily forex', 'www.dailyforex.com', 'forex-brokers')
        
        if not os.path.exists(brokers_dir):
            logger.error(f"Brokers directory not found: {brokers_dir}")
            return
        
        logger.info(f"Scanning brokers directory: {brokers_dir}")
        
        for filename in os.listdir(brokers_dir):
            if filename.endswith('-review.html'):
                file_path = os.path.join(brokers_dir, filename)
                broker_data = self.parse_broker_file(file_path)
                if broker_data:
                    self.brokers_data.append(broker_data)
                    logger.info(f"Parsed broker: {broker_data['name']}")
    
    def scan_articles(self):
        """Scan and parse all article files"""
        news_dirs = [
            os.path.join(self.base_path, 'daily forex', 'www.dailyforex.com', 'forex-news'),
            os.path.join(self.base_path, 'daily forex', 'www.dailyforex.com', 'commodities-news'),
            os.path.join(self.base_path, 'daily forex', 'www.dailyforex.com', 'financial-news'),
            os.path.join(self.base_path, 'daily forex', 'www.dailyforex.com', 'stocks-news')
        ]
        
        for news_dir in news_dirs:
            if os.path.exists(news_dir):
                logger.info(f"Scanning news directory: {news_dir}")
                self._scan_news_directory(news_dir)
    
    def _scan_news_directory(self, directory):
        """Recursively scan news directory for articles"""
        for root, dirs, files in os.walk(directory):
            for filename in files:
                if filename.endswith('.html') and filename.replace('.html', '').isdigit():
                    file_path = os.path.join(root, filename)
                    article_data = self.parse_article_file(file_path)
                    if article_data:
                        self.articles_data.append(article_data)
                        logger.info(f"Parsed article: {article_data['title'][:50]}...")
    
    def save_data(self, output_dir):
        """Save extracted data to JSON files"""
        os.makedirs(output_dir, exist_ok=True)
        
        # Save brokers data
        brokers_file = os.path.join(output_dir, 'enhanced_brokers_data.json')
        with open(brokers_file, 'w', encoding='utf-8') as f:
            json.dump(self.brokers_data, f, indent=2, ensure_ascii=False)
        
        # Save articles data
        articles_file = os.path.join(output_dir, 'enhanced_articles_data.json')
        with open(articles_file, 'w', encoding='utf-8') as f:
            json.dump(self.articles_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved {len(self.brokers_data)} brokers to {brokers_file}")
        logger.info(f"Saved {len(self.articles_data)} articles to {articles_file}")

def main():
    base_path = r'C:\Users\LENOVO\Desktop\BrokeranalysisDaily'
    output_dir = os.path.join(base_path, 'extracted_data')
    
    parser = EnhancedDataParser(base_path)
    
    logger.info("Starting enhanced data extraction...")
    
    # Parse brokers
    parser.scan_brokers()
    
    # Parse articles
    parser.scan_articles()
    
    # Save data
    parser.save_data(output_dir)
    
    logger.info("Enhanced data extraction completed!")
    logger.info(f"Total brokers extracted: {len(parser.brokers_data)}")
    logger.info(f"Total articles extracted: {len(parser.articles_data)}")

if __name__ == "__main__":
    main()