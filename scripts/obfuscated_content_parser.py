#!/usr/bin/env python3
"""
Obfuscated Content Parser for DailyForex Migration
Handles base64 encoded content, JavaScript obfuscation, and mixed HTML structures
"""

import os
import re
import base64
import json
import html
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from bs4 import BeautifulSoup
from urllib.parse import unquote
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ObfuscatedContentParser:
    """Parser for handling obfuscated HTML content from scraped DailyForex files"""
    
    def __init__(self, base_directory: str):
        self.base_directory = Path(base_directory)
        self.content_patterns = {
            'base64_image': re.compile(r'data:image/[^;]+;base64,([A-Za-z0-9+/=]+)'),
            'base64_content': re.compile(r'data:[^;]+;base64,([A-Za-z0-9+/=]+)'),
            'encoded_text': re.compile(r'[A-Za-z0-9+/=]{50,}'),
            'javascript_vars': re.compile(r'var\s+(\w+)\s*=\s*["\']([^"\']*)["\'\;]'),
            'date_patterns': re.compile(r'(\d{4})[-/](\d{1,2})[-/](\d{1,2})'),
            'year_filter': re.compile(r'202[4-9]|20[3-9]\d'),  # 2024 and later
        }
        
    def is_2024_plus_content(self, content: str, file_path: str = "") -> bool:
        """Check if content is from 2024 or later"""
        # Check file modification time
        if file_path and os.path.exists(file_path):
            mod_time = datetime.fromtimestamp(os.path.getmtime(file_path))
            if mod_time.year >= 2024:
                return True
        
        # Check for year patterns in content
        year_matches = self.content_patterns['year_filter'].findall(content)
        if year_matches:
            return True
            
        # Check for recent date patterns
        date_matches = self.content_patterns['date_patterns'].findall(content)
        for year, month, day in date_matches:
            if int(year) >= 2024:
                return True
                
        return False
    
    def decode_base64_content(self, encoded_string: str) -> Optional[str]:
        """Attempt to decode base64 encoded content"""
        try:
            # Clean the string
            cleaned = encoded_string.strip().replace(' ', '').replace('\n', '')
            
            # Add padding if necessary
            missing_padding = len(cleaned) % 4
            if missing_padding:
                cleaned += '=' * (4 - missing_padding)
            
            decoded_bytes = base64.b64decode(cleaned)
            
            # Try to decode as UTF-8 text
            try:
                return decoded_bytes.decode('utf-8')
            except UnicodeDecodeError:
                # If not text, return as binary indicator
                return f"[BINARY_DATA:{len(decoded_bytes)}_bytes]"
                
        except Exception as e:
            logger.debug(f"Failed to decode base64: {e}")
            return None
    
    def extract_javascript_variables(self, content: str) -> Dict[str, str]:
        """Extract JavaScript variables and their values"""
        variables = {}
        matches = self.content_patterns['javascript_vars'].findall(content)
        
        for var_name, var_value in matches:
            # Decode URL-encoded values
            try:
                decoded_value = unquote(var_value)
                variables[var_name] = decoded_value
            except:
                variables[var_name] = var_value
                
        return variables
    
    def clean_html_content(self, html_content: str) -> str:
        """Clean and extract meaningful text from HTML"""
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style", "meta", "link"]):
                script.decompose()
            
            # Get text content
            text = soup.get_text()
            
            # Clean up whitespace
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)
            
            return text
            
        except Exception as e:
            logger.error(f"Error cleaning HTML: {e}")
            return html_content
    
    def extract_article_metadata(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Extract article metadata from HTML"""
        metadata = {}
        
        # Extract title
        title_tag = soup.find('title')
        if title_tag:
            metadata['title'] = title_tag.get_text().strip()
        
        # Extract meta description
        desc_tag = soup.find('meta', attrs={'name': 'description'})
        if desc_tag:
            metadata['description'] = desc_tag.get('content', '').strip()
        
        # Extract meta keywords
        keywords_tag = soup.find('meta', attrs={'name': 'keywords'})
        if keywords_tag:
            metadata['keywords'] = keywords_tag.get('content', '').strip()
        
        # Extract Open Graph data
        og_tags = soup.find_all('meta', attrs={'property': re.compile(r'^og:')})
        for tag in og_tags:
            prop = tag.get('property', '').replace('og:', '')
            content = tag.get('content', '')
            if prop and content:
                metadata[f'og_{prop}'] = content
        
        # Extract canonical URL
        canonical_tag = soup.find('link', attrs={'rel': 'canonical'})
        if canonical_tag:
            metadata['canonical_url'] = canonical_tag.get('href', '')
        
        return metadata
    
    def extract_large_encoded_blocks(self, html_content: str) -> List[str]:
        """Extract large encoded text blocks that might contain article content"""
        decoded_blocks = []
        
        # Look for very long encoded strings (likely containing article content)
        long_encoded_pattern = re.compile(r'[A-Za-z0-9+/=]{200,}')
        matches = long_encoded_pattern.findall(html_content)
        
        for match in matches:
            # Try base64 decoding
            try:
                decoded = base64.b64decode(match + '==').decode('utf-8', errors='ignore')
                if len(decoded) > 500:  # Substantial content
                    # Check if it contains meaningful text
                    if any(word in decoded.lower() for word in ['forex', 'broker', 'trading', 'market', 'analysis', 'investment', 'currency', 'financial']):
                        decoded_blocks.append(decoded)
            except:
                pass
                
            # Try URL decoding
            try:
                decoded = unquote(match)
                if len(decoded) > 500 and decoded != match:
                    if any(word in decoded.lower() for word in ['forex', 'broker', 'trading', 'market', 'analysis']):
                        decoded_blocks.append(decoded)
            except:
                pass
        
        return decoded_blocks
    
    def extract_article_content(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Extract main article content from obfuscated HTML"""
        content = {}
        html_content = str(soup)
        
        # Try to extract from large encoded blocks first
        large_blocks = self.extract_large_encoded_blocks(html_content)
        
        # Try to extract from decoded base64 content
        base64_text_content = []
        base64_matches = self.content_patterns['base64_content'].findall(html_content)
        for match in base64_matches:
            decoded = self.decode_base64_content(match)
            if decoded and len(decoded) > 100 and not decoded.strip().startswith('<svg'):
                # Check if it contains meaningful text (not just encoded images)
                if any(word in decoded.lower() for word in ['forex', 'broker', 'trading', 'market', 'analysis']):
                    base64_text_content.append(decoded)
        
        # Look for text in script tags that might contain content
        script_content = []
        scripts = soup.find_all('script')
        for script in scripts:
            script_text = script.get_text()
            if len(script_text) > 1000:  # Large script blocks
                # Look for long text strings that might contain content
                words = script_text.split()
                for word in words:
                    if len(word) > 100 and any(keyword in word.lower() for keyword in ['forex', 'broker', 'trading', 'market']):
                        # Clean up the word and add it
                         cleaned_word = word.strip('"\' \n\r();,.')
                         if len(cleaned_word) > 50:
                             script_content.append(cleaned_word)
        
        # Common article content selectors for DailyForex structure
        content_selectors = [
            'article',
            '.article-content',
            '.post-content', 
            '.entry-content',
            '.content',
            'main',
            '#content',
            '.main-content',
            '.page-content',
            '.broker-content',
            '.forex-content',
            'div[class*="content"]',
            'div[id*="content"]'
        ]
        
        article_element = None
        for selector in content_selectors:
            try:
                article_element = soup.select_one(selector)
                if article_element:
                    break
            except:
                continue
        
        # Combine all extracted content
        all_content = []
        
        if article_element:
            extracted = self.clean_html_content(str(article_element))
            if len(extracted) > 50:  # Only add if substantial
                all_content.append(extracted)
        
        if large_blocks:
            all_content.extend(large_blocks)
            
        if base64_text_content:
            all_content.extend(base64_text_content)
            
        if script_content:
            all_content.extend(script_content)
        
        if not all_content:
            # Fallback: extract all text from body, excluding scripts/styles
            body = soup.find('body')
            if body:
                fallback_content = self.clean_html_content(str(body))
                if len(fallback_content) > 50:
                    all_content.append(fallback_content)
        
        content['body'] = ' '.join(all_content) if all_content else 'No content extracted'
        
        # Extract images from the entire document
        images = soup.find_all('img')
        content['images'] = []
        for img in images:
            src = img.get('src', '')
            # Skip base64 encoded images that are too long
            if src.startswith('data:') and len(src) > 1000:
                src = 'data:image/[base64_encoded]'
            
            img_data = {
                'src': src,
                'alt': img.get('alt', ''),
                'title': img.get('title', '')
            }
            content['images'].append(img_data)
        
        return content
    
    def parse_html_file(self, file_path: str) -> Dict[str, any]:
        """Parse a single HTML file and extract content"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                html_content = f.read()
            
            # Check if content is from 2024+
            if not self.is_2024_plus_content(html_content, file_path):
                logger.info(f"Skipping {file_path} - not 2024+ content")
                return None
            
            soup = BeautifulSoup(html_content, 'html.parser')
            
            result = {
                'file_path': file_path,
                'file_size': os.path.getsize(file_path),
                'metadata': self.extract_article_metadata(soup),
                'content': self.extract_article_content(soup),
                'javascript_vars': self.extract_javascript_variables(html_content),
                'base64_content': [],
                'processing_timestamp': datetime.now().isoformat()
            }
            
            # Extract and decode base64 content
            base64_matches = self.content_patterns['base64_content'].findall(html_content)
            for match in base64_matches[:10]:  # Limit to first 10 matches
                decoded = self.decode_base64_content(match)
                if decoded and not decoded.startswith('[BINARY_DATA:'):
                    result['base64_content'].append({
                        'original_length': len(match),
                        'decoded_content': decoded[:1000],  # Limit length
                        'is_text': True
                    })
            
            # Update brand references
            result = self.update_brand_references(result)
            
            return result
            
        except Exception as e:
            logger.error(f"Error parsing {file_path}: {e}")
            return None
    
    def update_brand_references(self, content_data: Dict) -> Dict:
        """Update DailyForex references to BrokerAnalysis"""
        replacements = {
            'DailyForex': 'BrokerAnalysis',
            'dailyforex.com': 'brokeranalysis.com',
            'Daily Forex': 'Broker Analysis',
            'www.dailyforex.com': 'www.brokeranalysis.com'
        }
        
        def replace_in_string(text: str) -> str:
            if not isinstance(text, str):
                return text
            for old, new in replacements.items():
                text = text.replace(old, new)
            return text
        
        def replace_recursive(obj):
            if isinstance(obj, dict):
                return {k: replace_recursive(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [replace_recursive(item) for item in obj]
            elif isinstance(obj, str):
                return replace_in_string(obj)
            else:
                return obj
        
        return replace_recursive(content_data)
    
    def process_directory(self, directory_path: str = None) -> List[Dict]:
        """Process all HTML files in a directory"""
        if directory_path is None:
            directory_path = self.base_directory
        
        directory_path = Path(directory_path)
        results = []
        
        # Find all HTML files
        html_files = list(directory_path.rglob('*.html'))
        logger.info(f"Found {len(html_files)} HTML files to process")
        
        for file_path in html_files:
            logger.info(f"Processing: {file_path}")
            result = self.parse_html_file(str(file_path))
            if result:
                results.append(result)
        
        logger.info(f"Successfully processed {len(results)} files")
        return results
    
    def save_results(self, results: List[Dict], output_file: str = "parsed_content.json"):
        """Save parsing results to JSON file"""
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            logger.info(f"Results saved to {output_file}")
        except Exception as e:
            logger.error(f"Error saving results: {e}")

def main():
    """Main function for testing the parser"""
    import sys
    
    base_dir = "C:\\Users\\LENOVO\\Desktop\\BrokeranalysisDaily\\daily forex"
    parser = ObfuscatedContentParser(base_dir)
    
    # Check if command line arguments are provided
    if len(sys.argv) > 1:
        # Use command line arguments as file paths
        sample_files = sys.argv[1:]
    else:
        # Use default sample files
        sample_files = [
            "C:\\Users\\LENOVO\\Desktop\\BrokeranalysisDaily\\daily forex\\www.brokeranalysis.com\\forex-brokers.html",
            "C:\\Users\\LENOVO\\Desktop\\BrokeranalysisDaily\\daily forex\\www.brokeranalysis.com\\forex-rss.html"
        ]
    
    results = []
    for file_path in sample_files:
        if os.path.exists(file_path):
            result = parser.parse_html_file(file_path)
            if result:
                results.append(result)
        else:
            print(f"Warning: File not found: {file_path}")
    
    # Save results
    parser.save_results(results, "sample_parsed_content.json")
    
    # Print summary
    print(f"\nProcessed {len(results)} files:")
    for result in results:
        print(f"- {result['file_path']}")
        print(f"  Title: {result['metadata'].get('title', 'N/A')}")
        print(f"  Content length: {len(result['content'].get('body', ''))} chars")
        print(f"  Base64 content blocks: {len(result['base64_content'])}")
        print()

if __name__ == "__main__":
    main()