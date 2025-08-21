import os
import re
import json
from bs4 import BeautifulSoup
from pathlib import Path

def extract_broker_data(html_file_path):
    """Extract broker data from HTML files"""
    try:
        with open(html_file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # Extract basic info from meta tags
        title_tag = soup.find('meta', {'name': 'title'}) or soup.find('title')
        description_tag = soup.find('meta', {'name': 'description'})
        keywords_tag = soup.find('meta', {'name': 'keywords'})
        
        broker_data = {
            'name': '',
            'title': title_tag.get('content', '') if title_tag and title_tag.get('content') else (title_tag.text if title_tag else ''),
            'description': description_tag.get('content', '') if description_tag else '',
            'keywords': keywords_tag.get('content', '') if keywords_tag else '',
            'file_path': str(html_file_path),
            'regulation': '',
            'minimum_deposit': '',
            'leverage': '',
            'spreads': '',
            'rating': '',
            'pros': [],
            'cons': [],
            'website_url': '',
            'founded_year': '',
            'headquarters': ''
        }
        
        # Extract broker name from filename or title
        filename = Path(html_file_path).stem
        if '-review' in filename:
            broker_data['name'] = filename.replace('-review', '').replace('-', ' ').title()
        
        # Look for structured data or specific content patterns
        # This would need to be customized based on actual HTML structure
        
        return broker_data
        
    except Exception as e:
        print(f"Error processing {html_file_path}: {e}")
        return None

def extract_article_data(html_file_path):
    """Extract article data from HTML files"""
    try:
        with open(html_file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # Extract basic info from meta tags
        title_tag = soup.find('meta', {'name': 'title'}) or soup.find('title')
        description_tag = soup.find('meta', {'name': 'description'})
        keywords_tag = soup.find('meta', {'name': 'keywords'})
        
        article_data = {
            'title': title_tag.get('content', '') if title_tag and title_tag.get('content') else (title_tag.text if title_tag else ''),
            'description': description_tag.get('content', '') if description_tag else '',
            'keywords': keywords_tag.get('content', '') if keywords_tag else '',
            'file_path': str(html_file_path),
            'content': '',
            'author': '',
            'published_date': '',
            'category': '',
            'tags': []
        }
        
        # Extract date from file path if possible
        path_parts = Path(html_file_path).parts
        for i, part in enumerate(path_parts):
            if part.isdigit() and len(part) == 4:  # Year
                if i + 1 < len(path_parts) and path_parts[i + 1].isdigit():  # Month
                    article_data['published_date'] = f"{part}-{path_parts[i + 1].zfill(2)}"
                    break
        
        return article_data
        
    except Exception as e:
        print(f"Error processing {html_file_path}: {e}")
        return None

def scan_forex_data(base_path):
    """Scan the daily forex directory and extract data"""
    base_path = Path(base_path)
    
    brokers_data = []
    articles_data = []
    
    # Process broker files
    brokers_dir = base_path / 'www.dailyforex.com' / 'forex-brokers'
    if brokers_dir.exists():
        print(f"Scanning brokers directory: {brokers_dir}")
        for html_file in brokers_dir.glob('**/*.html'):
            if 'review' in html_file.name:
                broker_data = extract_broker_data(html_file)
                if broker_data:
                    brokers_data.append(broker_data)
    
    # Process article files
    news_dir = base_path / 'www.dailyforex.com' / 'forex-news'
    if news_dir.exists():
        print(f"Scanning news directory: {news_dir}")
        for html_file in news_dir.glob('**/*.html'):
            if html_file.name.isdigit() or 'article' in html_file.name.lower():
                article_data = extract_article_data(html_file)
                if article_data:
                    articles_data.append(article_data)
    
    return brokers_data, articles_data

def save_extracted_data(brokers_data, articles_data, output_dir):
    """Save extracted data to JSON files"""
    output_dir = Path(output_dir)
    output_dir.mkdir(exist_ok=True)
    
    # Save brokers data
    with open(output_dir / 'brokers_data.json', 'w', encoding='utf-8') as f:
        json.dump(brokers_data, f, indent=2, ensure_ascii=False)
    
    # Save articles data
    with open(output_dir / 'articles_data.json', 'w', encoding='utf-8') as f:
        json.dump(articles_data, f, indent=2, ensure_ascii=False)
    
    print(f"Extracted {len(brokers_data)} brokers and {len(articles_data)} articles")
    print(f"Data saved to {output_dir}")

if __name__ == "__main__":
    # Set the path to your daily forex data
    forex_data_path = "C:/Users/LENOVO/Desktop/BrokeranalysisDaily/daily forex"
    output_path = "C:/Users/LENOVO/Desktop/BrokeranalysisDaily/extracted_data"
    
    print("Starting data extraction...")
    brokers_data, articles_data = scan_forex_data(forex_data_path)
    save_extracted_data(brokers_data, articles_data, output_path)
    print("Data extraction completed!")