import json
import os
from collections import Counter

def analyze_broker_data():
    # Load the enhanced broker data
    with open('extracted_data/enhanced_brokers_data.json', 'r', encoding='utf-8') as f:
        brokers = json.load(f)
    
    print(f"=== BROKER DATA ANALYSIS ===")
    print(f"Total brokers: {len(brokers)}")
    
    # Sample broker names
    broker_names = [b.get('name', 'Unknown') for b in brokers]
    print(f"First 5 broker names: {broker_names[:5]}")
    
    # Analyze ratings
    ratings = [b.get('rating') for b in brokers if b.get('rating')]
    rating_types = [type(r).__name__ for r in ratings]
    print(f"\n=== RATING ANALYSIS ===")
    print(f"Rating data types: {Counter(rating_types)}")
    print(f"Sample ratings: {ratings[:10]}")
    
    # Analyze minimum deposits
    deposits = [b.get('minimum_deposit') for b in brokers if b.get('minimum_deposit')]
    print(f"\n=== DEPOSIT ANALYSIS ===")
    print(f"Sample deposits: {deposits[:10]}")
    
    # Analyze regulation data
    regulations = [b.get('regulation') for b in brokers if b.get('regulation')]
    regulation_counter = Counter(regulations)
    print(f"\n=== REGULATION ANALYSIS ===")
    print(f"Most common regulations: {regulation_counter.most_common(5)}")
    
    # Analyze leverage data
    leverages = [b.get('leverage') for b in brokers if b.get('leverage')]
    print(f"\n=== LEVERAGE ANALYSIS ===")
    print(f"Sample leverages: {leverages[:10]}")
    
    # Analyze pros/cons structure
    pros_lengths = [len(b.get('pros', [])) for b in brokers]
    cons_lengths = [len(b.get('cons', [])) for b in brokers]
    print(f"\n=== PROS/CONS ANALYSIS ===")
    print(f"Average pros per broker: {sum(pros_lengths)/len(pros_lengths):.1f}")
    print(f"Average cons per broker: {sum(cons_lengths)/len(cons_lengths):.1f}")
    
    # Check for missing essential fields
    missing_fields = {}
    essential_fields = ['name', 'rating', 'minimum_deposit', 'leverage', 'regulation']
    
    for field in essential_fields:
        missing_count = sum(1 for b in brokers if not b.get(field) or b.get(field) == '')
        missing_fields[field] = missing_count
    
    print(f"\n=== MISSING FIELDS ANALYSIS ===")
    for field, count in missing_fields.items():
        percentage = (count / len(brokers)) * 100
        print(f"{field}: {count}/{len(brokers)} missing ({percentage:.1f}%)")
    
    # Analyze data quality issues
    print(f"\n=== DATA QUALITY ISSUES ===")
    
    # Check for corrupted pros/cons
    corrupted_pros = 0
    corrupted_cons = 0
    
    for broker in brokers:
        pros = broker.get('pros', [])
        cons = broker.get('cons', [])
        
        for pro in pros:
            if len(pro) < 10 or 'mised' in pro or 'edge' in pro.lower()[:10]:
                corrupted_pros += 1
                break
                
        for con in cons:
            if len(con) < 10 or 'ists' in con.lower()[:10]:
                corrupted_cons += 1
                break
    
    print(f"Brokers with corrupted pros: {corrupted_pros}")
    print(f"Brokers with corrupted cons: {corrupted_cons}")
    
    # Check for potential slug generation
    print(f"\n=== SLUG GENERATION ANALYSIS ===")
    potential_slugs = []
    for broker in brokers:
        name = broker.get('name', '')
        slug = name.lower().replace(' ', '-').replace('.', '').replace('&', 'and')
        potential_slugs.append(slug)
    
    print(f"Sample generated slugs: {potential_slugs[:5]}")
    
    # Check for duplicates
    slug_counter = Counter(potential_slugs)
    duplicates = [(slug, count) for slug, count in slug_counter.items() if count > 1]
    print(f"Duplicate slugs: {duplicates}")

if __name__ == "__main__":
    analyze_broker_data()