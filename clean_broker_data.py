import json
import re
from pathlib import Path
from typing import List, Dict, Any
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def generate_slug(name: str) -> str:
    """Generate URL-friendly slug from broker name"""
    if not name:
        return ""
    
    # Convert to lowercase and replace spaces with hyphens
    slug = name.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)  # Remove special characters
    slug = re.sub(r'[-\s]+', '-', slug)   # Replace spaces and multiple hyphens with single hyphen
    return slug

def clean_rating(rating: str) -> float:
    """Clean and convert rating to numeric value"""
    if not rating:
        return 0.0
    
    try:
        # Extract numeric value from string (e.g., "4.5/5" -> 4.5)
        match = re.search(r'(\d+\.?\d*)', str(rating))
        if match:
            return float(match.group(1))
    except (ValueError, TypeError):
        pass
    
    return 0.0

def clean_deposit(deposit: str) -> str:
    """Standardize minimum deposit format"""
    if not deposit:
        return "$0"
    
    deposit = str(deposit).strip()
    
    # Ensure currency symbol is present
    if not any(char in deposit for char in ['$', '€', '£', '¥']):
        deposit = f"${deposit}"
    
    # Remove any extra text and keep only the amount with currency
    match = re.search(r'([$€£¥]?\s*\d+[,\d]*(?:\.\d{1,2})?)', deposit)
    if match:
        return match.group(1)
    
    return deposit

def clean_leverage(leverage: str) -> str:
    """Clean and standardize leverage format"""
    if not leverage:
        return "1:1"
    
    leverage = str(leverage).strip()
    
    # Standardize to "1:X" format
    if leverage and not leverage.startswith('1:'):
        # Try to extract numeric value
        match = re.search(r'(\d+)', leverage)
        if match:
            return f"1:{match.group(1)}"
    
    return leverage if leverage else "1:1"

def clean_pros_cons(items: List[str]) -> List[str]:
    """Clean pros/cons lists by removing fragmented text and extracting meaningful points"""
    if not items:
        return []
    
    cleaned_items = []
    for item in items:
        if not item:
            continue
        
        item = str(item).strip()
        
        # Skip very short or meaningless fragments
        if len(item) < 10:
            continue
        
        # Remove rating scores and other noise
        item = re.sub(r'\d+\.?\d*/5', '', item)  # Remove "4.5/5" patterns
        item = re.sub(r'RatingsOverall.*?Overview', '', item, flags=re.DOTALL)
        item = re.sub(r'Headquarters.*?Regulators', '', item, flags=re.DOTALL)
        
        # Extract meaningful sentences (at least 3 words)
        sentences = re.split(r'[.!?]', item)
        for sentence in sentences:
            sentence = sentence.strip()
            words = sentence.split()
            if len(words) >= 3 and len(sentence) > 15:
                # Capitalize first letter
                sentence = sentence[0].upper() + sentence[1:] if sentence else sentence
                cleaned_items.append(sentence)
    
    # Remove duplicates and empty items
    cleaned_items = list(dict.fromkeys(cleaned_items))
    cleaned_items = [item for item in cleaned_items if item and len(item) > 10]
    
    return cleaned_items[:10]  # Limit to 10 most relevant points

def clean_regulation(regulation: str) -> str:
    """Clean regulation information"""
    if not regulation:
        return "Not specified"
    
    regulation = str(regulation).strip()
    
    # Remove common noise words
    regulation = re.sub(r'\b(the|a|an|and|or|but)\b', '', regulation, flags=re.IGNORECASE)
    regulation = regulation.strip()
    
    # Extract regulator names if present
    regulators = []
    regulator_patterns = [
        r'ASIC', r'CySEC', r'FCA', r'FSCS', r'FSC', r'EFSA', r'MiFID', 
        r'SEC', r'FINRA', r'MAS', r'SFC', r'DFSA', r'ADGM', r'CBI'
    ]
    
    for pattern in regulator_patterns:
        if re.search(pattern, regulation, re.IGNORECASE):
            regulators.append(pattern)
    
    if regulators:
        return ", ".join(regulators)
    
    return regulation if regulation else "Not specified"

def clean_broker_data(broker: Dict[str, Any]) -> Dict[str, Any]:
    """Clean all fields of a broker data entry"""
    cleaned = broker.copy()
    
    # Generate slug from name
    cleaned['slug'] = generate_slug(broker.get('name', ''))
    
    # Clean rating
    cleaned['rating'] = clean_rating(broker.get('rating', ''))
    
    # Clean minimum deposit
    cleaned['minimum_deposit'] = clean_deposit(broker.get('minimum_deposit', ''))
    
    # Clean leverage
    cleaned['leverage'] = clean_leverage(broker.get('leverage', ''))
    
    # Clean regulation
    cleaned['regulation'] = clean_regulation(broker.get('regulation', ''))
    
    # Clean pros and cons
    cleaned['pros'] = clean_pros_cons(broker.get('pros', []))
    cleaned['cons'] = clean_pros_cons(broker.get('cons', []))
    
    # Clean other string fields
    for field in ['website_url', 'founded_year', 'headquarters', 'spreads']:
        if field in cleaned:
            value = cleaned[field]
            if isinstance(value, str):
                cleaned[field] = value.strip()
            if not cleaned[field]:
                cleaned[field] = "Not specified"
    
    # Ensure required fields have values
    if not cleaned.get('name'):
        cleaned['name'] = "Unknown Broker"
    
    return cleaned

def load_json_file(file_path: str) -> List[Dict[str, Any]]:
    """Load JSON data from file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        logger.error(f"Error loading {file_path}: {e}")
        return []

def save_json_file(data: List[Dict[str, Any]], file_path: str):
    """Save data to JSON file"""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved cleaned data to {file_path}")
    except Exception as e:
        logger.error(f"Error saving to {file_path}: {e}")

def main():
    """Main function to clean broker data"""
    logger.info("Starting broker data cleaning process...")
    
    # Define input and output file paths
    input_files = [
        "extracted_data/enhanced_brokers_data.json",
        "migration_2024_beyond/brokers_2024_beyond.json"
    ]
    
    output_files = [
        "extracted_data/cleaned_enhanced_brokers_data.json",
        "migration_2024_beyond/cleaned_brokers_2024_beyond.json"
    ]
    
    for input_file, output_file in zip(input_files, output_files):
        if not Path(input_file).exists():
            logger.warning(f"Input file {input_file} does not exist, skipping...")
            continue
        
        logger.info(f"Processing {input_file}...")
        
        # Load raw data
        raw_data = load_json_file(input_file)
        if not raw_data:
            logger.warning(f"No data found in {input_file}, skipping...")
            continue
        
        logger.info(f"Loaded {len(raw_data)} brokers from {input_file}")
        
        # Clean each broker entry
        cleaned_data = []
        for i, broker in enumerate(raw_data):
            cleaned_broker = clean_broker_data(broker)
            cleaned_data.append(cleaned_broker)
            
            if (i + 1) % 10 == 0:
                logger.info(f"Processed {i + 1}/{len(raw_data)} brokers")
        
        # Save cleaned data
        save_json_file(cleaned_data, output_file)
        logger.info(f"Successfully cleaned and saved {len(cleaned_data)} brokers to {output_file}")
    
    logger.info("Broker data cleaning completed!")

if __name__ == "__main__":
    main()