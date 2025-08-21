import os
import re
import json
from datetime import datetime

def extract_article_data(file_path):
    """Extract article data from individual SQL files"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract title
        title_match = re.search(r"'([^']+)'", content)
        title = title_match.group(1) if title_match else f"Article {os.path.basename(file_path)}"
        
        # Create slug from title
        slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
        slug = re.sub(r'\s+', '-', slug.strip())
        slug = slug[:100]  # Limit slug length
        
        # Extract content (everything after the first quote)
        content_match = re.search(r"'[^']+',\s*'([^']*(?:'[^']*)*)'(?:,|\);)", content, re.DOTALL)
        article_content = content_match.group(1) if content_match else "Content not found"
        
        # Create excerpt (first 200 chars)
        excerpt = article_content[:200] + "..." if len(article_content) > 200 else article_content
        
        # Determine category and tags based on content
        content_lower = (title + " " + article_content).lower()
        
        if any(word in content_lower for word in ['forex', 'currency', 'eur/usd', 'gbp/usd', 'usd/jpy']):
            category = 'Forex'
            tags = ['forex', 'currency analysis']
        elif any(word in content_lower for word in ['bitcoin', 'ethereum', 'crypto', 'solana']):
            category = 'General'
            tags = ['cryptocurrency', 'bitcoin']
        elif any(word in content_lower for word in ['nasdaq', 'sp 500', 's&p', 'stocks', 'equity']):
            category = 'Stocks'
            tags = ['stocks', 'equity markets']
        elif any(word in content_lower for word in ['gold', 'silver', 'copper', 'oil', 'commodity']):
            category = 'Commodities'
            tags = ['commodities', 'precious metals']
        else:
            category = 'General'
            tags = ['market analysis']
        
        # Add common tags
        if 'weekly' in content_lower:
            tags.append('weekly analysis')
        if 'monthly' in content_lower:
            tags.append('monthly outlook')
        if 'forecast' in content_lower:
            tags.append('forecast')
        
        return {
            'title': title,
            'slug': slug,
            'content': article_content,
            'excerpt': excerpt,
            'category': category,
            'tags': tags,
            'published_at': '2025-06-01 10:00:00+00'
        }
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def create_insert_statement(article_data):
    """Create SQL INSERT statement for an article"""
    tags_array = "ARRAY[" + ", ".join([f"'{tag}'" for tag in article_data['tags']]) + "]"
    
    # Escape single quotes in content
    title = article_data['title'].replace("'", "''")
    content = article_data['content'].replace("'", "''")
    excerpt = article_data['excerpt'].replace("'", "''")
    
    return f"""INSERT INTO articles (title, slug, content, excerpt, category, subcategory, author_id, published_at, meta_description, meta_keywords, featured_image_url, status, view_count, tags, language) 
VALUES ('{title}', '{article_data['slug']}', '{content}', '{excerpt}', '{article_data['category']}', NULL, (SELECT id FROM authors WHERE name = 'Broker Analysis' LIMIT 1), '{article_data['published_at']}', '{excerpt}', '{', '.join(article_data['tags'])}', NULL, 'published', 0, {tags_array}, 'en');"""

def main():
    """Process remaining articles and create migration batches"""
    base_dir = "C:\\Users\\LENOVO\\Desktop\\BrokeranalysisDaily\\scripts"
    
    # Process articles from 116 to 191 (excluding already processed ones)
    start_article = 116
    end_article = 191
    
    processed_articles = []
    failed_articles = []
    
    for i in range(start_article, end_article + 1):
        file_path = os.path.join(base_dir, f"article_{i}.sql")
        
        if os.path.exists(file_path):
            article_data = extract_article_data(file_path)
            if article_data:
                processed_articles.append(article_data)
                print(f"Processed article_{i}.sql: {article_data['title'][:50]}...")
            else:
                failed_articles.append(f"article_{i}.sql")
                print(f"Failed to process article_{i}.sql")
        else:
            print(f"File not found: article_{i}.sql")
    
    # Create individual SQL files for each article (easier to handle duplicates)
    for i, article in enumerate(processed_articles, start=1):
        sql_content = f"-- Individual article migration {start_article + i - 1}\n"
        sql_content += create_insert_statement(article)
        
        output_file = f"individual_article_{start_article + i - 1}.sql"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(sql_content)
    
    print(f"\nProcessing complete!")
    print(f"Successfully processed: {len(processed_articles)} articles")
    print(f"Failed to process: {len(failed_articles)} articles")
    if failed_articles:
        print(f"Failed files: {', '.join(failed_articles)}")
    
    # Create summary
    summary = {
        'processed_count': len(processed_articles),
        'failed_count': len(failed_articles),
        'failed_files': failed_articles,
        'articles': [{'title': a['title'], 'slug': a['slug'], 'category': a['category']} for a in processed_articles]
    }
    
    with open('migration_summary.json', 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()