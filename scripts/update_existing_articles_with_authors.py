#!/usr/bin/env python3
"""
Update existing articles in Supabase with random author assignments
This script assigns authors to articles that currently have NULL author_id values
"""

import json
import os
import random
from datetime import datetime

def load_prepared_articles():
    """Load the prepared articles with random authors from JSON file"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    articles_file = os.path.join(script_dir, 'prepared_articles_random_authors.json')
    
    with open(articles_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_author_mapping():
    """Create mapping from author slug to UUID based on Supabase data"""
    return {
        'adam-lemon': 'c0870ab6-d417-47b7-9fae-53a25197f573',
        'amir-issa': 'ab258406-f18d-4b84-a022-9c3b893bacfd',
        'broker-analysis': '7d06be13-78cb-4c9e-adc1-8e381c551cbb',
        'christopher-lewis': '1390995c-17de-4f9e-9d9f-598280375bc3',
        'cliff-wachtel': 'f6309044-c235-4145-b2d5-386156dcc32a',
        'crispus-nyaga': '1972d21a-84a8-4ad9-a9b0-1defc8732c00',
        'dmitri-speck': '030695b2-4c96-4c83-b837-bd11434fe982',
        'jarratt-davis': 'ef54d377-56f8-4a11-b098-5ee450fdd139',
        'jens-klatt': 'bc1ffac5-0a61-407e-b49e-d223eca56ca9',
        'jordan-finneseth': '85df8fd0-47ee-4bbb-ac2e-259b43d71e48',
        'kathy-lien': '3b0f0bb0-6498-4755-a03b-e1f58681725e',
        'kenny-fisher': '8e44030f-679b-4e3b-92ff-d8f8acc9b970',
        'luc-luyet': '4a384f4a-5ec5-4535-9fbb-c4adec76007b',
        'mahmoud-alkudsi': '7fe3a1fd-9379-4b94-a584-48467130f9a3',
        'mati-greenspan': 'bd08ef61-e6c7-4243-af60-3ed5c9f45bb5',
        'nancy-lubale': '2b43d904-cafd-4bd2-b260-6fefe30b4583',
        'robert-petrucci': 'cd73571d-8f37-404e-bfbc-d3f9523bdf0f',
        'sonia-salinas': '6e31aeda-af70-4160-b378-f371cb2d3691',
        'vladimir-zernov': '81dd6558-3345-4b6d-9b06-3f7334304129',
        'yohay-elam': 'b7cb954e-27a1-4895-9b68-6eb9bdb4e897'
    }

def create_update_queries(articles, batch_size=20):
    """Create batched UPDATE queries for articles"""
    author_mapping = get_author_mapping()
    queries = []
    
    # Create a mapping from slug to author for our prepared articles
    slug_to_author = {}
    for article in articles:
        slug_to_author[article['slug']] = article['author_slug']
    
    # Process articles in batches
    article_slugs = list(slug_to_author.keys())
    for i in range(0, len(article_slugs), batch_size):
        batch_slugs = article_slugs[i:i + batch_size]
        
        # Create CASE statement for batch update
        case_statements = []
        slug_list = []
        
        for slug in batch_slugs:
            author_slug = slug_to_author[slug]
            author_id = author_mapping.get(author_slug, author_mapping['broker-analysis'])
            case_statements.append(f"WHEN slug = '{slug}' THEN '{author_id}'")
            slug_list.append(f"'{slug}'")
        
        query = f"""
UPDATE articles 
SET author_id = CASE 
    {chr(10).join(case_statements)}
    ELSE author_id 
END
WHERE slug IN ({', '.join(slug_list)}) AND author_id IS NULL;"""
        
        queries.append(query)
    
    return queries

def save_queries_to_file(queries, filename='update_articles_authors.sql'):
    """Save SQL queries to file"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_file = os.path.join(script_dir, filename)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- Update existing articles with author assignments\n")
        f.write(f"-- Generated on: {datetime.now().isoformat()}\n\n")
        
        for i, query in enumerate(queries, 1):
            f.write(f"-- Batch {i}\n\n")
            f.write(query)
            f.write("\n\n")
    
    return output_file

def main():
    """Main function to process and generate update queries"""
    print("Loading prepared articles with random authors...")
    articles = load_prepared_articles()
    
    print(f"Processing {len(articles)} articles...")
    
    # Create SQL queries
    queries = create_update_queries(articles)
    
    # Save to file
    output_file = save_queries_to_file(queries)
    
    print(f"\n=== Update Summary ===")
    print(f"Total articles to update: {len(articles)}")
    print(f"Number of update batches: {len(queries)}")
    print(f"SQL file saved: {output_file}")
    
    # Show author distribution
    author_counts = {}
    for article in articles:
        author = article['author_name']
        author_counts[author] = author_counts.get(author, 0) + 1
    
    print(f"\n=== Author Distribution ===")
    for author, count in sorted(author_counts.items()):
        print(f"{author}: {count} articles")
    
    print(f"\n=== Next Steps ===")
    print(f"1. Review the generated SQL file: {output_file}")
    print(f"2. Execute the update queries in your Supabase database")
    print(f"3. Verify the updates were successful")

if __name__ == "__main__":
    main()