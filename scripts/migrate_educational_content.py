#!/usr/bin/env python3
"""
Educational Content Migration Script
Migrates educational guides from DailyForex to BrokerAnalysis platform
"""

import json
import os
import sys
from datetime import datetime
from supabase import create_client, Client
from typing import Dict, List, Optional
import re

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Supabase configuration
SUPABASE_URL = "https://gngjezgilmdnjffxwquo.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZ2plemdpbG1kbmpmZnh3cXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NTQ5OTQsImV4cCI6MjA3MTIzMDk5NH0.jyLEY1NoQIkwpTykzcsBWGZtY8Y8mQAAZ2gSdsB2SlM"

class EducationalContentMigrator:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.processed_count = 0
        self.success_count = 0
        self.error_count = 0
        
    def update_brand_references(self, content: str) -> str:
        """Update brand references from DailyForex to BrokerAnalysis"""
        if not content:
            return content
            
        # Brand name updates
        content = re.sub(r'DailyForex', 'BrokerAnalysis', content, flags=re.IGNORECASE)
        content = re.sub(r'Daily Forex', 'Broker Analysis', content, flags=re.IGNORECASE)
        content = re.sub(r'dailyforex\.com', 'brokeranalysis.com', content, flags=re.IGNORECASE)
        
        # Contact information updates
        content = re.sub(r'info@dailyforex\.com', 'info@brokeranalysis.com', content, flags=re.IGNORECASE)
        
        # Address updates
        old_address_patterns = [
            r'Daily Forex Ltd[^\n]*\n[^\n]*\n[^\n]*Cyprus[^\n]*',
            r'Limassol[^\n]*Cyprus[^\n]*',
            r'CY-[0-9]+[^\n]*Cyprus[^\n]*'
        ]
        
        new_address = """30 N Gould St Ste R
Sheridan, WY 82801, US
EIN 384298140
CALL US: (801)-893-2577"""
        
        for pattern in old_address_patterns:
            content = re.sub(pattern, new_address, content, flags=re.IGNORECASE | re.MULTILINE)
            
        return content
    
    def extract_guide_content(self, parsed_data: Dict) -> Optional[Dict]:
        """Extract and clean guide content from parsed data"""
        try:
            metadata = parsed_data.get('metadata', {})
            content_data = parsed_data.get('content', {})
            
            # Skip if no meaningful content
            if not metadata.get('title') or metadata.get('title') == 'Page has moved':
                return None
                
            # Extract title and clean it
            title = metadata.get('title', '').replace(' | BrokerAnalysis', '').replace('[year]', '2025')
            
            # Extract description
            description = metadata.get('description', '')
            
            # Extract content body (though it's obfuscated, we have the metadata)
            body_content = content_data.get('body', '')
            
            # Determine guide type based on title
            guide_type = 'trading_guide'
            if 'broker' in title.lower():
                guide_type = 'broker_guide'
            elif 'trend' in title.lower() or 'technical' in title.lower():
                guide_type = 'technical_analysis'
                
            # Extract file path for slug generation
            file_path = parsed_data.get('file_path', '')
            slug = os.path.basename(file_path).replace('.html', '') if file_path else ''
            
            guide_data = {
                'title': self.update_brand_references(title),
                'description': self.update_brand_references(description),
                'content': self.update_brand_references(body_content),
                'guide_type': guide_type,
                'slug': slug,
                'status': 'published',
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat(),
                'meta_keywords': metadata.get('keywords', ''),
                'canonical_url': f"https://brokeranalysis.com/learn/{slug}",
                'og_title': self.update_brand_references(metadata.get('og_title', title)),
                'og_description': self.update_brand_references(metadata.get('og_description', description)),
                'og_image': 'https://brokeranalysis.com/images/brokeranalysis_logo.png'
            }
            
            return guide_data
            
        except Exception as e:
            print(f"Error extracting guide content: {e}")
            return None
    
    def migrate_guide(self, guide_data: Dict) -> bool:
        """Migrate a single educational guide to Supabase"""
        try:
            # Check if guide already exists
            existing = self.supabase.table('educational_guides').select('id').eq('slug', guide_data['slug']).execute()
            
            if existing.data:
                print(f"Guide '{guide_data['title']}' already exists, updating...")
                result = self.supabase.table('educational_guides').update(guide_data).eq('slug', guide_data['slug']).execute()
            else:
                print(f"Creating new guide: '{guide_data['title']}'")
                result = self.supabase.table('educational_guides').insert(guide_data).execute()
            
            if result.data:
                print(f"✅ Successfully migrated: {guide_data['title']}")
                return True
            else:
                print(f"❌ Failed to migrate: {guide_data['title']}")
                return False
                
        except Exception as e:
            print(f"❌ Error migrating guide '{guide_data.get('title', 'Unknown')}': {e}")
            return False
    
    def create_educational_guides_table(self):
        """Create the educational_guides table if it doesn't exist"""
        try:
            # This would typically be done via Supabase dashboard or migration files
            # For now, we'll assume the table exists or create it manually
            print("📋 Educational guides table should be created in Supabase dashboard with the following schema:")
            print("""
            CREATE TABLE educational_guides (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                content TEXT,
                guide_type VARCHAR(50),
                slug VARCHAR(255) UNIQUE NOT NULL,
                status VARCHAR(20) DEFAULT 'published',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                meta_keywords TEXT,
                canonical_url VARCHAR(500),
                og_title VARCHAR(255),
                og_description TEXT,
                og_image VARCHAR(500)
            );
            """)
        except Exception as e:
            print(f"Note: {e}")
    
    def migrate_from_parsed_content(self, json_file_path: str):
        """Migrate educational content from parsed JSON file"""
        try:
            with open(json_file_path, 'r', encoding='utf-8') as f:
                parsed_data = json.load(f)
            
            print(f"📚 Starting educational content migration from {json_file_path}")
            print(f"Found {len(parsed_data)} files to process")
            
            for item in parsed_data:
                self.processed_count += 1
                
                # Extract guide data
                guide_data = self.extract_guide_content(item)
                
                if not guide_data:
                    print(f"⏭️  Skipping file (no content): {item.get('file_path', 'Unknown')}")
                    continue
                
                # Migrate to Supabase
                if self.migrate_guide(guide_data):
                    self.success_count += 1
                else:
                    self.error_count += 1
            
            # Print summary
            print("\n" + "="*50)
            print("📊 EDUCATIONAL CONTENT MIGRATION SUMMARY")
            print("="*50)
            print(f"📁 Total files processed: {self.processed_count}")
            print(f"✅ Successfully migrated: {self.success_count}")
            print(f"❌ Failed migrations: {self.error_count}")
            print(f"📈 Success rate: {(self.success_count/max(self.processed_count,1)*100):.1f}%")
            
            if self.success_count > 0:
                print("\n🎉 Educational content migration completed successfully!")
                print("📋 Migrated guides:")
                # List successful migrations
                for item in parsed_data:
                    guide_data = self.extract_guide_content(item)
                    if guide_data:
                        print(f"   • {guide_data['title']} ({guide_data['guide_type']})")
            
        except FileNotFoundError:
            print(f"❌ Error: File {json_file_path} not found")
        except json.JSONDecodeError:
            print(f"❌ Error: Invalid JSON in {json_file_path}")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")

def main():
    """Main function to run the educational content migration"""
    migrator = EducationalContentMigrator()
    
    # Create table schema info
    migrator.create_educational_guides_table()
    
    # Path to the parsed content JSON file
    json_file_path = "sample_parsed_content.json"
    
    if not os.path.exists(json_file_path):
        print(f"❌ Error: {json_file_path} not found")
        print("Please run the content parser first to generate the parsed content file.")
        return
    
    # Run migration
    migrator.migrate_from_parsed_content(json_file_path)

if __name__ == "__main__":
    main()