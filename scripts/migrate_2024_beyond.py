import json
import re
from datetime import datetime
import os

def filter_2024_beyond_content(input_file, output_file):
    """
    Filter content from 2024 and beyond based on file paths, dates, and content
    """
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        filtered_data = []
        
        for item in data:
            # Check file path for year indicators
            file_path = item.get('file_path', '')
            
            # Extract year from file path
            year_match = re.search(r'/(202[4-9]|20[3-9]\d)/', file_path)
            if year_match:
                year = int(year_match.group(1))
                if year >= 2024:
                    filtered_data.append(item)
                    continue
            
            # Check published_date if available
            published_date = item.get('published_date', '')
            if published_date:
                try:
                    # Try to parse various date formats
                    date_obj = datetime.strptime(published_date, '%Y-%m-%d')
                    if date_obj.year >= 2024:
                        filtered_data.append(item)
                        continue
                except:
                    pass
            
            # Check title and content for 2024/2025 references
            title = item.get('title', '')
            content = item.get('content', '')
            description = item.get('description', '')
            
            if any(re.search(r'202[4-9]|20[3-9]\d', text) for text in [title, content, description]):
                filtered_data.append(item)
        
        # Write filtered data
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(filtered_data, f, indent=2, ensure_ascii=False)
        
        print(f"Filtered {len(filtered_data)} items from {len(data)} total items")
        print(f"Output saved to: {output_file}")
        
        return len(filtered_data)
        
    except Exception as e:
        print(f"Error processing {input_file}: {str(e)}")
        return 0

def main():
    base_dir = "C:/Users/LENOVO/Desktop/BrokeranalysisDaily/extracted_data"
    output_dir = "C:/Users/LENOVO/Desktop/BrokeranalysisDaily/migration_2024_beyond"
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Files to process
    files_to_process = [
        ("enhanced_articles_data.json", "articles_2024_beyond.json"),
        ("enhanced_brokers_data.json", "brokers_2024_beyond.json"),
        ("brokers_data.json", "brokers_basic_2024_beyond.json"),
        ("authors_data.json", "authors_2024_beyond.json"),
        ("categories_data.json", "categories_2024_beyond.json")
    ]
    
    total_filtered = 0
    
    for input_filename, output_filename in files_to_process:
        input_path = os.path.join(base_dir, input_filename)
        output_path = os.path.join(output_dir, output_filename)
        
        if os.path.exists(input_path):
            print(f"\nProcessing {input_filename}...")
            count = filter_2024_beyond_content(input_path, output_path)
            total_filtered += count
        else:
            print(f"File not found: {input_path}")
    
    print(f"\n=== MIGRATION SUMMARY ===")
    print(f"Total items filtered for 2024 and beyond: {total_filtered}")
    print(f"Output directory: {output_dir}")
    
    # Update company information in filtered data
    update_company_info(output_dir)

def update_company_info(directory):
    """
    Update DailyForex references to Broker Analysis
    """
    print("\nUpdating company information...")
    
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            filepath = os.path.join(directory, filename)
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Update each item
                for item in data:
                    # Update author
                    if item.get('author') == 'DailyForex':
                        item['author'] = 'Broker Analysis'
                    
                    # Update content references
                    for field in ['content', 'description', 'title']:
                        if field in item and item[field]:
                            item[field] = item[field].replace('DailyForex', 'Broker Analysis')
                            item[field] = item[field].replace('dailyforex', 'brokeranalysis')
                    
                    # Update file paths
                    if 'file_path' in item:
                        item['file_path'] = item['file_path'].replace('dailyforex', 'brokeranalysis')
                
                # Save updated data
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                
                print(f"Updated company info in {filename}")
                
            except Exception as e:
                print(f"Error updating {filename}: {str(e)}")

if __name__ == "__main__":
    main()