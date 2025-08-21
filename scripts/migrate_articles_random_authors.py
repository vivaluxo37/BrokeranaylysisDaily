import json
import re
import random
from datetime import datetime
from collections import defaultdict

def load_articles():
    """Load articles from both JSON files"""
    articles = []
    
    # Load original articles
    try:
        with open('../migration_2024_beyond/articles_2024_beyond.json', 'r', encoding='utf-8') as f:
            original_articles = json.load(f)
            articles.extend(original_articles)
    except FileNotFoundError:
        print("Warning: articles_2024_beyond.json not found")
    
    # Load additional articles
    try:
        with open('../migration_2024_beyond/additional_articles_2024_beyond.json', 'r', encoding='utf-8') as f:
            additional_articles = json.load(f)
            articles.extend(additional_articles)
    except FileNotFoundError:
        print("Warning: additional_articles_2024_beyond.json not found")
    
    return articles

def is_article_content(article):
    """Determine if this is actual article content vs profile/listing page"""
    title = article.get('title', '').lower()
    content = article.get('content', '').lower()
    file_path = article.get('file_path', '').lower()
    
    # Skip author profile pages
    if ('dailyforex-authors' in file_path or 
        'dailyforex authors' in title or
        'published articles:' in content):
        return False
    
    # Skip listing/category pages
    skip_keywords = [
        'latest 10 articles',
        'published articles:',
        'category:',
        'archive:',
        'tag:'
    ]
    
    for keyword in skip_keywords:
        if keyword in content:
            return False
    
    # Must have substantial content
    if len(content) < 300:
        return False
    
    # Must have trading/finance related keywords
    trading_keywords = [
        'forex', 'trading', 'market', 'price', 'analysis', 'chart',
        'bitcoin', 'crypto', 'usd', 'eur', 'gbp', 'gold', 'oil',
        'economic', 'financial', 'investment', 'broker'
    ]
    
    has_trading_content = any(keyword in content for keyword in trading_keywords)
    
    return has_trading_content

def get_random_author(available_authors):
    """Get a random author from the available list"""
    return random.choice(available_authors)

def prepare_articles_with_random_authors():
    """Prepare articles with random author attribution"""
    print("Loading articles...")
    all_articles = load_articles()
    
    # Filter to actual articles
    actual_articles = [article for article in all_articles if is_article_content(article)]
    print(f"Filtered {len(actual_articles)} actual articles from {len(all_articles)} total entries")
    
    # Available authors for random assignment
    available_authors = [
        ('Adam Lemon', 'adam-lemon'),
        ('Christopher Lewis', 'christopher-lewis'),
        ('Crispus Nyaga', 'crispus-nyaga'),
        ('Amir Issa', 'amir-issa'),
        ('Cliff Wachtel', 'cliff-wachtel'),
        ('Dmitri Speck', 'dmitri-speck'),
        ('Jarratt Davis', 'jarratt-davis'),
        ('Jens Klatt', 'jens-klatt'),
        ('Kathy Lien', 'kathy-lien'),
        ('Luc Luyet', 'luc-luyet'),
        ('Mahmoud Alkudsi', 'mahmoud-alkudsi'),
        ('Mati Greenspan', 'mati-greenspan'),
        ('Sonia Salinas', 'sonia-salinas'),
        ('Vladimir Zernov', 'vladimir-zernov'),
        ('Yohay Elam', 'yohay-elam'),
        ('Jordan Finneseth', 'jordan-finneseth'),
        ('Kenny Fisher', 'kenny-fisher'),
        ('Nancy Lubale', 'nancy-lubale'),
        ('Robert Petrucci', 'robert-petrucci')
    ]
    
    prepared_articles = []
    author_stats = defaultdict(int)
    
    # Set random seed for reproducible results
    random.seed(42)
    
    for article in actual_articles:
        # Randomly assign an author
        author_name, author_slug = get_random_author(available_authors)
        
        author_stats[author_name] += 1
        
        # Prepare article data
        title = article.get('title', '').strip()
        content = article.get('content', '').strip()
        
        prepared_article = {
            'title': title,
            'slug': create_slug_from_title(title),
            'content': content,
            'excerpt': article.get('description', '').strip()[:500] or content[:500],
            'author_slug': author_slug,
            'author_name': author_name,
            'published_at': format_date(article.get('published_date')),
            'status': 'published',
            'featured_image': None,
            'meta_title': title[:60],
            'meta_description': (article.get('description', '').strip()[:160] or content[:160]),
            'original_file': article.get('file_path', ''),
            'category_id': 1
        }
        
        prepared_articles.append(prepared_article)
    
    # Save results
    with open('prepared_articles_random_authors.json', 'w', encoding='utf-8') as f:
        json.dump(prepared_articles, f, indent=2, ensure_ascii=False)
    
    with open('random_author_distribution.json', 'w', encoding='utf-8') as f:
        json.dump({
            'author_distribution': dict(author_stats),
            'total_articles': len(prepared_articles),
            'available_authors': [name for name, slug in available_authors]
        }, f, indent=2, ensure_ascii=False)
    
    print(f"Prepared {len(prepared_articles)} articles with random author attribution")
    print(f"Author distribution: {dict(author_stats)}")
    
    return prepared_articles

def create_slug_from_title(title):
    """Create a URL-friendly slug from title"""
    if not title:
        return 'untitled'
    
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    
    return slug[:100]

def format_date(date_str):
    """Format date string for database"""
    if not date_str:
        return datetime.now().isoformat()
    
    try:
        if 'T' in date_str:
            return date_str
        else:
            dt = datetime.strptime(date_str, '%m/%d/%Y')
            return dt.isoformat()
    except:
        try:
            dt = datetime.strptime(date_str, '%Y-%m-%d')
            return dt.isoformat()
        except:
            return datetime.now().isoformat()

if __name__ == '__main__':
    prepare_articles_with_random_authors()