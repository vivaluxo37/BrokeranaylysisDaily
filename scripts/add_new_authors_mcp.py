#!/usr/bin/env python3
"""
Add New Authors to Supabase Database using MCP
Adds the 14 new authors discovered in migration data to BrokerAnalysis database
"""

import json
import re
from datetime import datetime, timezone

# List of new authors to add (from database_comparison_analysis.json)
NEW_AUTHORS = [
    "Crispus Nyaga",
    "Yvonne Kiambi", 
    "Warren Venketas",
    "Cliff Wachtel",
    "Marcel Deer",
    "DailyForex Press Release",
    "Usman Ahmed",
    "Huzefa Hamid",
    "DailyForex.com Team",
    "Amir Issa",
    "Christopher Lewis",
    "Mahmoud Abdallah",
    "Joel Agbo",
    "Tobi Amure"
]

def create_slug(name):
    """Create URL-friendly slug from author name"""
    # Remove special characters and convert to lowercase
    slug = re.sub(r'[^a-zA-Z0-9\s]', '', name).lower()
    # Replace spaces with hyphens
    slug = re.sub(r'\s+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    return slug

def update_brand_references(author_data):
    """Update any DailyForex references to Broker Analysis"""
    if 'bio' in author_data:
        author_data['bio'] = author_data['bio'].replace('DailyForex', 'Broker Analysis')
        author_data['bio'] = author_data['bio'].replace('Daily Forex', 'Broker Analysis')
    
    if 'name' in author_data:
        if 'DailyForex' in author_data['name']:
            author_data['name'] = author_data['name'].replace('DailyForex', 'Broker Analysis')
    
    return author_data

def prepare_author_data(name):
    """Prepare author data for insertion"""
    slug = create_slug(name)
    
    # Create bio based on author name
    if 'Press Release' in name:
        bio = 'Official press releases and announcements from Broker Analysis'
    elif 'Team' in name:
        bio = 'Content created by the Broker Analysis editorial team'
    else:
        bio = f'Financial analyst and writer at Broker Analysis specializing in forex and trading markets'
    
    author_data = {
        'name': name,
        'slug': slug,
        'bio': bio,
        'avatar_url': '',
        'email': '',
        'social_links': {},
        'expertise': ['forex', 'trading', 'market-analysis'],
        'is_active': True,
        'created_at': datetime.now(timezone.utc).isoformat(),
        'updated_at': datetime.now(timezone.utc).isoformat()
    }
    
    # Update brand references
    author_data = update_brand_references(author_data)
    
    return author_data

def generate_insert_sql():
    """Generate SQL INSERT statements for new authors"""
    sql_statements = []
    
    for author_name in NEW_AUTHORS:
        author_data = prepare_author_data(author_name)
        
        # Create INSERT statement
        sql = f"""
INSERT INTO authors (
    name, slug, bio, avatar_url, email, social_links, expertise, is_active, created_at, updated_at
) VALUES (
    '{author_data['name'].replace("'", "''")}',
    '{author_data['slug']}',
    '{author_data['bio'].replace("'", "''")}',
    '{author_data['avatar_url']}',
    '{author_data['email']}',
    '{json.dumps(author_data['social_links'])}',
    '{json.dumps(author_data['expertise'])}',
    {str(author_data['is_active']).lower()},
    '{author_data['created_at']}',
    '{author_data['updated_at']}'
);"""
        
        sql_statements.append(sql)
    
    return sql_statements

def save_sql_to_file(sql_statements):
    """Save SQL statements to file"""
    output_file = 'add_new_authors.sql'
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- Add New Authors to Supabase Database\n")
        f.write(f"-- Generated on: {datetime.now().isoformat()}\n")
        f.write(f"-- Total authors to add: {len(sql_statements)}\n\n")
        
        for i, sql in enumerate(sql_statements, 1):
            f.write(f"-- Author {i}: {NEW_AUTHORS[i-1]}\n")
            f.write(sql)
            f.write("\n\n")
    
    return output_file

def main():
    """Main function to generate author insertion SQL"""
    print("Generating SQL to add new authors to Supabase...")
    print(f"Authors to add: {len(NEW_AUTHORS)}")
    
    # Generate SQL statements
    sql_statements = generate_insert_sql()
    
    # Save to file
    output_file = save_sql_to_file(sql_statements)
    
    print(f"\n=== Author Addition Summary ===")
    print(f"Total new authors: {len(NEW_AUTHORS)}")
    print(f"SQL file generated: {output_file}")
    
    print(f"\n=== Authors to Add ===")
    for i, author in enumerate(NEW_AUTHORS, 1):
        slug = create_slug(author)
        print(f"{i:2d}. {author} (slug: {slug})")
    
    print(f"\n=== Next Steps ===")
    print(f"1. Review the generated SQL file: {output_file}")
    print(f"2. Execute the SQL in Supabase to add the authors")
    print(f"3. Verify all authors were added successfully")
    print(f"4. Update todo list to mark this task as completed")

if __name__ == "__main__":
    main()