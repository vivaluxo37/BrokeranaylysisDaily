import json
import re
from collections import defaultdict

def cleanup_broker_data():
    """
    Comprehensive broker data cleanup script
    """
    print("=== BROKER DATA CLEANUP SCRIPT ===\n")
    
    # Load original data
    with open('extracted_data/enhanced_brokers_data.json', 'r', encoding='utf-8') as f:
        brokers = json.load(f)
    
    print(f"Processing {len(brokers)} brokers...")
    
    # Statistics tracking
    stats = {
        'slugs_generated': 0,
        'ratings_standardized': 0,
        'deposits_cleaned': 0,
        'regulators_extracted': 0,
        'platforms_mapped': 0,
        'pros_cleaned': 0,
        'cons_cleaned': 0
    }
    
    # 1. Generate standardized slugs
    print("\n1. Generating standardized slugs...")
    for broker in brokers:
        name = broker.get('name', '')
        if name:
            # Create URL-friendly slug
            slug = re.sub(r'[^a-zA-Z0-9]+', '-', name.lower()).strip('-')
            broker['slug'] = slug
            stats['slugs_generated'] += 1
    
    # 2. Standardize ratings
    print("2. Standardizing ratings...")
    for broker in brokers:
        rating = broker.get('rating', '')
        if rating:
            if isinstance(rating, str):
                # Extract numeric rating
                match = re.search(r'(\d+\.?\d*)', rating)
                if match:
                    numeric_rating = float(match.group(1))
                    if 0 <= numeric_rating <= 5:
                        broker['rating'] = round(numeric_rating, 1)
                        stats['ratings_standardized'] += 1
                    else:
                        broker['rating'] = None
            elif isinstance(rating, (int, float)):
                if 0 <= rating <= 5:
                    broker['rating'] = round(float(rating), 1)
                    stats['ratings_standardized'] += 1
                else:
                    broker['rating'] = None
    
    # 3. Clean minimum deposits
    print("3. Cleaning minimum deposits...")
    for broker in brokers:
        deposit = broker.get('minimum_deposit', '')
        if deposit and str(deposit).strip():
            # Extract numeric value
            deposit_str = str(deposit).replace(',', '')
            numeric_match = re.search(r'(\d+)', deposit_str)
            if numeric_match:
                amount = int(numeric_match.group(1))
                broker['min_deposit_amount'] = amount
                broker['min_deposit_currency'] = 'USD'  # Default assumption
                stats['deposits_cleaned'] += 1
    
    # 4. Extract regulator information
    print("4. Extracting regulator information...")
    regulator_patterns = {
        'FCA': r'FCA|Financial Conduct Authority',
        'CySEC': r'CySEC|Cyprus Securities|Cyprus.*Exchange',
        'ASIC': r'ASIC|Australian Securities|Australian.*Investment',
        'CFTC': r'CFTC|Commodity Futures Trading',
        'NFA': r'NFA|National Futures Association',
        'BaFin': r'BaFin|German.*Financial',
        'CONSOB': r'CONSOB|Italian.*Securities',
        'FINMA': r'FINMA|Swiss.*Financial',
        'FSA': r'FSA|Financial Services Authority',
        'MAS': r'MAS|Monetary Authority.*Singapore',
        'JFSA': r'JFSA|Japan.*Financial'
    }
    
    for broker in brokers:
        # Combine all text content for analysis
        text_content = ' '.join([
            str(broker.get('description', '')),
            ' '.join(broker.get('pros', [])),
            ' '.join(broker.get('cons', []))
        ])
        
        regulators = []
        for reg_code, pattern in regulator_patterns.items():
            if re.search(pattern, text_content, re.IGNORECASE):
                regulators.append(reg_code)
        
        if regulators:
            broker['extracted_regulators'] = list(set(regulators))
            stats['regulators_extracted'] += 1
        else:
            broker['extracted_regulators'] = []
    
    # 5. Map trading platforms
    print("5. Mapping trading platforms...")
    platform_patterns = {
        'MetaTrader 4': r'MT4|MetaTrader 4',
        'MetaTrader 5': r'MT5|MetaTrader 5',
        'cTrader': r'cTrader',
        'TradingView': r'TradingView',
        'Proprietary': r'proprietary|own platform|custom platform',
        'WebTrader': r'WebTrader|web.*platform',
        'Mobile': r'mobile.*app|iPhone|Android'
    }
    
    for broker in brokers:
        text_content = ' '.join([
            str(broker.get('description', '')),
            ' '.join(broker.get('pros', [])),
            ' '.join(broker.get('cons', []))
        ])
        
        platforms = []
        for platform, pattern in platform_patterns.items():
            if re.search(pattern, text_content, re.IGNORECASE):
                platforms.append(platform)
        
        if platforms:
            broker['supported_platforms'] = list(set(platforms))
            stats['platforms_mapped'] += 1
        else:
            broker['supported_platforms'] = []
    
    # 6. Clean pros and cons
    print("6. Cleaning pros and cons...")
    
    def clean_text_array(items):
        if not items:
            return []
        
        cleaned = []
        for item in items:
            item_str = str(item).strip()
            
            # Skip items that are too short
            if len(item_str) < 15:
                continue
            
            # Skip items that appear corrupted
            if any(fragment in item_str.lower()[:20] for fragment in ['mised', 'edge', 'ists']):
                continue
            
            # Clean up the text
            cleaned_item = item_str.capitalize()
            if not cleaned_item.endswith('.'):
                cleaned_item += '.'
            
            cleaned.append(cleaned_item)
        
        # Limit to 7 items maximum
        return cleaned[:7]
    
    for broker in brokers:
        original_pros = broker.get('pros', [])
        original_cons = broker.get('cons', [])
        
        cleaned_pros = clean_text_array(original_pros)
        cleaned_cons = clean_text_array(original_cons)
        
        broker['pros'] = cleaned_pros
        broker['cons'] = cleaned_cons
        
        if cleaned_pros:
            stats['pros_cleaned'] += 1
        if cleaned_cons:
            stats['cons_cleaned'] += 1
    
    # 7. Extract additional metadata
    print("7. Extracting additional metadata...")
    
    # Extract leverage information
    for broker in brokers:
        leverage = broker.get('leverage', '')
        if leverage and ':' in str(leverage):
            # Extract leverage ratio (e.g., "1:500" -> 500)
            match = re.search(r'1:(\d+)', str(leverage))
            if match:
                broker['max_leverage'] = int(match.group(1))
    
    # Map regulators to countries
    regulator_countries = {
        'FCA': 'GB', 'CySEC': 'CY', 'ASIC': 'AU', 'CFTC': 'US', 'NFA': 'US',
        'BaFin': 'DE', 'CONSOB': 'IT', 'FINMA': 'CH', 'FSA': 'JP', 'MAS': 'SG'
    }
    
    for broker in brokers:
        regulators = broker.get('extracted_regulators', [])
        countries = []
        for reg in regulators:
            if reg in regulator_countries:
                countries.append(regulator_countries[reg])
        
        broker['regulated_countries'] = list(set(countries))
    
    # 8. Generate account type classifications
    print("8. Classifying account types...")
    
    account_type_patterns = {
        'ECN': r'ECN|Electronic Communication Network',
        'STP': r'STP|Straight Through Processing',
        'Market Maker': r'Market Maker|MM|dealing desk',
        'Islamic': r'Islamic|Sharia|Swap.*free|Halal',
        'Scalping Friendly': r'scalping.*allow|scalping.*friend',
        'High Leverage': r'leverage.*up to|maximum leverage',
        'Low Spread': r'spread.*from|tight spread|low spread'
    }
    
    for broker in brokers:
        text_content = ' '.join([
            str(broker.get('description', '')),
            ' '.join(broker.get('pros', [])),
            ' '.join(broker.get('cons', []))
        ])
        
        account_types = []
        for acc_type, pattern in account_type_patterns.items():
            if re.search(pattern, text_content, re.IGNORECASE):
                account_types.append(acc_type)
        
        broker['account_types'] = list(set(account_types))
    
    # Save cleaned data
    output_file = 'extracted_data/standardized_brokers_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(brokers, f, indent=2, ensure_ascii=False)
    
    # Print statistics
    print(f"\n=== CLEANUP STATISTICS ===")
    print(f"Total brokers processed: {len(brokers)}")
    for key, value in stats.items():
        percentage = (value / len(brokers)) * 100
        print(f"{key.replace('_', ' ').title()}: {value}/{len(brokers)} ({percentage:.1f}%)")
    
    # Additional statistics
    regulators_found = sum(1 for b in brokers if b.get('extracted_regulators'))
    platforms_found = sum(1 for b in brokers if b.get('supported_platforms'))
    countries_mapped = sum(1 for b in brokers if b.get('regulated_countries'))
    
    print(f"\nRegulators extracted: {regulators_found}/{len(brokers)} ({(regulators_found/len(brokers))*100:.1f}%)")
    print(f"Platforms mapped: {platforms_found}/{len(brokers)} ({(platforms_found/len(brokers))*100:.1f}%)")
    print(f"Countries mapped: {countries_mapped}/{len(brokers)} ({(countries_mapped/len(brokers))*100:.1f}%)")
    
    print(f"\nCleaned data saved to: {output_file}")
    
    # Generate sample output for verification
    print(f"\n=== SAMPLE CLEANED BROKER ===")
    sample_broker = brokers[0]
    sample_fields = ['name', 'slug', 'rating', 'min_deposit_amount', 'extracted_regulators', 
                    'supported_platforms', 'regulated_countries', 'account_types']
    
    for field in sample_fields:
        if field in sample_broker:
            print(f"{field}: {sample_broker[field]}")
    
    return brokers

if __name__ == "__main__":
    cleaned_brokers = cleanup_broker_data()