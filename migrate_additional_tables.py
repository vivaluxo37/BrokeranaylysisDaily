#!/usr/bin/env python3
"""
Migration script for additional Supabase tables:
- currencies
- commodities
- categories
- currency_pairs
- economic_events
- market_signals
- user_interactions

This script populates these tables with sample data based on the schema.
"""

import os
from datetime import datetime, timedelta
from supabase import create_client, Client
from dotenv import load_dotenv
import uuid
import random

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://gngjezgilmdnjffnhxwquo.supabase.co').strip('"')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', '').strip('"')

if not SUPABASE_KEY:
    raise ValueError("SUPABASE_KEY not found in environment variables")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def create_slug(text):
    """Create a URL-friendly slug from text"""
    import re
    slug = re.sub(r'[^\w\s-]', '', text.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')

# Removed ensure_unique_slug function as we're not using slugs anymore

def migrate_currencies():
    """Migrate currency data"""
    print("Migrating currencies...")
    
    # Get existing currency codes
    existing = supabase.table('currencies').select('code').execute()
    existing_codes = {item['code'] for item in existing.data}
    
    currencies_data = [
        {
            'code': 'USD',
            'name': 'US Dollar',
            'symbol': '$',
            'country': 'United States',
            'is_crypto': False,
            'is_major': True,
            'description': 'The United States Dollar is the official currency of the United States.'
        },
        {
            'code': 'EUR',
            'name': 'Euro',
            'symbol': '€',
            'country': 'Eurozone',
            'is_crypto': False,
            'is_major': True,
            'description': 'The Euro is the official currency of the Eurozone.'
        },
        {
            'code': 'GBP',
            'name': 'British Pound',
            'symbol': '£',
            'country': 'United Kingdom',
            'is_crypto': False,
            'is_major': True,
            'description': 'The British Pound Sterling is the official currency of the United Kingdom.'
        },
        {
            'code': 'JPY',
            'name': 'Japanese Yen',
            'symbol': '¥',
            'country': 'Japan',
            'is_crypto': False,
            'is_major': True,
            'description': 'The Japanese Yen is the official currency of Japan.'
        },
        {
            'code': 'CHF',
            'name': 'Swiss Franc',
            'symbol': 'CHF',
            'country': 'Switzerland',
            'is_crypto': False,
            'is_major': True,
            'description': 'The Swiss Franc is the official currency of Switzerland.'
        },
        {
            'code': 'CAD',
            'name': 'Canadian Dollar',
            'symbol': 'C$',
            'country': 'Canada',
            'is_crypto': False,
            'is_major': True,
            'description': 'The Canadian Dollar is the official currency of Canada.'
        },
        {
            'code': 'AUD',
            'name': 'Australian Dollar',
            'symbol': 'A$',
            'country': 'Australia',
            'is_crypto': False,
            'is_major': True,
            'description': 'The Australian Dollar is the official currency of Australia.'
        },
        {
            'code': 'NZD',
            'name': 'New Zealand Dollar',
            'symbol': 'NZ$',
            'country': 'New Zealand',
            'is_crypto': False,
            'is_major': False,
            'description': 'The New Zealand Dollar is the official currency of New Zealand.'
        },
        {
            'code': 'BTC',
            'name': 'Bitcoin',
            'symbol': '₿',
            'country': None,
            'is_crypto': True,
            'is_major': False,
            'description': 'Bitcoin is a decentralized digital cryptocurrency.'
        }
    ]
    
    # Filter out existing currencies
    new_currencies = []
    for currency in currencies_data:
        if currency['code'] not in existing_codes:
            new_currencies.append(currency)
            existing_codes.add(currency['code'])
    
    if new_currencies:
        result = supabase.table('currencies').insert(new_currencies).execute()
        print(f"Inserted {len(new_currencies)} currencies")
    else:
        print("No new currencies to insert")

def migrate_commodities():
    """Migrate commodity data"""
    print("Migrating commodities...")
    
    # Get existing commodity symbols
    existing = supabase.table('commodities').select('symbol').execute()
    existing_symbols = {item['symbol'] for item in existing.data}
    
    commodities_data = [
        {
            'name': 'Gold',
            'symbol': 'GOLD',
            'category': 'precious_metals',
            'current_price': 2000.00,
            'currency': 'USD',
            'unit': 'oz',
            'description': 'Gold is a precious metal widely used as a store of value and hedge against inflation.'
        },
        {
            'name': 'Silver',
            'symbol': 'SILVER',
            'category': 'precious_metals',
            'current_price': 25.00,
            'currency': 'USD',
            'unit': 'oz',
            'description': 'Silver is a precious metal with industrial and investment applications.'
        },
        {
            'name': 'Crude Oil',
            'symbol': 'OIL',
            'category': 'energy',
            'current_price': 75.00,
            'currency': 'USD',
            'unit': 'barrel',
            'description': 'West Texas Intermediate (WTI) crude oil is a major energy commodity.'
        },
        {
            'name': 'Natural Gas',
            'symbol': 'NATGAS',
            'category': 'energy',
            'current_price': 3.50,
            'currency': 'USD',
            'unit': 'MMBtu',
            'description': 'Natural gas is a major energy commodity used for heating and electricity generation.'
        },
        {
            'name': 'Copper',
            'symbol': 'COPPER',
            'category': 'industrial_metals',
            'current_price': 4.20,
            'currency': 'USD',
            'unit': 'lb',
            'description': 'Copper is an industrial metal widely used in construction and electronics.'
        },
        {
            'name': 'Wheat',
            'symbol': 'WHEAT',
            'category': 'agriculture',
            'current_price': 650.00,
            'currency': 'USD',
            'unit': 'bushel',
            'description': 'Wheat is a major agricultural commodity and food staple.'
        }
    ]
    
    # Filter out existing commodities
    new_commodities = []
    for commodity in commodities_data:
        if commodity['symbol'] not in existing_symbols:
            new_commodities.append(commodity)
            existing_symbols.add(commodity['symbol'])
    
    if new_commodities:
        result = supabase.table('commodities').insert(new_commodities).execute()
        print(f"Inserted {len(new_commodities)} commodities")
    else:
        print("No new commodities to insert")

def migrate_categories():
    """Migrate category data"""
    print("Migrating categories...")
    
    # Get existing category slugs
    existing = supabase.table('categories').select('slug').execute()
    existing_slugs = {item['slug'] for item in existing.data}
    
    categories_data = [
        {
            'name': 'Forex Analysis',
            'slug': 'forex-analysis',
            'description': 'In-depth analysis of forex markets and currency pairs.',
            'parent_id': None,
            'sort_order': 1
        },
        {
            'name': 'Market News',
            'slug': 'market-news',
            'description': 'Latest news affecting financial markets.',
            'parent_id': None,
            'sort_order': 2
        },
        {
            'name': 'Economic Events',
            'slug': 'economic-events',
            'description': 'Important economic events and their market impact.',
            'parent_id': None,
            'sort_order': 3
        },
        {
            'name': 'Trading Strategies',
            'slug': 'trading-strategies',
            'description': 'Proven trading strategies and techniques.',
            'parent_id': None,
            'sort_order': 4
        },
        {
            'name': 'Broker Reviews',
            'slug': 'broker-reviews',
            'description': 'Comprehensive reviews of forex brokers.',
            'parent_id': None,
            'sort_order': 5
        },
        {
            'name': 'Technical Analysis',
            'slug': 'technical-analysis',
            'description': 'Technical analysis tools and chart patterns.',
            'parent_id': None,
            'sort_order': 6
        },
        {
            'name': 'Fundamental Analysis',
            'slug': 'fundamental-analysis',
            'description': 'Economic fundamentals affecting currency values.',
            'parent_id': None,
            'sort_order': 7
        }
    ]
    
    # Filter out existing categories
    new_categories = []
    for category in categories_data:
        if category['slug'] not in existing_slugs:
            new_categories.append(category)
            existing_slugs.add(category['slug'])
    
    if new_categories:
        result = supabase.table('categories').insert(new_categories).execute()
        print(f"Inserted {len(new_categories)} categories")
    else:
        print("No new categories to insert")

def migrate_currency_pairs():
    """Migrate currency pair data"""
    print("Migrating currency pairs...")
    
    # Get existing pairs
    existing = supabase.table('currency_pairs').select('pair_name').execute()
    existing_pairs = {item['pair_name'] for item in existing.data}
    
    pairs_data = [
        {
            'pair_name': 'EURUSD',
            'base_currency': 'EUR',
            'quote_currency': 'USD',
            'current_rate': 1.0850,
            'is_major_pair': True
        },
        {
            'pair_name': 'GBPUSD',
            'base_currency': 'GBP',
            'quote_currency': 'USD',
            'current_rate': 1.2650,
            'is_major_pair': True
        },
        {
            'pair_name': 'USDJPY',
            'base_currency': 'USD',
            'quote_currency': 'JPY',
            'current_rate': 150.25,
            'is_major_pair': True
        },
        {
            'pair_name': 'USDCHF',
            'base_currency': 'USD',
            'quote_currency': 'CHF',
            'current_rate': 0.8950,
            'is_major_pair': True
        },
        {
            'pair_name': 'AUDUSD',
            'base_currency': 'AUD',
            'quote_currency': 'USD',
            'current_rate': 0.6750,
            'is_major_pair': True
        },
        {
            'pair_name': 'USDCAD',
            'base_currency': 'USD',
            'quote_currency': 'CAD',
            'current_rate': 1.3450,
            'is_major_pair': True
        },
        {
            'pair_name': 'NZDUSD',
            'base_currency': 'NZD',
            'quote_currency': 'USD',
            'current_rate': 0.6150,
            'is_major_pair': True
        }
    ]
    
    # Filter out existing pairs
    new_pairs = []
    for pair in pairs_data:
        if pair['pair_name'] not in existing_pairs:
            new_pairs.append(pair)
    
    if new_pairs:
        result = supabase.table('currency_pairs').insert(new_pairs).execute()
        print(f"Inserted {len(new_pairs)} currency pairs")
    else:
        print("No new currency pairs to insert")

def migrate_economic_events():
    """Migrate economic events data"""
    print("Migrating economic events...")
    
    # Generate sample economic events for the next few days
    base_date = datetime.now()
    events_data = []
    
    event_templates = [
        {
            'title': 'Non-Farm Payrolls',
            'description': 'US employment data release showing job creation in non-agricultural sectors',
            'country': 'US',
            'currency': 'USD',
            'impact': 'High',
            'category': 'Employment'
        },
        {
            'title': 'Federal Reserve Interest Rate Decision',
            'description': 'Federal Reserve monetary policy decision on interest rates',
            'country': 'US',
            'currency': 'USD',
            'impact': 'High',
            'category': 'Monetary Policy'
        },
        {
            'title': 'ECB Interest Rate Decision',
            'description': 'European Central Bank monetary policy decision',
            'country': 'EU',
            'currency': 'EUR',
            'impact': 'High',
            'category': 'Monetary Policy'
        },
        {
            'title': 'GDP Growth Rate',
            'description': 'Quarterly gross domestic product growth rate',
            'country': 'US',
            'currency': 'USD',
            'impact': 'Medium',
            'category': 'Economic Growth'
        },
        {
            'title': 'Consumer Price Index',
            'description': 'Monthly inflation data measuring consumer price changes',
            'country': 'US',
            'currency': 'USD',
            'impact': 'Medium',
            'category': 'Inflation'
        }
    ]
    
    for i in range(10):  # Create 10 sample events
        template = random.choice(event_templates)
        event_date = base_date + timedelta(days=random.randint(1, 30))
        
        events_data.append({
            'title': template['title'],
            'description': template['description'],
            'event_time': event_date.isoformat(),
            'country': template['country'],
            'currency': template['currency'],
            'impact_level': template['impact'],
            'actual_value': None,
            'forecast_value': None,
            'previous_value': None
        })
    
    if events_data:
        result = supabase.table('economic_events').insert(events_data).execute()
        print(f"Inserted {len(events_data)} economic events")

def migrate_market_signals():
    """Migrate market signals data"""
    print("Migrating market signals...")
    
    # Get currency pair names for instruments
    pairs = supabase.table('currency_pairs').select('pair_name').execute()
    pair_names = [pair['pair_name'] for pair in pairs.data]
    
    if not pair_names:
        print("No currency pairs found, skipping market signals")
        return
    
    signals_data = []
    signal_types = ['BUY', 'SELL']
    
    for pair_name in pair_names[:5]:  # Create signals for first 5 pairs
        for _ in range(2):  # 2 signals per pair
            signal_date = datetime.now() - timedelta(days=random.randint(0, 7))
            expires_date = signal_date + timedelta(hours=random.randint(1, 24))
            
            signals_data.append({
                'instrument': pair_name,
                'signal_type': random.choice(signal_types),
                'entry_price': round(random.uniform(1.0, 2.0), 4),
                'stop_loss': round(random.uniform(0.8, 1.2), 4),
                'take_profit': round(random.uniform(2.0, 2.5), 4),
                'confidence_level': random.randint(60, 95),
                'analysis': f'Technical analysis suggests {random.choice(signal_types).lower()} signal for {pair_name}',
                'created_at': signal_date.isoformat(),
                'expires_at': expires_date.isoformat(),
                'status': random.choice(['active', 'expired', 'triggered'])
            })
    
    if signals_data:
        result = supabase.table('market_signals').insert(signals_data).execute()
        print(f"Inserted {len(signals_data)} market signals")

def migrate_user_interactions():
    print("Migrating user interactions...")
    
    # Get article IDs
    articles = supabase.table('articles').select('id').execute()
    article_ids = [article['id'] for article in articles.data]
    
    if not article_ids:
        print("No articles found, skipping user interactions")
        return
    
    interactions_data = []
    actions = ['view', 'like', 'share', 'comment']
    content_types = ['article', 'broker', 'currency']
    
    for i in range(50):  # Create 50 sample interactions
        interactions_data.append({
            'session_id': f"session_{uuid.uuid4().hex[:16]}",
            'content_type': random.choice(content_types),
            'content_id': random.choice(article_ids),
            'action': random.choice(actions),
            'ip_address': f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}",
            'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    if interactions_data:
        result = supabase.table('user_interactions').insert(interactions_data).execute()
        print(f"Inserted {len(interactions_data)} user interactions")

def main():
    """Main migration function"""
    print("Starting migration of additional tables...")
    
    try:
        migrate_currencies()
        migrate_commodities()
        migrate_categories()
        migrate_currency_pairs()
        migrate_economic_events()
        migrate_market_signals()
        migrate_user_interactions()
        
        print("\nMigration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {str(e)}")
        raise

if __name__ == "__main__":
    main()