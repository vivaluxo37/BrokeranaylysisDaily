import json
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

def analyze_migration_data():
    """Analyze migrated data and compare with database"""
    
    # Current database counts (from Supabase queries)
    db_stats = {
        'articles': 62,
        'brokers': 113,
        'authors': 6
    }
    
    # Existing authors in database
    existing_authors = [
        'Adam Lemon',
        'Broker Analysis', 
        'Jordan Finneseth',
        'Kenny Fisher',
        'Nancy Lubale',
        'Robert Petrucci'
    ]
    
    # Load migrated data
    migration_dir = '../migration_2024_beyond'
    
    # Load articles
    articles_2024 = load_json_file(os.path.join(migration_dir, 'articles_2024_beyond.json'))
    additional_articles = load_json_file(os.path.join(migration_dir, 'additional_articles_2024_beyond.json'))
    
    # Load brokers
    brokers_2024 = load_json_file(os.path.join(migration_dir, 'brokers_2024_beyond.json'))
    brokers_basic_2024 = load_json_file(os.path.join(migration_dir, 'brokers_basic_2024_beyond.json'))
    
    # Analysis results
    analysis = {
        'database_current': db_stats,
        'migration_data': {
            'articles_original': len(articles_2024),
            'articles_additional': len(additional_articles),
            'articles_total': len(articles_2024) + len(additional_articles),
            'brokers_enhanced': len(brokers_2024),
            'brokers_basic': len(brokers_basic_2024),
            'brokers_total': len(brokers_2024) + len(brokers_basic_2024)
        },
        'new_authors_found': [],
        'potential_duplicates': {
            'articles': [],
            'brokers': []
        },
        'recommendations': []
    }
    
    # Extract unique authors from additional articles
    authors_found = set()
    for article in additional_articles:
        if 'title' in article and 'DailyForex Authors' in article['title']:
            # Extract author name from title
            author_name = article['title'].replace(' - DailyForex Authors.com', '')
            if author_name not in existing_authors:
                authors_found.add(author_name)
    
    analysis['new_authors_found'] = list(authors_found)
    
    # Check for potential article duplicates by title similarity
    article_titles = []
    for article in articles_2024 + additional_articles:
        if 'title' in article:
            article_titles.append(article['title'])
    
    # Simple duplicate detection (exact title matches)
    seen_titles = set()
    for title in article_titles:
        if title in seen_titles:
            analysis['potential_duplicates']['articles'].append(title)
        seen_titles.add(title)
    
    # Generate recommendations
    if analysis['new_authors_found']:
        analysis['recommendations'].append(f"Add {len(analysis['new_authors_found'])} new authors to database")
    
    if analysis['migration_data']['articles_total'] > 0:
        analysis['recommendations'].append(f"Consider adding {analysis['migration_data']['articles_total']} new articles")
    
    if analysis['migration_data']['brokers_total'] > db_stats['brokers']:
        analysis['recommendations'].append(f"Review broker data - migration has {analysis['migration_data']['brokers_total']} vs database {db_stats['brokers']}")
    
    if analysis['potential_duplicates']['articles']:
        analysis['recommendations'].append(f"Review {len(analysis['potential_duplicates']['articles'])} potential duplicate articles")
    
    # Save analysis results
    output_file = 'database_comparison_analysis.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(analysis, f, indent=2, ensure_ascii=False)
    
    print("\n=== DATABASE COMPARISON ANALYSIS ===")
    print(f"\nCurrent Database:")
    print(f"  Articles: {db_stats['articles']}")
    print(f"  Brokers: {db_stats['brokers']}")
    print(f"  Authors: {db_stats['authors']}")
    
    print(f"\nMigration Data Found:")
    print(f"  Articles (original): {analysis['migration_data']['articles_original']}")
    print(f"  Articles (additional): {analysis['migration_data']['articles_additional']}")
    print(f"  Articles (total): {analysis['migration_data']['articles_total']}")
    print(f"  Brokers (enhanced): {analysis['migration_data']['brokers_enhanced']}")
    print(f"  Brokers (basic): {analysis['migration_data']['brokers_basic']}")
    print(f"  Brokers (total): {analysis['migration_data']['brokers_total']}")
    
    print(f"\nNew Authors Found: {len(analysis['new_authors_found'])}")
    for author in analysis['new_authors_found']:
        print(f"  - {author}")
    
    print(f"\nRecommendations:")
    for rec in analysis['recommendations']:
        print(f"  - {rec}")
    
    print(f"\nDetailed analysis saved to: {output_file}")
    
    return analysis

if __name__ == "__main__":
    analyze_migration_data()