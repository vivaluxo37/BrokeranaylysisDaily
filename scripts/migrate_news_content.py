#!/usr/bin/env python3
"""
News Content Migration Script
Migrates news articles from DailyForex to BrokerAnalysis Supabase database
"""

import os
import json
import re
from datetime import datetime
from pathlib import Path
from supabase import create_client, Client
from bs4 import BeautifulSoup

class NewsContentMigrator:
    def __init__(self):
        # Supabase configuration
        self.supabase_url = "https://gngjezgilmdnjffxwquo.supabase.co"
        self.supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZ2plemppbG1kbmpmZnh3cXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NTQ5OTQsImV4cCI6MjA3MTIzMDk5NH0.jyLEY1NoQIkwpTykzcsBWGZtY8Y8mQAAZ2gSdsB2SlM"
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        
        # Base paths
        self.base_path = Path("C:/Users/LENOVO/Desktop/BrokeranalysisDaily/daily forex/www.dailyforex.com")
        self.news_path = self.base_path / "forex-news"
        
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
            
    def migrate_news_article(self, file_path):
        """Migrate a single news article to Supabase"""
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
                
            # Prepare article data
            article_data = {
                'title': title,
                'content': content,
                'summary': summary,
                'slug': slug,
                'category': category,
                'published_date': published_date.isoformat(),
                'status': 'draft',  # Set as draft since content needs review
                'meta_keywords': '',
                'meta_description': self.update_brand_references(metadata.get('description', '')),
                'canonical_url': self.update_brand_references(metadata.get('canonical_url', '')),
                'og_title': self.update_brand_references(metadata.get('og_title', '')),
                'og_description': self.update_brand_references(metadata.get('og_description', '')),
                'og_image': metadata.get('og_image', ''),
                'source_file': str(file_path),
                'tags': tags
            }
            
            # Insert into Supabase
            result = self.supabase.table('news_articles').insert(article_data).execute()
            
            if result.data:
                print(f"✓ Migrated: {title}")
                return True
            else:
                print(f"✗ Failed to migrate: {title}")
                return False
                
        except Exception as e:
            print(f"✗ Error migrating {file_path}: {e}")
            return False
            
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
            
        # Process files
        total_migrated = 0
        total_failed = 0
        
        for i, file_path in enumerate(news_files, 1):
            print(f"\nProcessing {i}/{len(news_files)}: {Path(file_path).name}")
            
            if self.migrate_news_article(file_path):
                total_migrated += 1
            else:
                total_failed += 1
                
        print(f"\n=== Migration Summary ===")
        print(f"Total files processed: {len(news_files)}")
        print(f"Successfully migrated: {total_migrated}")
        print(f"Failed: {total_failed}")
        print(f"Success rate: {(total_migrated/len(news_files)*100):.1f}%")
        
if __name__ == "__main__":
    migrator = NewsContentMigrator()
    
    # Run migration
    migrator.migrate_all_news()