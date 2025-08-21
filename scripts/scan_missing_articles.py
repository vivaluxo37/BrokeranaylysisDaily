import os
import json
from bs4 import BeautifulSoup
import re
from datetime import datetime

def extract_article_from_html(file_path):
    """Extract article content from HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # Extract title
        title_tag = soup.find('title')
        title = title_tag.get_text().strip() if title_tag else ''
        
        # Skip if it's a page listing or broker review
        if any(skip_word in title.lower() for skip_word in ['page ', 'review', 'broker']):
            return None
            
        # Extract meta description
        desc_tag = soup.find('meta', {'name': 'description'})
        description = desc_tag.get('content', '').strip() if desc_tag else ''
        
        # Look for article content in common containers
        article_content = ''
        content_selectors = [
            'article',
            '.article-content',
            '.post-content', 
            '.entry-content',
            '.content',
            'main'
        ]
        
        for selector in content_selectors:
            content_elem = soup.select_one(selector)
            if content_elem:
                # Remove script and style elements
                for script in content_elem(["script", "style"]):
                    script.decompose()
                article_content = content_elem.get_text().strip()
                break
        
        # Check if this looks like an article (has substantial content)
        if len(article_content) < 200 or not title:
            return None
            
        # Check for 2024/2025 content
        full_text = f"{title} {description} {article_content}"
        if not re.search(r'(2024|2025)', full_text):
            return None
            
        # Extract date if possible
        date_patterns = [
            r'(\d{1,2}[/-]\d{1,2}[/-]202[45])',
            r'(202[45][/-]\d{1,2}[/-]\d{1,2})',
            r'(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+202[45])'
        ]
        
        published_date = ''
        for pattern in date_patterns:
            match = re.search(pattern, full_text, re.IGNORECASE)
            if match:
                published_date = match.group(1)
                break
        
        return {
            'title': title.replace(' | DailyForex', '').replace(' | Broker Analysis', ''),
            'description': description,
            'content': article_content[:2000],  # Limit content length
            'file_path': file_path,
            'published_date': published_date,
            'author': 'Broker Analysis',
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def scan_for_missing_articles():
    """Scan HTML files for articles that might have been missed"""
    base_dir = r"C:\Users\LENOVO\Desktop\BrokeranalysisDaily\daily forex\www.dailyforex.com"
    
    # Load existing migrated articles to avoid duplicates
    existing_articles = set()
    try:
        with open(r"C:\Users\LENOVO\Desktop\BrokeranalysisDaily\migration_2024_beyond\articles_2024_beyond.json", 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
            for article in existing_data:
                existing_articles.add(article.get('title', '').lower())
    except:
        pass
    
    new_articles = []
    processed_count = 0
    
    # Scan HTML files
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                processed_count += 1
                
                if processed_count % 100 == 0:
                    print(f"Processed {processed_count} files, found {len(new_articles)} new articles")
                
                article = extract_article_from_html(file_path)
                if article:
                    # Check if this is a duplicate
                    if article['title'].lower() not in existing_articles:
                        new_articles.append(article)
                        existing_articles.add(article['title'].lower())
    
    print(f"\nScan complete!")
    print(f"Total files processed: {processed_count}")
    print(f"New articles found: {len(new_articles)}")
    
    if new_articles:
        # Save new articles
        output_file = r"C:\Users\LENOVO\Desktop\BrokeranalysisDaily\migration_2024_beyond\additional_articles_2024_beyond.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(new_articles, f, indent=2, ensure_ascii=False)
        print(f"New articles saved to: {output_file}")
        
        # Show sample of found articles
        print("\nSample of new articles found:")
        for i, article in enumerate(new_articles[:5]):
            print(f"{i+1}. {article['title']}")
    
    return new_articles

if __name__ == "__main__":
    scan_for_missing_articles()