import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime
import uuid
import re

load_dotenv()

def create_slug(text, existing_slugs=None):
    """Create a URL-friendly slug from text."""
    if existing_slugs is None:
        existing_slugs = set()
    
    if not text:
        base_slug = str(uuid.uuid4())[:8]  # Fallback to random string
    else:
        # Convert to lowercase and replace spaces/special chars with hyphens
        base_slug = re.sub(r'[^a-zA-Z0-9\s-]', '', text.lower())
        base_slug = re.sub(r'\s+', '-', base_slug)
        base_slug = re.sub(r'-+', '-', base_slug)  # Remove multiple consecutive hyphens
        base_slug = base_slug.strip('-')  # Remove leading/trailing hyphens
        
        # Ensure slug is not empty and not too long
        if not base_slug:
            base_slug = str(uuid.uuid4())[:8]
        elif len(base_slug) > 90:  # Leave room for counter
            base_slug = base_slug[:90].rstrip('-')
    
    # Make slug unique by adding counter if needed
    slug = base_slug
    counter = 1
    while slug in existing_slugs:
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    existing_slugs.add(slug)
    return slug

# Initialize Supabase client
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_json_data(file_path):
    """Loads data from a JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        return None
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from the file '{file_path}'.")
        return None

def create_authors_from_articles(articles_data):
    """Extract unique authors from articles and create author records."""
    authors = set()
    for article in articles_data:
        if article.get('author'):
            authors.add(article['author'])
    
    # Get existing authors
    try:
        existing_response = supabase.table('authors').select('name, id').execute()
        existing_authors = {author['name']: author['id'] for author in existing_response.data}
        print(f"Found {len(existing_authors)} existing authors.")
    except Exception as e:
        print(f"Warning: Could not fetch existing authors: {e}")
        existing_authors = {}
    
    # Create records only for new authors
    author_records = []
    author_mapping = existing_authors.copy()
    
    for author_name in authors:
        if author_name not in existing_authors:
            author_id = str(uuid.uuid4())
            author_records.append({
                'id': author_id,
                'name': author_name,
                'slug': create_slug(author_name),
                'bio': f'Author at Broker Analysis',
                'is_active': True,
                'created_at': datetime.now().isoformat()
            })
            author_mapping[author_name] = author_id
    
    if author_records:
        try:
            response = supabase.table('authors').insert(author_records).execute()
            print(f"Successfully created {len(author_records)} new authors.")
        except Exception as e:
            print(f"Error creating authors: {e}")
    else:
        print("No new authors to create.")
    
    return author_mapping

def transform_articles_data(articles_data, author_mapping):
    """Transform articles data to match database schema."""
    transformed_articles = []
    used_slugs = set()
    
    for article in articles_data:
        # Get author_id from mapping
        author_id = author_mapping.get(article.get('author'))
        
        transformed_article = {
            'id': str(uuid.uuid4()),  # Generate new UUID
            'title': article.get('title', ''),
            'slug': create_slug(article.get('title', ''), used_slugs),
            'content': article.get('content', ''),
            'excerpt': article.get('description', ''),
            'category': article.get('category', 'forex-news'),
            'author_id': author_id,
            'published_at': article.get('published_date') or datetime.now().isoformat(),
            'updated_at': article.get('updated_at', datetime.now().isoformat()),
            'meta_description': article.get('description', ''),
            'meta_keywords': article.get('keywords', ''),
            'status': 'published',
            'view_count': 0,
            'language': 'en'
        }
        
        # Remove None values
        transformed_article = {k: v for k, v in transformed_article.items() if v is not None}
        transformed_articles.append(transformed_article)
    
    return transformed_articles

def transform_brokers_data(brokers_data):
    """Transform brokers data to match database schema."""
    transformed_brokers = []
    used_slugs = set()
    
    for broker in brokers_data:
        # Parse minimum deposit
        min_deposit = None
        if broker.get('minimum_deposit'):
            try:
                # Extract numeric value from string like "$100"
                min_deposit_str = broker.get('minimum_deposit', '').replace('$', '').replace(',', '')
                if min_deposit_str.isdigit():
                    min_deposit = float(min_deposit_str)
            except:
                pass
        
        # Parse leverage
        max_leverage = None
        if broker.get('leverage'):
            try:
                leverage_str = broker.get('leverage', '').replace(':', '').replace('1', '')
                if leverage_str.isdigit():
                    max_leverage = int(leverage_str)
            except:
                pass
        
        # Parse rating
        overall_rating = None
        if broker.get('rating'):
            try:
                overall_rating = float(broker.get('rating', 0))
            except:
                pass
        
        # Parse founded year
        founded_year = None
        if broker.get('founded_year'):
            try:
                founded_year = int(broker.get('founded_year'))
            except:
                pass
        
        transformed_broker = {
            'id': str(uuid.uuid4()),
            'name': broker.get('name', ''),
            'slug': create_slug(broker.get('name', ''), used_slugs),
            'description': broker.get('description', ''),
            'website_url': broker.get('website_url', ''),
            'minimum_deposit': min_deposit,
            'maximum_leverage': max_leverage,
            'founded_year': founded_year,
            'headquarters': broker.get('headquarters', ''),
            'overall_rating': overall_rating,
            'pros': broker.get('pros', []) if isinstance(broker.get('pros'), list) else [],
            'cons': broker.get('cons', []) if isinstance(broker.get('cons'), list) else [],
            'is_featured': False,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        # Remove None values
        transformed_broker = {k: v for k, v in transformed_broker.items() if v is not None}
        transformed_brokers.append(transformed_broker)
    
    return transformed_brokers

def migrate_data(data, table_name):
    """Migrates data to a specified Supabase table with duplicate handling."""
    if not data:
        print(f"No data to migrate for table '{table_name}'.")
        return

    # Get existing slugs to avoid duplicates
    try:
        existing_response = supabase.table(table_name).select('slug').execute()
        existing_slugs = {item['slug'] for item in existing_response.data}
        print(f"Found {len(existing_slugs)} existing records in '{table_name}'.")
    except Exception as e:
        print(f"Warning: Could not fetch existing slugs for '{table_name}': {e}")
        existing_slugs = set()

    # Filter out records that already exist
    new_data = []
    skipped_count = 0
    
    for record in data:
        if record.get('slug') not in existing_slugs:
            new_data.append(record)
        else:
            skipped_count += 1
    
    if not new_data:
        print(f"No new records to migrate for table '{table_name}'. Skipped {skipped_count} existing records.")
        return
    
    print(f"Migrating {len(new_data)} new records to '{table_name}' (skipping {skipped_count} existing).")

    try:
        response = supabase.table(table_name).insert(new_data).execute()
        print(f"Successfully migrated {len(new_data)} new records to '{table_name}'.")
        # Basic error checking
        if hasattr(response, 'error') and response.error:
            print(f"Error migrating data to '{table_name}': {response.error}")

    except Exception as e:
        print(f"An unexpected error occurred during migration to '{table_name}': {e}")

def main():
    """Main function to orchestrate the data migration."""
    print("Starting data migration...")

    # Define paths to your JSON data files
    articles_data_path = 'c:\\Users\\LENOVO\\Desktop\\BrokeranalysisDaily\\extracted_data\\enhanced_articles_data.json'
    brokers_data_path = 'c:\\Users\\LENOVO\\Desktop\\BrokeranalysisDaily\\extracted_data\\enhanced_brokers_data.json'

    # Load data from JSON files
    articles_data = get_json_data(articles_data_path)
    brokers_data = get_json_data(brokers_data_path)

    if not articles_data or not brokers_data:
        print("Failed to load data files. Exiting.")
        return

    # Step 1: Create authors from articles data
    print("Creating authors...")
    author_mapping = create_authors_from_articles(articles_data)
    
    # Step 2: Transform articles data to match database schema
    print("Transforming articles data...")
    transformed_articles = transform_articles_data(articles_data, author_mapping)
    
    # Step 3: Transform brokers data to match database schema
    print("Transforming brokers data...")
    transformed_brokers = transform_brokers_data(brokers_data)
    
    # Step 4: Migrate transformed data to Supabase tables
    print("Migrating articles...")
    migrate_data(transformed_articles, 'articles')
    
    print("Migrating brokers...")
    migrate_data(transformed_brokers, 'brokers')

    print("Data migration process completed successfully!")

if __name__ == "__main__":
    main()