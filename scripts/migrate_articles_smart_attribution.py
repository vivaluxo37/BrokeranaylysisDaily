import json
import re
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

def extract_author_profiles(articles):
    """Extract author information from author profile pages"""
    author_profiles = {}
    
    for article in articles:
        title = article.get('title', '')
        file_path = article.get('file_path', '')
        content = article.get('content', '')
        
        # Check if this is an author profile page
        if ('dailyforex-authors' in file_path.lower() or 
            'dailyforex authors' in title.lower()):
            
            # Extract author name from title
            author_match = re.search(r'^([A-Z][a-z]+\s+[A-Z][a-z]+)', title)
            if author_match:
                author_name = author_match.group(1)
                
                # Extract writing style indicators from content
                style_indicators = {
                    'uses_technical_analysis': bool(re.search(r'technical analysis|chart|support|resistance|trend', content, re.IGNORECASE)),
                    'focuses_on_fundamentals': bool(re.search(r'fundamental|economic|gdp|inflation|employment', content, re.IGNORECASE)),
                    'covers_crypto': bool(re.search(r'bitcoin|crypto|btc|ethereum', content, re.IGNORECASE)),
                    'covers_forex': bool(re.search(r'forex|currency|usd|eur|gbp', content, re.IGNORECASE)),
                    'covers_commodities': bool(re.search(r'gold|oil|commodity', content, re.IGNORECASE)),
                    'daily_analysis': bool(re.search(r'daily|forecast|outlook', content, re.IGNORECASE)),
                    'long_term_view': bool(re.search(r'long.?term|weekly|monthly', content, re.IGNORECASE))
                }
                
                author_profiles[author_name] = {
                    'slug': author_name.lower().replace(' ', '-'),
                    'style_indicators': style_indicators,
                    'content_sample': content[:500],
                    'profile_path': file_path
                }
    
    return author_profiles

def analyze_article_style(article):
    """Analyze article content to determine writing style"""
    content = article.get('content', '')
    title = article.get('title', '')
    
    style_score = {
        'uses_technical_analysis': 0,
        'focuses_on_fundamentals': 0,
        'covers_crypto': 0,
        'covers_forex': 0,
        'covers_commodities': 0,
        'daily_analysis': 0,
        'long_term_view': 0
    }
    
    # Technical analysis indicators
    if re.search(r'chart|technical|support|resistance|trend|breakout|pattern|fibonacci|moving average|rsi|macd', content + title, re.IGNORECASE):
        style_score['uses_technical_analysis'] += 2
    
    # Fundamental analysis indicators
    if re.search(r'fundamental|economic|gdp|inflation|employment|fed|central bank|interest rate|monetary policy', content + title, re.IGNORECASE):
        style_score['focuses_on_fundamentals'] += 2
    
    # Crypto focus
    if re.search(r'bitcoin|crypto|btc|ethereum|eth|blockchain|defi', content + title, re.IGNORECASE):
        style_score['covers_crypto'] += 3
    
    # Forex focus
    if re.search(r'forex|currency|usd|eur|gbp|jpy|cad|aud|nzd|chf|pair', content + title, re.IGNORECASE):
        style_score['covers_forex'] += 3
    
    # Commodities focus
    if re.search(r'gold|oil|commodity|crude|silver|copper', content + title, re.IGNORECASE):
        style_score['covers_commodities'] += 3
    
    # Daily analysis style
    if re.search(r'today|daily|forecast|outlook|signal|analysis', content + title, re.IGNORECASE):
        style_score['daily_analysis'] += 2
    
    # Long-term view
    if re.search(r'long.?term|weekly|monthly|quarterly|outlook', content + title, re.IGNORECASE):
        style_score['long_term_view'] += 2
    
    return style_score

def match_article_to_author(article, author_profiles):
    """Match article to most likely author based on style analysis"""
    article_style = analyze_article_style(article)
    
    best_match = None
    best_score = 0
    
    for author_name, profile in author_profiles.items():
        score = 0
        
        # Compare style indicators
        for indicator, article_score in article_style.items():
            if profile['style_indicators'].get(indicator, False) and article_score > 0:
                score += article_score
        
        # Bonus for specific author patterns
        content = article.get('content', '') + article.get('title', '')
        
        # Christopher Lewis patterns
        if author_name == 'Christopher Lewis':
            if re.search(r'daily chart|weekly chart|longer.?term|columbus', content, re.IGNORECASE):
                score += 5
        
        # Adam Lemon patterns
        elif author_name == 'Adam Lemon':
            if re.search(r'chief analyst|merrill lynch|trend|breakout', content, re.IGNORECASE):
                score += 5
        
        # Crispus Nyaga patterns
        elif author_name == 'Crispus Nyaga':
            if re.search(r'bearish|bullish|divergence|signal|atfx|easymarkets', content, re.IGNORECASE):
                score += 5
        
        if score > best_score:
            best_score = score
            best_match = author_name
    
    # Only return match if score is significant
    return best_match if best_score >= 3 else None

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

def prepare_articles_with_smart_attribution():
    """Prepare articles with intelligent author attribution"""
    print("Loading articles...")
    all_articles = load_articles()
    
    print("Extracting author profiles...")
    author_profiles = extract_author_profiles(all_articles)
    print(f"Found {len(author_profiles)} author profiles: {list(author_profiles.keys())}")
    
    # Filter to actual articles
    actual_articles = [article for article in all_articles if is_article_content(article)]
    print(f"Filtered {len(actual_articles)} actual articles from {len(all_articles)} total entries")
    
    # Author mappings for database
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
    author_stats = defaultdict(int)
    attribution_details = []
    
    for article in actual_articles:
        # Try to match article to author
        matched_author = match_article_to_author(article, author_profiles)
        
        if matched_author and matched_author in author_mappings:
            author_slug = author_mappings[matched_author]
            final_author = matched_author
        else:
            # Default to Broker Analysis
            author_slug = 'broker-analysis'
            final_author = 'Broker Analysis'
        
        author_stats[final_author] += 1
        
        # Track attribution details for analysis
        attribution_details.append({
            'title': article.get('title', '')[:100],
            'matched_author': matched_author,
            'final_author': final_author,
            'file_path': article.get('file_path', '')
        })
        
        # Prepare article data
        title = article.get('title', '').strip()
        content = article.get('content', '').strip()
        
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
            'category_id': 1
        }
        
        prepared_articles.append(prepared_article)
    
    # Save results
    with open('prepared_articles_smart_attribution.json', 'w', encoding='utf-8') as f:
        json.dump(prepared_articles, f, indent=2, ensure_ascii=False)
    
    with open('smart_attribution_analysis.json', 'w', encoding='utf-8') as f:
        json.dump({
            'author_profiles_found': {name: profile['style_indicators'] for name, profile in author_profiles.items()},
            'author_distribution': dict(author_stats),
            'total_articles': len(prepared_articles),
            'attribution_details': attribution_details[:50]  # First 50 for analysis
        }, f, indent=2, ensure_ascii=False)
    
    print(f"Prepared {len(prepared_articles)} articles with smart attribution")
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
    prepare_articles_with_smart_attribution()