#!/usr/bin/env python3
"""
RSS Feed Import Script for DailyForex to BrokerAnalysis Migration

This script imports RSS feeds from DailyForex XML files into Supabase database.
It processes forexarticles.xml, forexnews.xml, and fundamentalanalysis.xml files.
"""

import os
import sys
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import List, Dict, Optional
import re

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from supabase import create_client, Client
except ImportError:
    print("Error: supabase-py not installed. Run: pip install supabase")
    sys.exit(1)

# Supabase configuration
SUPABASE_URL = "https://gngjezgilmdnjffxwquo.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZ2plemdpbG1kbmpmZnh3cXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NTQ5OTQsImV4cCI6MjA3MTIzMDk5NH0.jyLEY1NoQIkwpTykzcsBWGZtY8Y8mQAAZ2gSdsB2SlM"

class RSSImporter:
    def __init__(self, supabase_url: str, supabase_key: str):
        """Initialize the RSS importer with Supabase client."""
        if not supabase_key:
            raise ValueError("Supabase key is required. Please set SUPABASE_KEY.")
        
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.feeds_processed = 0
        self.items_imported = 0
        self.errors = []
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text content."""
        if not text:
            return ""
        
        # Remove HTML entities and tags
        text = re.sub(r'&[a-zA-Z0-9#]+;', '', text)
        text = re.sub(r'<[^>]+>', '', text)
        
        # Normalize whitespace
        text = ' '.join(text.split())
        
        # Update brand references
        text = text.replace('DailyForex', 'BrokerAnalysis')
        text = text.replace('dailyforex', 'brokeranalysis')
        
        return text.strip()
    
    def parse_date(self, date_str: str) -> Optional[str]:
        """Parse RSS date format to ISO format."""
        try:
            # RSS date format: Wed, 13 Aug 2025 09:43:35 GMT
            dt = datetime.strptime(date_str, '%a, %d %b %Y %H:%M:%S %Z')
            return dt.isoformat()
        except ValueError:
            try:
                # Alternative format without timezone
                dt = datetime.strptime(date_str.replace(' GMT', ''), '%a, %d %b %Y %H:%M:%S')
                return dt.isoformat()
            except ValueError:
                print(f"Warning: Could not parse date: {date_str}")
                return None
    
    def is_recent_content(self, pub_date: str) -> bool:
        """Check if content is from 2024 onwards"""
        if not pub_date:
            return False
        
        try:
            # Parse the ISO date string
            dt = datetime.fromisoformat(pub_date.replace('Z', '+00:00'))
            # Only migrate content from 2024 onwards
            cutoff_date = datetime(2024, 1, 1)
            return dt >= cutoff_date
        except Exception:
            return False
    
    def update_urls(self, url: str) -> str:
        """Update URLs from DailyForex to BrokerAnalysis."""
        if not url:
            return ""
        
        return url.replace('dailyforex.com', 'brokeranalysis.com')
    
    def extract_feed_items(self, xml_file_path: str) -> List[Dict]:
        """Extract items from RSS XML file."""
        try:
            tree = ET.parse(xml_file_path)
            root = tree.getroot()
            
            # Find channel
            channel = root.find('channel')
            if channel is None:
                raise ValueError("No channel found in RSS feed")
            
            # Extract feed metadata
            feed_title = self.clean_text(channel.find('title').text if channel.find('title') is not None else "")
            feed_description = self.clean_text(channel.find('description').text if channel.find('description') is not None else "")
            feed_link = self.update_urls(channel.find('link').text if channel.find('link') is not None else "")
            
            items = []
            
            # Extract items
            for item in channel.findall('item'):
                title_elem = item.find('title')
                author_elem = item.find('author')
                link_elem = item.find('link')
                pub_date_elem = item.find('pubDate')
                description_elem = item.find('description')
                
                item_data = {
                    'title': self.clean_text(title_elem.text if title_elem is not None else ""),
                    'author': self.clean_text(author_elem.text if author_elem is not None else ""),
                    'link': self.update_urls(link_elem.text if link_elem is not None else ""),
                    'pub_date': self.parse_date(pub_date_elem.text if pub_date_elem is not None else ""),
                    'description': self.clean_text(description_elem.text if description_elem is not None else ""),
                    'feed_title': feed_title,
                    'feed_description': feed_description,
                    'feed_link': feed_link
                }
                
                # Only add items with required fields and from 2024 onwards
                if item_data['title'] and item_data['link'] and self.is_recent_content(item_data['pub_date']):
                    items.append(item_data)
                elif item_data['title'] and item_data['link']:
                    print(f"Skipping older content: {item_data['title']} ({pub_date_elem.text if pub_date_elem is not None else 'No date'})")
            
            return items
            
        except ET.ParseError as e:
            error_msg = f"XML parsing error in {xml_file_path}: {str(e)}"
            self.errors.append(error_msg)
            print(f"Error: {error_msg}")
            return []
        except Exception as e:
            error_msg = f"Error processing {xml_file_path}: {str(e)}"
            self.errors.append(error_msg)
            print(f"Error: {error_msg}")
            return []
    
    def import_feed_to_supabase(self, feed_type: str, items: List[Dict]) -> bool:
        """Import feed items to Supabase database."""
        try:
            # First, insert or update the feed record
            if items:
                feed_data = {
                    'feed_name': feed_type,
                    'feed_url': items[0]['feed_link'],
                    'title': items[0]['feed_title'],
                    'description': items[0]['feed_description'],
                    'link': items[0]['feed_link'],
                    'pub_date': datetime.now().isoformat(),
                    'source_feed': feed_type
                }
                
                # Insert feed record (check if exists first)
                existing = self.supabase.table('rss_feeds').select('id').eq('source_feed', feed_type).execute()
                
                if existing.data:
                    # Update existing record
                    feed_id = existing.data[0]['id']
                    result = self.supabase.table('rss_feeds').update(feed_data).eq('id', feed_id).execute()
                else:
                    # Insert new record
                    result = self.supabase.table('rss_feeds').insert(feed_data).execute()
                
                if result.data:
                    feed_id = result.data[0]['id']
                    
                    # Import individual items
                    imported_count = 0
                    for item in items:
                        try:
                            item_data = {
                                'feed_id': feed_id,
                                'title': item['title'],
                                'author': item['author'],
                                'link': item['link'],
                                'pub_date': item['pub_date'],
                                'description': item['description'],
                                'migration_status': 'imported',
                                'created_at': datetime.now().isoformat()
                            }
                            
                            # Insert item (ignore duplicates based on link)
                            self.supabase.table('rss_feed_items').upsert(item_data, on_conflict='link').execute()
                            imported_count += 1
                            
                        except Exception as e:
                            error_msg = f"Error importing item '{item['title']}': {str(e)}"
                            self.errors.append(error_msg)
                            print(f"Warning: {error_msg}")
                    
                    print(f"Successfully imported {imported_count}/{len(items)} recent items (2024+) for {feed_type}")
                    self.items_imported += imported_count
                    return True
                else:
                    error_msg = f"Failed to create feed record for {feed_type}"
                    self.errors.append(error_msg)
                    print(f"Error: {error_msg}")
                    return False
            else:
                print(f"No items found for {feed_type}")
                return True
                
        except Exception as e:
            error_msg = f"Database error for {feed_type}: {str(e)}"
            self.errors.append(error_msg)
            print(f"Error: {error_msg}")
            return False
    
    def log_migration(self, feed_type: str, source_file: str, status: str, details: str = ""):
        """Log migration activity to migration_log table."""
        try:
            log_data = {
                'migration_type': 'rss_feed',
                'source_file': source_file,
                'target_table': 'rss_feeds',
                'status': status,
                'metadata': {'details': details},
                'processed_at': datetime.now().isoformat()
            }
            
            self.supabase.table('migration_log').insert(log_data).execute()
            
        except Exception as e:
            print(f"Warning: Could not log migration for {feed_type}: {str(e)}")
    
    def import_all_feeds(self, rss_directory: str) -> Dict[str, bool]:
        """Import all RSS feeds from the specified directory."""
        feed_files = {
            'forex_articles': 'forexarticles.xml',
            'forex_news': 'forexnews.xml', 
            'fundamental_analysis': 'fundamentalanalysis.xml'
        }
        
        results = {}
        
        for feed_type, filename in feed_files.items():
            file_path = os.path.join(rss_directory, filename)
            
            print(f"\nProcessing {feed_type} from {filename}...")
            
            if not os.path.exists(file_path):
                error_msg = f"File not found: {file_path}"
                self.errors.append(error_msg)
                print(f"Error: {error_msg}")
                results[feed_type] = False
                self.log_migration(feed_type, file_path, 'failed', error_msg)
                continue
            
            # Extract items from XML
            items = self.extract_feed_items(file_path)
            
            if items:
                # Import to database
                success = self.import_feed_to_supabase(feed_type, items)
                results[feed_type] = success
                
                if success:
                    self.feeds_processed += 1
                    self.log_migration(feed_type, file_path, 'completed', f"Imported {len(items)} items")
                else:
                    self.log_migration(feed_type, file_path, 'failed', 'Database import failed')
            else:
                results[feed_type] = False
                self.log_migration(feed_type, file_path, 'failed', 'No items extracted')
        
        return results
    
    def print_summary(self, results: Dict[str, bool]):
        """Print import summary."""
        print("\n" + "="*60)
        print("RSS FEED IMPORT SUMMARY")
        print("="*60)
        print(f"Feeds processed: {self.feeds_processed}")
        print(f"Total items imported: {self.items_imported}")
        print(f"Errors encountered: {len(self.errors)}")
        
        print("\nFeed Results:")
        for feed_type, success in results.items():
            status = "✓ SUCCESS" if success else "✗ FAILED"
            print(f"  {feed_type}: {status}")
        
        if self.errors:
            print("\nErrors:")
            for error in self.errors:
                print(f"  - {error}")
        
        print("\nNext Steps:")
        print("1. Verify data in Supabase dashboard")
        print("2. Update SUPABASE_KEY in this script")
        print("3. Run content parser for full article extraction")
        print("4. Begin author profile migration")

def main():
    """Main execution function."""
    # Define paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    rss_directory = os.path.join(project_root, 'daily forex', 'www.dailyforex.com', 'rss')
    
    print("DailyForex to BrokerAnalysis RSS Feed Import")
    print("="*50)
    print(f"RSS Directory: {rss_directory}")
    print(f"Target Database: {SUPABASE_URL}")
    
    # Check if RSS directory exists
    if not os.path.exists(rss_directory):
        print(f"Error: RSS directory not found: {rss_directory}")
        sys.exit(1)
    
    # Initialize importer
    try:
        importer = RSSImporter(SUPABASE_URL, SUPABASE_KEY)
    except ValueError as e:
        print(f"Error: {e}")
        print("Please add your Supabase anon key to the SUPABASE_KEY variable.")
        sys.exit(1)
    
    # Import feeds
    results = importer.import_all_feeds(rss_directory)
    
    # Print summary
    importer.print_summary(results)
    
    # Exit with appropriate code
    if all(results.values()):
        print("\n🎉 All feeds imported successfully!")
        sys.exit(0)
    else:
        print("\n⚠️  Some feeds failed to import. Check errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()