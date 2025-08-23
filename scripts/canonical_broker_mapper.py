#!/usr/bin/env python3
"""
Canonical Broker Name Mapping Script for Brokeranalysis Platform
Uses rapidfuzz for fuzzy matching to resolve broker entity variations

Author: Brokeranalysis AI System
Date: 2024
"""

import os
import json
import logging
import re
from typing import List, Dict, Optional, Tuple, Set
from dataclasses import dataclass, asdict
from pathlib import Path
import argparse
from datetime import datetime
import time
from collections import defaultdict

try:
    from rapidfuzz import fuzz, process
except ImportError:
    print("Please install rapidfuzz: pip install rapidfuzz")
    exit(1)

try:
    import pandas as pd
except ImportError:
    print("Please install pandas: pip install pandas")
    exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('canonical_broker_mapping.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class BrokerEntity:
    """Represents a broker entity with various name variations"""
    canonical_id: str
    canonical_name: str
    display_name: str
    alternative_names: List[str]
    regulatory_names: List[str]
    website_url: Optional[str]
    country: Optional[str]
    regulatory_bodies: List[str]
    entity_type: str  # 'primary', 'subsidiary', 'brand'
    parent_entity: Optional[str]
    confidence_score: float
    created_at: str
    updated_at: str

@dataclass
class MatchResult:
    """Represents a fuzzy matching result"""
    input_name: str
    matched_canonical_id: str
    matched_canonical_name: str
    confidence_score: float
    match_type: str  # 'exact', 'fuzzy', 'alternative', 'regulatory'
    similarity_score: float
    matched_field: str  # 'canonical_name', 'alternative_names', etc.

class CanonicalBrokerMapper:
    """Handles canonical broker name mapping and fuzzy matching"""
    
    def __init__(self, similarity_threshold: float = 85.0):
        self.similarity_threshold = similarity_threshold
        self.broker_entities: Dict[str, BrokerEntity] = {}
        self.name_to_canonical: Dict[str, str] = {}  # All names -> canonical_id
        self.fuzzy_cache: Dict[str, MatchResult] = {}  # Cache for fuzzy matches
        
        # Statistics
        self.total_matches = 0
        self.exact_matches = 0
        self.fuzzy_matches = 0
        self.no_matches = 0
        
        logger.info(f"Initialized CanonicalBrokerMapper with threshold: {similarity_threshold}")
    
    def normalize_broker_name(self, name: str) -> str:
        """Normalize broker name for better matching"""
        if not name:
            return ""
        
        # Convert to lowercase
        normalized = name.lower().strip()
        
        # Replace brand references
        normalized = normalized.replace('dailyforex', 'brokeranalysis')
        
        # Remove common suffixes and prefixes
        suffixes_to_remove = [
            'ltd', 'limited', 'inc', 'incorporated', 'llc', 'corp', 'corporation',
            'group', 'holdings', 'international', 'global', 'worldwide',
            'fx', 'forex', 'trading', 'capital', 'markets', 'securities',
            'investment', 'financial', 'services', 'brokerage'
        ]
        
        prefixes_to_remove = [
            'the', 'a', 'an'
        ]
        
        # Remove punctuation and extra spaces
        normalized = re.sub(r'[^\w\s]', ' ', normalized)
        normalized = re.sub(r'\s+', ' ', normalized).strip()
        
        # Remove suffixes
        words = normalized.split()
        filtered_words = []
        
        for word in words:
            if word not in suffixes_to_remove and word not in prefixes_to_remove:
                filtered_words.append(word)
        
        # If we removed all words, keep the original
        if not filtered_words:
            return name.lower().strip()
        
        return ' '.join(filtered_words)
    
    def extract_broker_variations(self, name: str) -> List[str]:
        """Extract common variations of a broker name"""
        variations = [name]
        
        # Add normalized version
        normalized = self.normalize_broker_name(name)
        if normalized != name.lower():
            variations.append(normalized)
        
        # Add acronym if applicable
        words = name.split()
        if len(words) > 1:
            acronym = ''.join([word[0].upper() for word in words if word])
            if len(acronym) >= 2:
                variations.append(acronym.lower())
        
        # Add version without spaces
        no_spaces = re.sub(r'\s+', '', name.lower())
        if no_spaces != name.lower():
            variations.append(no_spaces)
        
        # Add version with common abbreviations
        abbrev_map = {
            'international': 'intl',
            'corporation': 'corp',
            'limited': 'ltd',
            'incorporated': 'inc',
            'financial': 'fin',
            'securities': 'sec',
            'investment': 'inv'
        }
        
        for full, abbrev in abbrev_map.items():
            if full in name.lower():
                abbreviated = name.lower().replace(full, abbrev)
                variations.append(abbreviated)
        
        return list(set(variations))  # Remove duplicates
    
    def load_broker_entities(self, entities_file: str):
        """Load broker entities from JSON file"""
        logger.info(f"Loading broker entities from {entities_file}")
        
        with open(entities_file, 'r', encoding='utf-8') as f:
            entities_data = json.load(f)
        
        for entity_data in entities_data:
            entity = BrokerEntity(**entity_data)
            self.broker_entities[entity.canonical_id] = entity
            
            # Build name mapping
            all_names = [entity.canonical_name, entity.display_name]
            all_names.extend(entity.alternative_names)
            all_names.extend(entity.regulatory_names)
            
            for name in all_names:
                if name and name.strip():
                    # Store original name
                    self.name_to_canonical[name.lower().strip()] = entity.canonical_id
                    
                    # Store normalized name
                    normalized = self.normalize_broker_name(name)
                    if normalized:
                        self.name_to_canonical[normalized] = entity.canonical_id
                    
                    # Store variations
                    variations = self.extract_broker_variations(name)
                    for variation in variations:
                        if variation:
                            self.name_to_canonical[variation] = entity.canonical_id
        
        logger.info(f"Loaded {len(self.broker_entities)} broker entities")
        logger.info(f"Built name mapping with {len(self.name_to_canonical)} entries")
    
    def create_default_entities(self) -> List[BrokerEntity]:
        """Create default broker entities for common brokers"""
        default_brokers = [
            {
                'canonical_id': 'ic_markets',
                'canonical_name': 'IC Markets',
                'display_name': 'IC Markets',
                'alternative_names': ['ICMarkets', 'IC Markets Global', 'IC Markets Ltd'],
                'regulatory_names': ['International Capital Markets Pty Ltd'],
                'website_url': 'https://www.icmarkets.com',
                'country': 'Australia',
                'regulatory_bodies': ['ASIC', 'CySEC'],
                'entity_type': 'primary',
                'parent_entity': None
            },
            {
                'canonical_id': 'pepperstone',
                'canonical_name': 'Pepperstone',
                'display_name': 'Pepperstone',
                'alternative_names': ['Pepperstone Group', 'Pepperstone Limited'],
                'regulatory_names': ['Pepperstone Group Limited'],
                'website_url': 'https://pepperstone.com',
                'country': 'Australia',
                'regulatory_bodies': ['ASIC', 'FCA'],
                'entity_type': 'primary',
                'parent_entity': None
            },
            {
                'canonical_id': 'xm_group',
                'canonical_name': 'XM Group',
                'display_name': 'XM',
                'alternative_names': ['XM.com', 'XM Global', 'Trading Point'],
                'regulatory_names': ['Trading Point of Financial Instruments Ltd'],
                'website_url': 'https://www.xm.com',
                'country': 'Cyprus',
                'regulatory_bodies': ['CySEC', 'ASIC', 'FCA'],
                'entity_type': 'primary',
                'parent_entity': None
            },
            {
                'canonical_id': 'exness',
                'canonical_name': 'Exness',
                'display_name': 'Exness',
                'alternative_names': ['Exness Group', 'Exness Global'],
                'regulatory_names': ['Exness (SC) Ltd', 'Exness B.V.'],
                'website_url': 'https://www.exness.com',
                'country': 'Cyprus',
                'regulatory_bodies': ['CySEC', 'FSA'],
                'entity_type': 'primary',
                'parent_entity': None
            },
            {
                'canonical_id': 'fxtm',
                'canonical_name': 'FXTM',
                'display_name': 'ForexTime (FXTM)',
                'alternative_names': ['ForexTime', 'FXTM Global', 'Forex Time'],
                'regulatory_names': ['ForexTime Limited'],
                'website_url': 'https://www.fxtm.com',
                'country': 'Cyprus',
                'regulatory_bodies': ['CySEC', 'FCA'],
                'entity_type': 'primary',
                'parent_entity': None
            }
        ]
        
        entities = []
        for broker_data in default_brokers:
            entity = BrokerEntity(
                canonical_id=broker_data['canonical_id'],
                canonical_name=broker_data['canonical_name'],
                display_name=broker_data['display_name'],
                alternative_names=broker_data['alternative_names'],
                regulatory_names=broker_data['regulatory_names'],
                website_url=broker_data['website_url'],
                country=broker_data['country'],
                regulatory_bodies=broker_data['regulatory_bodies'],
                entity_type=broker_data['entity_type'],
                parent_entity=broker_data['parent_entity'],
                confidence_score=1.0,
                created_at=datetime.now().isoformat(),
                updated_at=datetime.now().isoformat()
            )
            entities.append(entity)
        
        return entities
    
    def find_exact_match(self, broker_name: str) -> Optional[MatchResult]:
        """Find exact match for broker name"""
        normalized_input = broker_name.lower().strip()
        
        if normalized_input in self.name_to_canonical:
            canonical_id = self.name_to_canonical[normalized_input]
            entity = self.broker_entities[canonical_id]
            
            return MatchResult(
                input_name=broker_name,
                matched_canonical_id=canonical_id,
                matched_canonical_name=entity.canonical_name,
                confidence_score=100.0,
                match_type='exact',
                similarity_score=100.0,
                matched_field='direct_lookup'
            )
        
        return None
    
    def find_fuzzy_match(self, broker_name: str) -> Optional[MatchResult]:
        """Find fuzzy match for broker name"""
        # Check cache first
        cache_key = broker_name.lower().strip()
        if cache_key in self.fuzzy_cache:
            return self.fuzzy_cache[cache_key]
        
        normalized_input = self.normalize_broker_name(broker_name)
        
        # Get all possible names to match against
        all_names = list(self.name_to_canonical.keys())
        
        # Find best match using rapidfuzz
        best_match = process.extractOne(
            normalized_input,
            all_names,
            scorer=fuzz.WRatio,
            score_cutoff=self.similarity_threshold
        )
        
        if best_match:
            matched_name, similarity_score, _ = best_match
            canonical_id = self.name_to_canonical[matched_name]
            entity = self.broker_entities[canonical_id]
            
            result = MatchResult(
                input_name=broker_name,
                matched_canonical_id=canonical_id,
                matched_canonical_name=entity.canonical_name,
                confidence_score=similarity_score,
                match_type='fuzzy',
                similarity_score=similarity_score,
                matched_field='fuzzy_search'
            )
            
            # Cache the result
            self.fuzzy_cache[cache_key] = result
            return result
        
        return None
    
    def match_broker_name(self, broker_name: str) -> Optional[MatchResult]:
        """Match broker name using exact and fuzzy matching"""
        if not broker_name or not broker_name.strip():
            return None
        
        self.total_matches += 1
        
        # Try exact match first
        exact_match = self.find_exact_match(broker_name)
        if exact_match:
            self.exact_matches += 1
            return exact_match
        
        # Try fuzzy match
        fuzzy_match = self.find_fuzzy_match(broker_name)
        if fuzzy_match:
            self.fuzzy_matches += 1
            return fuzzy_match
        
        # No match found
        self.no_matches += 1
        logger.warning(f"No match found for broker: {broker_name}")
        return None
    
    def batch_match_brokers(self, broker_names: List[str]) -> List[Optional[MatchResult]]:
        """Match multiple broker names in batch"""
        logger.info(f"Batch matching {len(broker_names)} broker names")
        
        results = []
        for i, name in enumerate(broker_names):
            result = self.match_broker_name(name)
            results.append(result)
            
            # Progress logging
            if (i + 1) % 100 == 0:
                logger.info(f"Progress: {i + 1}/{len(broker_names)} names processed")
        
        return results
    
    def analyze_unmatched_names(self, broker_names: List[str]) -> Dict:
        """Analyze unmatched broker names to identify patterns"""
        unmatched_names = []
        unmatched_patterns = defaultdict(int)
        
        for name in broker_names:
            result = self.match_broker_name(name)
            if not result:
                unmatched_names.append(name)
                
                # Analyze patterns
                normalized = self.normalize_broker_name(name)
                words = normalized.split()
                
                for word in words:
                    if len(word) > 2:  # Skip very short words
                        unmatched_patterns[word] += 1
        
        # Sort patterns by frequency
        sorted_patterns = sorted(unmatched_patterns.items(), key=lambda x: x[1], reverse=True)
        
        return {
            'unmatched_count': len(unmatched_names),
            'unmatched_names': unmatched_names[:50],  # Top 50 unmatched
            'common_patterns': sorted_patterns[:20],  # Top 20 patterns
            'total_analyzed': len(broker_names)
        }
    
    def export_entities(self, output_file: str):
        """Export broker entities to JSON file"""
        entities_data = []
        for entity in self.broker_entities.values():
            entities_data.append(asdict(entity))
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(entities_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Exported {len(entities_data)} broker entities to {output_file}")
    
    def export_name_mapping(self, output_file: str):
        """Export name to canonical ID mapping"""
        mapping_data = {
            'name_to_canonical': self.name_to_canonical,
            'total_mappings': len(self.name_to_canonical),
            'total_entities': len(self.broker_entities),
            'created_at': datetime.now().isoformat()
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(mapping_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Exported name mapping with {len(self.name_to_canonical)} entries to {output_file}")
    
    def get_matching_stats(self) -> Dict:
        """Get matching statistics"""
        return {
            'total_matches_attempted': self.total_matches,
            'exact_matches': self.exact_matches,
            'fuzzy_matches': self.fuzzy_matches,
            'no_matches': self.no_matches,
            'exact_match_rate': self.exact_matches / max(self.total_matches, 1) * 100,
            'fuzzy_match_rate': self.fuzzy_matches / max(self.total_matches, 1) * 100,
            'total_match_rate': (self.exact_matches + self.fuzzy_matches) / max(self.total_matches, 1) * 100,
            'similarity_threshold': self.similarity_threshold,
            'cache_size': len(self.fuzzy_cache),
            'total_entities': len(self.broker_entities),
            'total_name_mappings': len(self.name_to_canonical)
        }

def main():
    """Main function to run canonical broker mapping"""
    parser = argparse.ArgumentParser(description='Canonical broker name mapping with fuzzy matching')
    parser.add_argument('--entities-file', help='Input JSON file with broker entities')
    parser.add_argument('--broker-names-file', help='Input file with broker names to match')
    parser.add_argument('--output-dir', required=True, help='Directory to save mapping results')
    parser.add_argument('--similarity-threshold', type=float, default=85.0, help='Fuzzy matching threshold')
    parser.add_argument('--create-defaults', action='store_true', help='Create default broker entities')
    parser.add_argument('--analyze-unmatched', action='store_true', help='Analyze unmatched names')
    
    args = parser.parse_args()
    
    # Create output directory
    Path(args.output_dir).mkdir(parents=True, exist_ok=True)
    
    # Initialize mapper
    mapper = CanonicalBrokerMapper(similarity_threshold=args.similarity_threshold)
    
    # Load or create broker entities
    if args.entities_file and Path(args.entities_file).exists():
        mapper.load_broker_entities(args.entities_file)
    elif args.create_defaults:
        logger.info("Creating default broker entities")
        default_entities = mapper.create_default_entities()
        for entity in default_entities:
            mapper.broker_entities[entity.canonical_id] = entity
        
        # Build name mapping for defaults
        for entity in default_entities:
            all_names = [entity.canonical_name, entity.display_name]
            all_names.extend(entity.alternative_names)
            all_names.extend(entity.regulatory_names)
            
            for name in all_names:
                if name and name.strip():
                    mapper.name_to_canonical[name.lower().strip()] = entity.canonical_id
                    normalized = mapper.normalize_broker_name(name)
                    if normalized:
                        mapper.name_to_canonical[normalized] = entity.canonical_id
    else:
        logger.error("No broker entities provided. Use --entities-file or --create-defaults")
        return
    
    # Process broker names if provided
    if args.broker_names_file and Path(args.broker_names_file).exists():
        logger.info(f"Loading broker names from {args.broker_names_file}")
        
        # Support different file formats
        if args.broker_names_file.endswith('.json'):
            with open(args.broker_names_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if isinstance(data, list):
                    broker_names = data
                else:
                    broker_names = data.get('broker_names', [])
        else:
            # Assume text file with one name per line
            with open(args.broker_names_file, 'r', encoding='utf-8') as f:
                broker_names = [line.strip() for line in f if line.strip()]
        
        # Batch match broker names
        start_time = time.time()
        match_results = mapper.batch_match_brokers(broker_names)
        processing_time = time.time() - start_time
        
        # Save match results
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        results_file = Path(args.output_dir) / f'match_results_{timestamp}.json'
        
        results_data = []
        for result in match_results:
            if result:
                results_data.append(asdict(result))
            else:
                results_data.append(None)
        
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(results_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved match results to {results_file}")
        
        # Analyze unmatched names if requested
        if args.analyze_unmatched:
            analysis = mapper.analyze_unmatched_names(broker_names)
            analysis_file = Path(args.output_dir) / f'unmatched_analysis_{timestamp}.json'
            
            with open(analysis_file, 'w', encoding='utf-8') as f:
                json.dump(analysis, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Saved unmatched analysis to {analysis_file}")
    
    # Export entities and mappings
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    entities_file = Path(args.output_dir) / f'broker_entities_{timestamp}.json'
    mapper.export_entities(str(entities_file))
    
    mapping_file = Path(args.output_dir) / f'name_mapping_{timestamp}.json'
    mapper.export_name_mapping(str(mapping_file))
    
    # Save statistics
    stats = mapper.get_matching_stats()
    if args.broker_names_file:
        stats['processing_time'] = processing_time
        stats['names_processed'] = len(broker_names)
    
    stats_file = Path(args.output_dir) / f'mapping_stats_{timestamp}.json'
    with open(stats_file, 'w') as f:
        json.dump(stats, f, indent=2)
    
    logger.info(f"Mapping statistics: {stats}")

if __name__ == '__main__':
    main()