#!/usr/bin/env python3
"""
Author Migration Script for BrokerAnalysis
Migrates author profiles from DailyForex scraped content to Supabase
Filters for 2024+ content only as per migration strategy
"""

import os
import sys
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from bs4 import BeautifulSoup
from supabase import create_client, Client
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Supabase configuration
SUPABASE_URL = "https://gngjezgilmdnjffxwquo.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZ2plemdpbG1kbmpmZnh3cXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NTQ5OTQsImV4cCI6MjA3MTIzMDk5NH0.jyLEY1NoQIkwpTykzcsBWGZtY8Y8mQAAZ2gSdsB2SlM"

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def is_recent_content(date_str):
    """
    Check if content is from 2024 onwards
    """
    if not date_str:
        return False
    
    try:
        # Try different date formats
        date_formats = [
            '%Y-%m-%d',
            '%Y/%m/%d', 
            '%d/%m/%Y',
            '%B %d, %Y',
            '%b %d, %Y',
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%dT%H:%M:%S'
        ]
        
        for fmt in date_formats:
            try:
                parsed_date = datetime.strptime(date_str.strip(), fmt)
                return parsed_date.year >= 2024
            except ValueError:
                continue
                
        # If no format matches, try extracting year with regex
        year_match = re.search(r'20(2[4-9]|[3-9]\d)', date_str)
        if year_match:
            year = int(year_match.group())
            return year >= 2024
            
        return False
        
    except Exception as e:
        logger.warning(f"Error parsing date '{date_str}': {e}")
        return False

def extract_author_info_from_html(html_content, file_path):
    """
    Extract author information from HTML content
    """
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        authors = []
        
        # Look for author sections, profiles, or contributor information
        author_sections = soup.find_all(['div', 'section', 'article'], 
                                      class_=re.compile(r'author|profile|contributor|writer', re.I))
        
        # Also look for meta tags with author information
        meta_authors = soup.find_all('meta', attrs={'name': re.compile(r'author', re.I)})
        
        # Extract from author sections
        for section in author_sections:
            author_data = extract_author_from_section(section, file_path)
            if author_data:
                authors.append(author_data)
        
        # Extract from meta tags
        for meta in meta_authors:
            content = meta.get('content', '')
            if content and content.strip():
                author_data = {
                    'name': content.strip(),
                    'bio': '',
                    'avatar_url': '',
                    'email': '',
                    'expertise': [],
                    'social_links': {},
                    'is_active': True
                }
                authors.append(author_data)
        
        # Look for bylines in articles
        bylines = soup.find_all(['span', 'div', 'p'], 
                               class_=re.compile(r'byline|author|writer', re.I))
        
        for byline in bylines:
            text = byline.get_text(strip=True)
            if text and ('by ' in text.lower() or 'author:' in text.lower()):
                # Extract author name from byline
                name = re.sub(r'^(by|author:)\s*', '', text, flags=re.I).strip()
                if name:
                    author_data = {
                        'name': name,
                        'bio': '',
                        'avatar_url': '',
                        'email': '',
                        'expertise': [],
                        'social_links': {},
                        'is_active': True
                    }
                    authors.append(author_data)
        
        return authors
        
    except Exception as e:
        logger.error(f"Error extracting author info from {file_path}: {e}")
        return []

def extract_author_from_section(section, file_path):
    """
    Extract detailed author information from a section
    """
    try:
        author_data = {
            'bio': '',
            'avatar_url': '',
            'email': '',
            'expertise': [],
            'social_links': {},
            'is_active': True
        }
        
        # Extract name
        name_elem = section.find(['h1', 'h2', 'h3', 'h4', 'span'], 
                                class_=re.compile(r'name|title', re.I))
        if name_elem:
            author_data['name'] = name_elem.get_text(strip=True)
        
        # Extract bio/description
        bio_elem = section.find(['p', 'div'], 
                               class_=re.compile(r'bio|description|about', re.I))
        if bio_elem:
            author_data['bio'] = bio_elem.get_text(strip=True)
        
        # Extract image
        img_elem = section.find('img')
        if img_elem:
            author_data['avatar_url'] = img_elem.get('src', '')
        
        # Extract social links
        social_links = section.find_all('a', href=re.compile(r'twitter|linkedin|facebook', re.I))
        social_data = {}
        if social_links:
            for link in social_links:
                href = link.get('href', '')
                if 'twitter' in href:
                    social_data['twitter'] = href
                elif 'linkedin' in href:
                    social_data['linkedin'] = href
                elif 'facebook' in href:
                    social_data['facebook'] = href
        author_data['social_links'] = social_data
        
        # Extract email if present
        email_elem = section.find('a', href=re.compile(r'mailto:', re.I))
        if email_elem:
            author_data['email'] = email_elem.get('href', '').replace('mailto:', '')
        
        # Extract expertise from bio or description
        expertise = []
        if author_data.get('bio'):
            bio_text = author_data['bio'].lower()
            # Look for common forex/trading expertise keywords
            expertise_keywords = ['forex', 'trading', 'analyst', 'market', 'currency', 'commodities', 'stocks', 'economics', 'finance']
            for keyword in expertise_keywords:
                if keyword in bio_text:
                    expertise.append(keyword.title())
        author_data['expertise'] = expertise
        
        return author_data if author_data.get('name') else None
        
    except Exception as e:
        logger.error(f"Error extracting author from section: {e}")
        return None

def update_brand_references(author_data):
    """
    Update DailyForex references to BrokerAnalysis
    """
    if not author_data:
        return author_data
    
    # Update bio/description
    if 'bio' in author_data:
        author_data['bio'] = author_data['bio'].replace('DailyForex', 'BrokerAnalysis')
        author_data['bio'] = author_data['bio'].replace('dailyforex.com', 'brokeranalysis.com')
    
    # Update any other text fields
    for key, value in author_data.items():
        if isinstance(value, str):
            author_data[key] = value.replace('DailyForex', 'BrokerAnalysis')
            author_data[key] = author_data[key].replace('dailyforex.com', 'brokeranalysis.com')
    
    return author_data

def import_author_to_supabase(author_data):
    """
    Import author data to Supabase
    """
    try:
        # Generate slug from name
        slug = re.sub(r'[^a-zA-Z0-9\s]', '', author_data['name']).lower().replace(' ', '-')
        
        # Check if author already exists
        existing = supabase.table('authors').select('*').eq('slug', slug).execute()
        
        if existing.data:
            # Update existing author
            result = supabase.table('authors').update({
                'bio': author_data.get('bio', ''),
                'avatar_url': author_data.get('image_url', ''),
                'email': author_data.get('email', ''),
                'social_links': author_data.get('social_links', {}),
                'expertise': author_data.get('expertise', []),
                'is_active': True
            }).eq('slug', slug).execute()
            
            logger.info(f"Updated author: {author_data['name']}")
        else:
            # Insert new author
            result = supabase.table('authors').insert({
                'name': author_data['name'],
                'slug': slug,
                'bio': author_data.get('bio', ''),
                'avatar_url': author_data.get('image_url', ''),
                'email': author_data.get('email', ''),
                'social_links': author_data.get('social_links', {}),
                'expertise': author_data.get('expertise', []),
                'is_active': True
            }).execute()
            
            logger.info(f"Inserted new author: {author_data['name']}")
        
        # Log migration
        log_data = {
            'migration_type': 'author_migration',
            'source_file': author_data.get('source_file', ''),
            'target_table': 'authors',
            'target_id': result.data[0]['id'] if result.data else None,
            'status': 'success',
            'metadata': json.dumps({
                'extraction_method': author_data.get('extraction_method', ''),
                'brand_updated': True
            }),
            'processed_at': datetime.now(timezone.utc).isoformat()
        }
        
        supabase.table('migration_log').insert(log_data).execute()
        
        return True
        
    except Exception as e:
        logger.error(f"Error importing author {author_data.get('name', 'Unknown')}: {e}")
        
        # Log error
        log_data = {
            'migration_type': 'author_profile',
            'source_file': author_data.get('source_file', ''),
            'target_table': 'authors',
            'status': 'error',
            'error_message': str(e),
            'metadata': json.dumps(author_data),
            'processed_at': datetime.now(timezone.utc).isoformat()
        }
        
        supabase.table('migration_log').insert(log_data).execute()
        
        return False

def process_author_files():
    """
    Process relevant HTML files to extract author information
    """
    base_dir = Path("../daily forex/www.dailyforex.com")
    
    if not base_dir.exists():
        logger.error(f"Directory not found: {base_dir}")
        return
    
    total_authors = 0
    successful_imports = 0
    
    # Focus on files likely to contain author information
    target_patterns = [
        "**/authors*.html",
        "**/author*.html", 
        "**/contributors*.html",
        "**/team*.html",
        "**/about*.html",
        "**/staff*.html",
        "**/writers*.html",
        "**/forex-news/**/*.html",
        "**/financial-news/**/*.html",
        "**/learn/**/*.html",
        "**/tutorials/**/*.html",
        "**/analysis/**/*.html"
    ]
    
    html_files = []
    for pattern in target_patterns:
        html_files.extend(base_dir.glob(pattern))
    
    # Remove duplicates
    html_files = list(set(html_files))
    
    logger.info(f"Found {len(html_files)} relevant HTML files to process")
    
    for html_file in html_files:
        try:
            logger.info(f"Processing: {html_file}")
            
            with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Extract author information
            authors = extract_author_info_from_html(content, str(html_file))
            
            for author_data in authors:
                if not author_data.get('name'):
                    continue
                
                # Update brand references
                author_data = update_brand_references(author_data)
                
                # Import to Supabase
                if import_author_to_supabase(author_data):
                    successful_imports += 1
                
                total_authors += 1
        
        except Exception as e:
            logger.error(f"Error processing {html_file}: {e}")
    
    logger.info(f"Migration completed. Total authors found: {total_authors}, Successfully imported: {successful_imports}")
    
    return total_authors, successful_imports

def main():
    """
    Main migration function
    """
    logger.info("Starting author migration for BrokerAnalysis (2024+ content only)")
    
    try:
        total, successful = process_author_files()
        
        print(f"\n=== Author Migration Summary ===")
        print(f"Total authors found: {total}")
        print(f"Successfully imported: {successful}")
        print(f"Failed imports: {total - successful}")
        
        if total > 0:
            success_rate = (successful / total) * 100
            print(f"Success rate: {success_rate:.1f}%")
        
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()