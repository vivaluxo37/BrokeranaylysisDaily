#!/usr/bin/env python3
"""
News Content Migration Script using MCP Supabase Server
Migrates news articles from DailyForex to BrokerAnalysis Supabase database
"""

import os
import json
import re
from datetime import datetime
from pathlib import Path
from bs4 import BeautifulSoup
import subprocess
import sys

class NewsContentMigrator:
    def __init__(self):
        # Base paths
        self.base_path = Path("C:/Users/LENOVO/Desktop/BrokeranalysisDaily/daily forex/www.dailyforex.com")
        self.news_path = self.base_path / "forex-news"
        self.project_id = "gngjezgilmdnjffxwquo"
        
    def update_brand_references(self, content):
        """Update DailyForex brand references to BrokerAnalysis"""
        if not content:
            return content
            
        # Brand name updates
        content = re.sub(r'\bDailyForex\b', 'BrokerAnalysis', content, flags=re.IGNORECASE)
        content = re.sub(r'\bdailyforex\.com\b', 'brokeranalysis.com', content, flags=re.IGNORECASE)
        
        # Contact information updates
        content = re.sub(r'\b\+1-[0-9-()\s]+\b', '(801)-893-2577', content)
        
        # Address updates
        old_addresses = [
            r'\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd)[^,]*,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}',
            r'\d+\s+[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}'
        ]
        
        new_address = "30 N Gould St Ste R, Sheridan, WY 82801, US"
        for pattern in old_addresses:
            content = re.sub(pattern, new_address, content)
            
        return content
        
    def extract_date_from_path(self, file_path):
        """Extract publication date from file path"""
        path_str = str(file_path)
        
        # Try to extract date from path like /2025/03/article-name/
        date_match = re.search(r'/(\d{4})/(\d{2})/', path_str)
        if date_match:
            year, month = date_match.groups()
            # Default to first day of month if no specific day found
            day = "01"
            
            # Try to extract day from article name
            day_match = re.search(r'-(\d{1,2})-', path_str)
            if day_match:
                day = day_match.group(1).zfill(2)
                
            try:
                return datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d")
            except ValueError:
                pass
                
        return datetime.now()
        
    def generate_slug(self, title, file_path):
        """Generate URL-friendly slug from title or file path"""
        if title:
            # Use title to generate slug
            slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
            slug = re.sub(r'\s+', '-', slug.strip())
            slug = re.sub(r'-+', '-', slug)
            return slug[:100]  # Limit length
        else:
            # Use file path as fallback
            path_parts = Path(file_path).parts
            if len(path_parts) > 1:
                return path_parts[-2]  # Use directory name
            return "news-article"
            
    def extract_basic_metadata(self, file_path):
        """Extract basic metadata from HTML file"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            soup = BeautifulSoup(content, 'html.parser')
            
            # Extract title
            title = ""
            title_tag = soup.find('title')
            if title_tag:
                title = title_tag.get_text().strip()
            
            # Extract meta description
            description = ""
            desc_tag = soup.find('meta', {'name': 'description'})
            if desc_tag:
                description = desc_tag.get('content', '').strip()
                
            # Extract OG tags
            og_title = ""
            og_desc = ""
            og_image = ""
            
            og_title_tag = soup.find('meta', {'property': 'og:title'})
            if og_title_tag:
                og_title = og_title_tag.get('content', '').strip()
                
            og_desc_tag = soup.find('meta', {'property': 'og:description'})
            if og_desc_tag:
                og_desc = og_desc_tag.get('content', '').strip()
                
            og_image_tag = soup.find('meta', {'property': 'og:image'})
            if og_image_tag:
                og_image = og_image_tag.get('content', '').strip()
                
            # Extract canonical URL
            canonical = ""
            canonical_tag = soup.find('link', {'rel': 'canonical'})
            if canonical_tag:
                canonical = canonical_tag.get('href', '').strip()
                
            return {
                'title': title,
                'description': description,
                'og_title': og_title,
                'og_description': og_desc,
                'og_image': og_image,
                'canonical_url': canonical
            }
            
        except Exception as e:
            print(f"Error extracting metadata from {file_path}: {e}")
            return {}
            
    def escape_sql_string(self, text):
        """Escape single quotes for SQL"""
        if not text:
            return ''
        return text.replace("'", "''")
            
    def migrate_news_article(self, file_path):
        """Migrate a single news article to Supabase using MCP"""
        try:
            # Extract basic metadata
            metadata = self.extract_basic_metadata(file_path)
            
            if not metadata.get('title'):
                # Generate title from file path
                path_parts = Path(file_path).parts
                if len(path_parts) > 1:
                    title = path_parts[-2].replace('-', ' ').title()
                else:
                    title = f"News Article - {Path(file_path).stem}"
            else:
                title = metadata['title']
                
            # Update brand references in title
            title = self.update_brand_references(title)
            
            # Create summary from description or title
            summary = metadata.get('description', '')
            if not summary:
                summary = title[:200] + "..." if len(title) > 200 else title
            summary = self.update_brand_references(summary)
            
            # Generate slug
            slug = self.generate_slug(title, file_path)
            
            # Extract publication date
            published_date = self.extract_date_from_path(file_path)
            
            # Determine category from path
            category = "forex"  # Default
            if "financial-news" in str(file_path):
                category = "financial"
            elif "commodities-news" in str(file_path):
                category = "commodities"
            elif "stocks-news" in str(file_path):
                category = "stocks"
                
            # Extract tags from title and description
            tags = []
            content_text = (title + " " + summary).lower()
            if "bitcoin" in content_text or "btc" in content_text:
                tags.append("bitcoin")
            if "forex" in content_text:
                tags.append("forex")
            if "inflation" in content_text:
                tags.append("inflation")
            if "fed" in content_text or "federal reserve" in content_text:
                tags.append("federal-reserve")
            if "ecb" in content_text:
                tags.append("ecb")
            if "interest rate" in content_text or "rates" in content_text:
                tags.append("interest-rates")
                
            # Create placeholder content
            content = f"This article was migrated from DailyForex. Original title: {metadata.get('title', 'N/A')}\n\n"
            content += f"Summary: {summary}\n\n"
            content += "Content extraction from the original obfuscated HTML file is pending manual review."
            content = self.update_brand_references(content)
            
            # Escape strings for SQL
            title_escaped = self.escape_sql_string(title)
            content_escaped = self.escape_sql_string(content)
            summary_escaped = self.escape_sql_string(summary)
            slug_escaped = self.escape_sql_string(slug)
            meta_desc_escaped = self.escape_sql_string(self.update_brand_references(metadata.get('description', '')))
            canonical_escaped = self.escape_sql_string(self.update_brand_references(metadata.get('canonical_url', '')))
            og_title_escaped = self.escape_sql_string(self.update_brand_references(metadata.get('og_title', '')))
            og_desc_escaped = self.escape_sql_string(self.update_brand_references(metadata.get('og_description', '')))
            og_image_escaped = self.escape_sql_string(metadata.get('og_image', ''))
            source_file_escaped = self.escape_sql_string(str(file_path))
            
            # Format tags array for PostgreSQL
            tags_formatted = "ARRAY[" + ",".join([f"'{tag}'" for tag in tags]) + "]" if tags else "ARRAY[]::text[]"
                
            # Create SQL query
            sql_query = f"""
            INSERT INTO news_articles (
                title, content, summary, slug, category, published_date, status,
                meta_description, canonical_url, og_title, og_description, og_image,
                source_file, tags
            ) VALUES (
                '{title_escaped}',
                '{content_escaped}',
                '{summary_escaped}',
                '{slug_escaped}',
                '{category}',
                '{published_date.isoformat()}',
                'draft',
                '{meta_desc_escaped}',
                '{canonical_escaped}',
                '{og_title_escaped}',
                '{og_desc_escaped}',
                '{og_image_escaped}',
                '{source_file_escaped}',
                {tags_formatted}
            ) RETURNING id, title;
            """
            
            # Save SQL to temp file for MCP execution
            temp_sql_file = Path("temp_insert.sql")
            with open(temp_sql_file, 'w', encoding='utf-8') as f:
                f.write(sql_query)
            
            print(f"✓ Prepared SQL for: {title[:50]}...")
            return sql_query
                
        except Exception as e:
            print(f"✗ Error preparing migration for {file_path}: {e}")
            return None
            
    def collect_news_files(self):
        """Collect all news HTML files from 2024+ directories"""
        news_files = []
        
        # Check forex-news directory
        for year_dir in self.news_path.iterdir():
            if year_dir.is_dir() and year_dir.name.isdigit():
                year = int(year_dir.name)
                if year >= 2024:  # Only 2024+ content
                    for month_dir in year_dir.iterdir():
                        if month_dir.is_dir():
                            for article_dir in month_dir.iterdir():
                                if article_dir.is_dir():
                                    # Look for HTML files in article directory
                                    for html_file in article_dir.glob('*.html'):
                                        news_files.append(str(html_file))
                                        
        return news_files
        
    def migrate_all_news(self):
        """Migrate all news content"""
        print("Starting news content migration...")
        
        # Collect all news files
        news_files = self.collect_news_files()
        print(f"Found {len(news_files)} news files to migrate")
        
        if not news_files:
            print("No news files found for migration")
            return
            
        # Process files and collect SQL queries
        sql_queries = []
        
        for i, file_path in enumerate(news_files[:10], 1):  # Limit to first 10 for testing
            print(f"\nProcessing {i}/10: {Path(file_path).name}")
            
            sql_query = self.migrate_news_article(file_path)
            if sql_query:
                sql_queries.append(sql_query)
                
        # Save all SQL queries to a file
        output_file = Path("news_migration_queries.sql")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("-- News Articles Migration SQL\n\n")
            for i, query in enumerate(sql_queries, 1):
                f.write(f"-- Article {i}\n")
                f.write(query)
                f.write("\n\n")
                
        print(f"\n=== Migration Summary ===")
        print(f"Total files processed: {min(len(news_files), 10)}")
        print(f"SQL queries prepared: {len(sql_queries)}")
        print(f"SQL file saved to: {output_file}")
        print("\nNext step: Execute the SQL queries using MCP Supabase server")
        
if __name__ == "__main__":
    migrator = NewsContentMigrator()
    
    # Run migration
    migrator.migrate_all_news()