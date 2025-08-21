import json
import re
import os
from datetime import datetime

def load_json_file(file_path):
    """Load JSON data from file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return []

def extract_author_from_file_path(file_path):
    """Extract author name from file path, especially for author profile pages"""
    if not file_path:
        return None
    
    path_lower = file_path.lower()
    
    # Check for author profile pages
    if 'dailyforex-authors' in path_lower:
        # Extract author slug from filename
        filename = os.path.basename(file_path)
        author_slug = filename.replace('.html', '')
        
        # Map common author slugs to proper names
        author_mapping = {
            'adam-lemon': 'Adam Lemon',
            'amir-issa': 'Amir Issa',
            'christopher-lewis': 'Christopher Lewis',
            'cliff-wachtel': 'Cliff Wachtel',
            'crispus-nyaga': 'Crispus Nyaga',
            'dfx-team': 'DailyForex.com Team',
            'huzefa-hamid': 'Huzefa Hamid'
        }
        
        return author_mapping.get(author_slug, None)
    
    # Check for specific author names in path
    author_patterns = [
        'adam-lemon', 'amir-issa', 'christopher-lewis', 'cliff-wachtel',
        'crispus-nyaga', 'huzefa-hamid', 'dfx-team'
    ]
    
    for pattern in author_patterns:
        if pattern in path_lower:
            author_mapping = {
                'adam-lemon': 'Adam Lemon',
                'amir-issa': 'Amir Issa',
                'christopher-lewis': 'Christopher Lewis',
                'cliff-wachtel': 'Cliff Wachtel',
                'crispus-nyaga': 'Crispus Nyaga',
                'dfx-team': 'DailyForex.com Team',
                'huzefa-hamid': 'Huzefa Hamid'
            }
            return author_mapping.get(pattern, None)
    
    return None

def extract_author_from_title(title):
    """Extract author name from article title"""
    if not title:
        return None
    
    # Check for author profile page titles
    if ' - DailyForex Authors.com' in title:
        author_name = title.replace(' - DailyForex Authors.com', '').strip()
        return author_name
    
    # Check for "by Author Name" patterns
    by_patterns = [
        r'by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        r'By\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        r'BY\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'
    ]
    
    for pattern in by_patterns:
        match = re.search(pattern, title)
        if match:
            return match.group(1).strip()
    
    return None

def slug_to_name(slug):
    """Convert author slug to proper name"""
    name_mappings = {
        'adam-lemon': 'Adam Lemon',
        'amir-issa': 'Amir Issa',
        'christopher-lewis': 'Christopher Lewis',
        'cliff-wachtel': 'Cliff Wachtel',
        'crispus-nyaga': 'Crispus Nyaga',
        'dmitri-speck': 'Dmitri Speck',
        'jarratt-davis': 'Jarratt Davis',
        'jens-klatt': 'Jens Klatt',
        'kathy-lien': 'Kathy Lien',
        'luc-luyet': 'Luc Luyet',
        'mahmoud-alkudsi': 'Mahmoud Alkudsi',
        'mati-greenspan': 'Mati Greenspan',
        'sonia-salinas': 'Sonia Salinas',
        'vladimir-zernov': 'Vladimir Zernov',
        'yohay-elam': 'Yohay Elam'
    }
    
    return name_mappings.get(slug, slug.replace('-', ' ').title())

def extract_author_from_content(content, title):
    """Extract author name from article content or title using regex patterns"""
    if not content and not title:
        return None
    
    # Check if title contains author name
    if title and ' - DailyForex Authors.com' in title:
        return title.replace(' - DailyForex Authors.com', '').strip()
    
    # Known author names to look for
    known_authors = [
        'Adam Lemon', 'Amir Issa', 'Christopher Lewis', 'Cliff Wachtel',
        'Crispus Nyaga', 'Huzefa Hamid', 'Kenny Fisher', 'Nancy Lubale',
        'Robert Petrucci', 'Jordan Finneseth', 'James Hyerczyk', 'David Becker',
        'Jim Brown', 'Vladimir Zernov', 'Alex Popa', 'Elena Demy',
        'John Kicklighter', 'Martin Essex'
    ]
    
    # Check if any known author is mentioned in the content
    content_lower = (content or '').lower()
    title_lower = (title or '').lower()
    
    for author in known_authors:
        author_lower = author.lower()
        if author_lower in content_lower or author_lower in title_lower:
            return author
    
    # Common patterns for author attribution in content
    patterns = [
        r'By\s+([A-Z][a-z]+\s+[A-Z][a-z]+)',  # "By Author Name"
        r'Written by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)',  # "Written by Author Name"
        r'Author:\s*([A-Z][a-z]+\s+[A-Z][a-z]+)',  # "Author: Author Name"
        r'([A-Z][a-z]+\s+[A-Z][a-z]+)\s+writes',
        r'([A-Z][a-z]+\s+[A-Z][a-z]+)\s+reports',
        r'([A-Z][a-z]+\s+[A-Z][a-z]+)\s+notes',
        r'([A-Z][a-z]+\s+[A-Z][a-z]+)\s*-\s*DailyForex',  # "Author Name - DailyForex"
        r'Analysis by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)',  # "Analysis by Author Name"
        r'Forecast by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)',  # "Forecast by Author Name"
    ]
    
    search_text = (content or '') + ' ' + (title or '')
    
    for pattern in patterns:
        match = re.search(pattern, search_text[:1000])  # Check first 1000 chars
        if match:
            author_name = match.group(1).strip()
            if author_name and len(author_name.split()) == 2:  # Ensure it's a proper name
                return author_name
    
    return None

def determine_author_from_file_path(file_path):
    """Determine author based on file path patterns and directory structure"""
    if not file_path:
        return None
    
    # Convert to lowercase for easier matching
    path_lower = file_path.lower()
    
    # Check for specific author directories or patterns in path
    author_patterns = {
        'adam-lemon': ['adam', 'lemon'],
        'christopher-lewis': ['christopher', 'lewis'],
        'crispus-nyaga': ['crispus', 'nyaga'],
        'amir-issa': ['amir', 'issa'],
        'james-hyerczyk': ['james', 'hyerczyk'],
        'david-becker': ['david', 'becker'],
        'jim-brown': ['jim', 'brown'],
        'vladimir-zernov': ['vladimir', 'zernov'],
        'alex-popa': ['alex', 'popa'],
        'elena-demy': ['elena', 'demy'],
        'kenny-fisher': ['kenny', 'fisher'],
        'john-kicklighter': ['john', 'kicklighter'],
        'martin-essex': ['martin', 'essex']
    }
    
    for author_slug, keywords in author_patterns.items():
        if all(keyword in path_lower for keyword in keywords):
            return author_slug
    
    return None

def create_author_slug(name):
    """Create a slug from author name"""
    return name.lower().replace(' ', '-')

def is_article_content(article):
    """Determine if the content represents an actual article vs author profile/listing page"""
    title = article.get('title', '').lower()
    content = article.get('content', '').lower()
    description = article.get('description', '').lower()
    
    # Skip author profile pages
    if 'dailyforex authors.com' in title:
        return False
    
    # Skip listing/category pages
    skip_keywords = [
        'published articles:', 'latest articles', 'recent articles',
        'category:', 'tag:', 'archive:', 'page ', 'articles by',
        'author profile', 'about the author', 'latest 10 articles'
    ]
    
    for keyword in skip_keywords:
        if keyword in title or keyword in description or keyword in content[:200]:
            return False
    
    # Check if content is substantial enough to be an article
    if len(content) < 300:  # Minimum content length
        return False
    
    # Check for forex/trading related content indicators
    trading_indicators = [
        'forex', 'trading', 'usd', 'eur', 'gbp', 'jpy', 'analysis',
        'forecast', 'signal', 'chart', 'price', 'market', 'currency',
        'bitcoin', 'btc', 'crypto', 'pair', 'support', 'resistance'
    ]
    
    has_trading_content = any(indicator in content for indicator in trading_indicators)
    
    return has_trading_content

def prepare_articles_for_migration():
    """Prepare articles data for migration with proper author attribution"""
    
    # Load the article data
    original_articles = load_json_file('../migration_2024_beyond/articles_2024_beyond.json')
    additional_articles = load_json_file('../migration_2024_beyond/additional_articles_2024_beyond.json')
    
    # Combine all articles
    all_articles = original_articles + additional_articles
    
    # Filter to only actual articles
    actual_articles = [article for article in all_articles if is_article_content(article)]
    
    print(f"Filtered {len(actual_articles)} actual articles from {len(all_articles)} total entries")
    
    # Known author mappings from database
    author_mappings = {
        'Adam Lemon': 'adam-lemon',
        'Broker Analysis': 'broker-analysis',
        'Jordan Finneseth': 'jordan-finneseth',
        'Kenny Fisher': 'kenny-fisher',
        'Nancy Lubale': 'nancy-lubale',
        'Robert Petrucci': 'robert-petrucci',
        'Crispus Nyaga': 'crispus-nyaga',
        'Amir Issa': 'amir-issa',
        'Christopher Lewis': 'christopher-lewis',
        'Cliff Wachtel': 'cliff-wachtel',
        'Dmitri Speck': 'dmitri-speck',
        'Jarratt Davis': 'jarratt-davis',
        'Jens Klatt': 'jens-klatt',
        'Kathy Lien': 'kathy-lien',
        'Luc Luyet': 'luc-luyet',
        'Mahmoud Alkudsi': 'mahmoud-alkudsi',
        'Mati Greenspan': 'mati-greenspan',
        'Sonia Salinas': 'sonia-salinas',
        'Vladimir Zernov': 'vladimir-zernov',
        'Yohay Elam': 'yohay-elam'
    }
    
    prepared_articles = []
    author_stats = {}
    skipped_articles = []
    
    for article in actual_articles:
        # Try multiple methods to extract author
        extracted_author = None
        
        # Method 1: From title (for author profile pages that might contain articles)
        extracted_author = extract_author_from_title(article.get('title', ''))
        
        # Method 2: From file path using new method
        if not extracted_author:
            author_slug = determine_author_from_file_path(article.get('file_path', ''))
            if author_slug:
                # Convert slug back to name for mapping
                for name, slug in author_mappings.items():
                    if slug == author_slug:
                        extracted_author = name
                        break
        
        # Method 3: From content/title
        if not extracted_author:
            extracted_author = extract_author_from_content(
                article.get('content', ''), 
                article.get('title', '')
            )
        
        # Determine the final author
        if extracted_author and extracted_author in author_mappings:
            author_slug = author_mappings[extracted_author]
            final_author = extracted_author
        else:
            # Default to Broker Analysis
            author_slug = 'broker-analysis'
            final_author = 'Broker Analysis'
            if extracted_author:
                print(f"Unknown author '{extracted_author}' for article: {article.get('title', '')[:50]}...")
        
        # Track author statistics
        if final_author not in author_stats:
            author_stats[final_author] = 0
        author_stats[final_author] += 1
        
        # Check if article has sufficient content
        content = article.get('content', '').strip()
        title = article.get('title', '').strip()
        
        if len(content) < 100 or len(title) < 5:
            skipped_articles.append({
                'title': title,
                'reason': 'Insufficient content',
                'content_length': len(content),
                'file_path': article.get('file_path', '')
            })
            continue
        
        # Prepare article data
        prepared_article = {
            'title': title,
            'slug': create_slug_from_title(title),
            'content': content,
            'excerpt': article.get('description', '').strip()[:500] or content[:500],
            'author_slug': author_slug,
            'author_name': final_author,
            'published_at': format_date(article.get('published_date')),
            'status': 'published',
            'featured_image': None,
            'meta_title': title[:60],
            'meta_description': (article.get('description', '').strip()[:160] or content[:160]),
            'original_file': article.get('file_path', ''),
            'category_id': 1  # Default category
        }
        
        prepared_articles.append(prepared_article)
    
    # Save prepared articles
    with open('prepared_articles_for_migration.json', 'w', encoding='utf-8') as f:
        json.dump(prepared_articles, f, indent=2, ensure_ascii=False)
    
    # Save author statistics
    with open('author_attribution_stats.json', 'w', encoding='utf-8') as f:
        json.dump({
            'author_distribution': author_stats,
            'total_articles': len(prepared_articles),
            'skipped_articles': len(skipped_articles),
            'skipped_details': skipped_articles[:10]  # First 10 skipped
        }, f, indent=2, ensure_ascii=False)
    
    print(f"Prepared {len(prepared_articles)} articles for migration")
    print(f"Skipped {len(skipped_articles)} articles due to insufficient content")
    print(f"Author distribution: {author_stats}")
    
    return prepared_articles

def create_slug_from_title(title):
    """Create a URL-friendly slug from title"""
    if not title:
        return 'untitled'
    
    # Convert to lowercase and replace spaces/special chars with hyphens
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    
    # Limit length
    return slug[:100]

def format_date(date_str):
    """Format date string for database"""
    if not date_str:
        return datetime.now().isoformat()
    
    try:
        # Try to parse various date formats
        if 'T' in date_str:
            return date_str
        else:
            # Assume it's a simple date format
            dt = datetime.strptime(date_str, '%m/%d/%Y')
            return dt.isoformat()
    except:
        try:
            dt = datetime.strptime(date_str, '%Y-%m-%d')
            return dt.isoformat()
        except:
            return datetime.now().isoformat()

if __name__ == '__main__':
    prepare_articles_for_migration()