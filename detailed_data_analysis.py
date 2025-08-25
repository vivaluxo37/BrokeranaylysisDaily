import json
import re
from collections import Counter, defaultdict

def detailed_broker_analysis():
    # Load both versions of broker data
    with open('extracted_data/enhanced_brokers_data.json', 'r', encoding='utf-8') as f:
        original_brokers = json.load(f)
    
    with open('extracted_data/cleaned_enhanced_brokers_data.json', 'r', encoding='utf-8') as f:
        cleaned_brokers = json.load(f)
    
    print("=== DETAILED BROKER DATA ANALYSIS ===\n")
    
    # Compare original vs cleaned data
    print(f"Original brokers: {len(original_brokers)}")
    print(f"Cleaned brokers: {len(cleaned_brokers)}")
    
    # Analyze specific data quality issues
    print("\n=== SPECIFIC DATA QUALITY ISSUES ===")
    
    # 1. Rating inconsistencies
    print("\n1. RATING ANALYSIS:")
    original_ratings = [b.get('rating') for b in original_brokers if b.get('rating')]
    cleaned_ratings = [b.get('rating') for b in cleaned_brokers if b.get('rating')]
    
    print(f"Original rating types: {set(type(r).__name__ for r in original_ratings)}")
    print(f"Cleaned rating types: {set(type(r).__name__ for r in cleaned_ratings)}")
    
    # Find invalid ratings
    invalid_ratings = []
    for i, broker in enumerate(original_brokers):
        rating = broker.get('rating', '')
        if rating and not re.match(r'^\d+\.?\d*$', str(rating)):
            invalid_ratings.append((broker.get('name'), rating))
    
    print(f"Invalid ratings found: {len(invalid_ratings)}")
    if invalid_ratings:
        print(f"Examples: {invalid_ratings[:3]}")
    
    # 2. Minimum deposit analysis
    print("\n2. MINIMUM DEPOSIT ANALYSIS:")
    deposits = [b.get('minimum_deposit') for b in original_brokers if b.get('minimum_deposit')]
    
    # Categorize deposit formats
    deposit_patterns = defaultdict(list)
    for deposit in deposits:
        if '$' in str(deposit):
            deposit_patterns['dollar_format'].append(deposit)
        elif '€' in str(deposit):
            deposit_patterns['euro_format'].append(deposit)
        elif str(deposit).isdigit():
            deposit_patterns['number_only'].append(deposit)
        else:
            deposit_patterns['other_format'].append(deposit)
    
    for pattern, examples in deposit_patterns.items():
        print(f"{pattern}: {len(examples)} examples - {examples[:3]}")
    
    # 3. Regulation data analysis
    print("\n3. REGULATION DATA ANALYSIS:")
    regulations = [b.get('regulation') for b in original_brokers if b.get('regulation')]
    
    # Find meaningful vs corrupted regulation data
    meaningful_regs = []
    corrupted_regs = []
    
    known_regulators = ['FCA', 'CySEC', 'ASIC', 'CFTC', 'NFA', 'FSA', 'FINMA', 'BaFin', 'CONSOB']
    
    for reg in regulations:
        if any(regulator in str(reg).upper() for regulator in known_regulators):
            meaningful_regs.append(reg)
        elif len(str(reg)) < 10 or str(reg) in ['and', 'the', 'un', 'YesMinimum']:
            corrupted_regs.append(reg)
    
    print(f"Meaningful regulation entries: {len(meaningful_regs)}")
    print(f"Corrupted regulation entries: {len(corrupted_regs)}")
    print(f"Sample meaningful: {meaningful_regs[:3]}")
    print(f"Sample corrupted: {corrupted_regs[:5]}")
    
    # 4. Pros/Cons content analysis
    print("\n4. PROS/CONS CONTENT ANALYSIS:")
    
    def analyze_text_quality(text_list, name):
        if not text_list:
            return {'empty': True}
        
        total_items = len(text_list)
        short_items = sum(1 for item in text_list if len(str(item)) < 20)
        html_items = sum(1 for item in text_list if '<' in str(item) or '>' in str(item))
        incomplete_items = sum(1 for item in text_list if str(item).endswith(('edge', 'ists', 'mised')))
        
        return {
            'total': total_items,
            'short_percentage': (short_items / total_items) * 100,
            'html_percentage': (html_items / total_items) * 100,
            'incomplete_percentage': (incomplete_items / total_items) * 100
        }
    
    all_pros = []
    all_cons = []
    
    for broker in original_brokers:
        pros = broker.get('pros', [])
        cons = broker.get('cons', [])
        all_pros.extend(pros)
        all_cons.extend(cons)
    
    pros_analysis = analyze_text_quality(all_pros, 'pros')
    cons_analysis = analyze_text_quality(all_cons, 'cons')
    
    print(f"Pros analysis: {pros_analysis}")
    print(f"Cons analysis: {cons_analysis}")
    
    # 5. Missing essential data for SEO
    print("\n5. SEO-CRITICAL MISSING DATA:")
    
    seo_fields = {
        'name': 'Broker name for title generation',
        'rating': 'Star rating for rich snippets',
        'minimum_deposit': 'Key comparison metric',
        'regulation': 'Trust and compliance info',
        'leverage': 'Trading conditions',
        'spreads': 'Cost information',
        'founded_year': 'Company history',
        'headquarters': 'Location information'
    }
    
    for field, description in seo_fields.items():
        missing_count = sum(1 for b in original_brokers if not b.get(field) or str(b.get(field)).strip() == '')
        percentage = (missing_count / len(original_brokers)) * 100
        print(f"{field}: {missing_count}/{len(original_brokers)} missing ({percentage:.1f}%) - {description}")
    
    # 6. Generate standardization recommendations
    print("\n=== STANDARDIZATION RECOMMENDATIONS ===")
    
    print("\n1. RATING STANDARDIZATION:")
    print("   - Convert all ratings to DECIMAL(3,2) format")
    print("   - Handle invalid ratings (set to NULL or default)")
    print("   - Validate range 0.0-5.0")
    
    print("\n2. DEPOSIT STANDARDIZATION:")
    print("   - Extract numeric values from currency strings")
    print("   - Store as INTEGER (USD cents) or DECIMAL")
    print("   - Add separate currency field")
    
    print("\n3. REGULATION CLEANUP:")
    print("   - Extract known regulator names using regex")
    print("   - Create separate regulators table")
    print("   - Link brokers to multiple regulators")
    
    print("\n4. PROS/CONS RESTRUCTURING:")
    print("   - Filter out corrupted/incomplete entries")
    print("   - Remove HTML fragments")
    print("   - Ensure minimum length (20+ characters)")
    print("   - Limit to 5-7 meaningful items per broker")
    
    # 7. Country mapping analysis
    print("\n=== COUNTRY MAPPING REQUIREMENTS ===")
    
    # Extract potential country information from regulation data
    country_indicators = {
        'FCA': 'GB', 'CySEC': 'CY', 'ASIC': 'AU', 'CFTC': 'US', 'NFA': 'US',
        'BaFin': 'DE', 'CONSOB': 'IT', 'FINMA': 'CH', 'FSA': 'JP'
    }
    
    broker_countries = {}
    for broker in original_brokers:
        name = broker.get('name')
        regulation = str(broker.get('regulation', '')).upper()
        countries = []
        
        for regulator, country in country_indicators.items():
            if regulator in regulation:
                countries.append(country)
        
        if countries:
            broker_countries[name] = list(set(countries))
    
    print(f"Brokers with identifiable countries: {len(broker_countries)}")
    print(f"Sample mappings: {dict(list(broker_countries.items())[:5])}")
    
    # 8. Platform mapping analysis
    print("\n=== PLATFORM MAPPING REQUIREMENTS ===")
    
    platform_keywords = {
        'MT4': 'MetaTrader 4',
        'MT5': 'MetaTrader 5', 
        'METATRADER': 'MetaTrader',
        'CTRADER': 'cTrader',
        'TRADINGVIEW': 'TradingView',
        'PROPRIETARY': 'Proprietary Platform'
    }
    
    broker_platforms = {}
    for broker in original_brokers:
        name = broker.get('name')
        # Check in pros, cons, and description
        text_content = ' '.join([
            str(broker.get('description', '')),
            ' '.join(broker.get('pros', [])),
            ' '.join(broker.get('cons', []))
        ]).upper()
        
        platforms = []
        for keyword, platform in platform_keywords.items():
            if keyword in text_content:
                platforms.append(platform)
        
        if platforms:
            broker_platforms[name] = list(set(platforms))
    
    print(f"Brokers with identifiable platforms: {len(broker_platforms)}")
    print(f"Sample platform mappings: {dict(list(broker_platforms.items())[:5])}")

if __name__ == "__main__":
    detailed_broker_analysis()