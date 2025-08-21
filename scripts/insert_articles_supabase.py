#!/usr/bin/env python3
"""
Script to insert articles using Supabase client with proper handling
"""

import json
import re
from pathlib import Path
from datetime import datetime

def parse_sql_values(sql_content):
    """Parse SQL INSERT VALUES and extract article data"""
    articles = []
    
    # Find all individual record patterns
    # Look for patterns like ('title', 'content', ...)
    pattern = r"\(\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',\s*([^,]*),\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)'\s*\)"
    
    # This is complex due to nested quotes, let's use a simpler approach
    # Split by ),\n( pattern
    lines = sql_content.split('),\n(')
    
    for i, line in enumerate(lines):
        try:
            # Clean up the line
            line = line.strip()
            if i == 0:
                # First line starts with VALUES (
                line = line.split('VALUES (', 1)[1] if 'VALUES (' in line else line
            if i == len(lines) - 1:
                # Last line ends with );
                line = line.rstrip(');')
            
            # Parse the values - this is a simplified parser
            # In production, use a proper SQL parser
            values = []
            current_value = ""
            in_quotes = False
            i = 0
            
            while i < len(line):
                char = line[i]
                
                if char == "'" and (i == 0 or line[i-1] != "'"):
                    if not in_quotes:
                        in_quotes = True
                        current_value = ""
                    else:
                        # Check if next char is also quote (escaped)
                        if i + 1 < len(line) and line[i + 1] == "'":
                            current_value += "'"
                            i += 1  # Skip next quote
                        else:
                            in_quotes = False
                            values.append(current_value.replace("''", "'"))
                            current_value = ""
                elif in_quotes:
                    current_value += char
                elif char == ',' and not in_quotes:
                    if current_value.strip() and current_value.strip() != 'NULL':
                        values.append(current_value.strip().strip("'"))
                    elif current_value.strip() == 'NULL':
                        values.append(None)
                    current_value = ""
                elif not in_quotes and char not in [' ', '\t']:
                    current_value += char
                    
                i += 1
            
            # Add last value
            if current_value.strip():
                if current_value.strip() == 'NULL':
                    values.append(None)
                else:
                    values.append(current_value.strip().strip("'").replace("''", "'"))
            
            # Map to article structure
            if len(values) >= 12:
                article = {
                    'title': values[0],
                    'content': values[1],
                    'summary': values[2],
                    'slug': values[3],
                    'category': values[4],
                    'author': values[5],
                    'published_date': values[6],
                    'status': values[7],
                    'created_at': values[8],
                    'updated_at': values[9],
                    'source_file': values[10],
                    'meta_description': values[11]
                }
                articles.append(article)
                
        except Exception as e:
            print(f"Error parsing line {i}: {e}")
            continue
    
    return articles

def create_insert_statements(articles, batch_size=10):
    """Create smaller INSERT statements"""
    statements = []
    
    for i in range(0, len(articles), batch_size):
        batch = articles[i:i + batch_size]
        
        # Create INSERT statement
        sql = "INSERT INTO news_articles (title, content, summary, slug, category, author, published_date, status, created_at, updated_at, source_file, meta_description) VALUES "
        
        values_parts = []
        for article in batch:
            # Properly escape each value
            title = article['title'].replace("'", "''") if article['title'] else ''
            content = article['content'].replace("'", "''") if article['content'] else ''
            summary = article['summary'].replace("'", "''") if article['summary'] else ''
            slug = article['slug'].replace("'", "''") if article['slug'] else ''
            category = article['category'].replace("'", "''") if article['category'] else ''
            author = article['author'].replace("'", "''") if article['author'] else ''
            published_date = 'NULL' if article['published_date'] is None else f"'{article['published_date']}'"
            status = article['status'].replace("'", "''") if article['status'] else ''
            created_at = article['created_at'].replace("'", "''") if article['created_at'] else ''
            updated_at = article['updated_at'].replace("'", "''") if article['updated_at'] else ''
            source_file = article['source_file'].replace("'", "''") if article['source_file'] else ''
            meta_description = article['meta_description'].replace("'", "''") if article['meta_description'] else ''
            
            value_part = f"('{title}', '{content}', '{summary}', '{slug}', '{category}', '{author}', {published_date}, '{status}', '{created_at}', '{updated_at}', '{source_file}', '{meta_description}')"
            values_parts.append(value_part)
        
        sql += ", ".join(values_parts) + ";"
        statements.append(sql)
    
    return statements

def process_batch_file(file_path, batch_name):
    """Process a single batch file"""
    try:
        print(f"Processing {batch_name}...")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        print(f"  - File size: {len(sql_content)} characters")
        
        # Parse articles from SQL
        articles = parse_sql_values(sql_content)
        print(f"  - Parsed {len(articles)} articles")
        
        if not articles:
            print(f"  ✗ No articles parsed from {batch_name}")
            return []
        
        # Create smaller INSERT statements
        statements = create_insert_statements(articles, batch_size=5)
        print(f"  - Created {len(statements)} INSERT statements")
        
        return statements
        
    except Exception as e:
        print(f"  ✗ Error processing {batch_name}: {e}")
        return []

def main():
    script_dir = Path(__file__).parent
    
    # Process first batch only for testing
    batch_file = script_dir / 'import_articles_batch_1.sql'
    
    if not batch_file.exists():
        print(f"File not found: {batch_file}")
        return
    
    statements = process_batch_file(batch_file, 'batch_1')
    
    if statements:
        # Save statements to files for manual execution
        for i, statement in enumerate(statements):
            output_file = script_dir / f'batch_1_part_{i+1}.sql'
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(statement)
            print(f"  - Saved: {output_file.name}")
        
        print(f"\nCreated {len(statements)} smaller SQL files for batch 1")
        print(f"Each file contains ~5 articles and can be executed individually")
    else:
        print("No statements created")

if __name__ == "__main__":
    main()