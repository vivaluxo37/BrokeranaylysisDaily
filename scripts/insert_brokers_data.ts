import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Interface matching the actual database schema for brokers table
interface BrokerData {
  id?: string
  name: string
  slug: string
  logo_url?: string
  website_url?: string
  description?: string
  full_review?: string
  overall_rating?: number
  trust_score?: number
  regulation_info?: any
  trading_platforms?: string[]
  account_types?: any
  minimum_deposit?: number
  maximum_leverage?: number
  spreads_info?: any  // Changed from spreads to spreads_info
  deposit_methods?: string[]
  withdrawal_methods?: string[]
  customer_support?: any
  pros?: string[]
  cons?: string[]
  founded_year?: number
  headquarters?: string
  // Note: Many fields from the original interface don't exist in the actual database
  // Only including fields that actually exist in the brokers table
}

async function insertBrokersData() {
  try {
    console.log('Starting broker data insertion...')

    // Read cleaned broker data files
    const enhancedBrokersPath = join(process.cwd(), 'extracted_data', 'cleaned_enhanced_brokers_data.json')
    const beyondBrokersPath = join(process.cwd(), 'migration_2024_beyond', 'cleaned_brokers_2024_beyond.json')

    const enhancedBrokersData = JSON.parse(readFileSync(enhancedBrokersPath, 'utf8'))
    const beyondBrokersData = JSON.parse(readFileSync(beyondBrokersPath, 'utf8'))

    console.log(`Enhanced brokers data: ${enhancedBrokersData.length} brokers`)
    console.log(`Beyond 2024 brokers data: ${beyondBrokersData.length} brokers`)

    // Combine both datasets, removing duplicates by slug
    const allBrokers = [...enhancedBrokersData, ...beyondBrokersData]
    const uniqueBrokers = allBrokers.reduce((acc: BrokerData[], broker) => {
      if (!acc.find(b => b.slug === broker.slug)) {
        // Only include fields that actually exist in the database schema
        const allowedKeys = [
          'name', 'slug', 'logo_url', 'website_url', 'description', 'full_review',
          'overall_rating', 'trust_score', 'regulation_info', 'trading_platforms', 'account_types',
          'minimum_deposit', 'maximum_leverage', 'spreads_info', 'deposit_methods',
          'withdrawal_methods', 'customer_support', 'pros', 'cons', 'founded_year', 'headquarters'
        ]
        
        const cleanBroker = {} as BrokerData
        Object.keys(broker).forEach(key => {
          // Map field names to match database schema
          let dbKey = key
          if (key === 'spreads') {
            dbKey = 'spreads_info'
          } else if (key === 'regulation') {
            dbKey = 'regulation_info'
          }
          
          if (allowedKeys.includes(dbKey)) {
            const value = broker[key]
            
            // Handle numeric fields: convert "Not specified" to null and parse numbers
            const numericFields = ['founded_year', 'overall_rating', 'trust_score', 'minimum_deposit', 'maximum_leverage']
            if (numericFields.includes(dbKey)) {
              if (value === 'Not specified' || value === '' || value === null || value === undefined) {
                cleanBroker[dbKey as keyof BrokerData] = null
              } else if (typeof value === 'string') {
                // Parse numeric strings to numbers
                const parsed = parseFloat(value)
                cleanBroker[dbKey as keyof BrokerData] = isNaN(parsed) ? null : parsed
              } else {
                cleanBroker[dbKey as keyof BrokerData] = value
              }
            } else if (dbKey === 'regulation_info') {
              // Convert regulation string to proper JSONB format
              if (value === 'Not specified' || value === '' || value === null || value === undefined) {
                cleanBroker[dbKey as keyof BrokerData] = null
              } else {
                // Create a JSON object with the regulation information
                cleanBroker[dbKey as keyof BrokerData] = { regulation: value }
              }
            } else {
              cleanBroker[dbKey as keyof BrokerData] = value
            }
          }
        })
        acc.push(cleanBroker)
      }
      return acc
    }, [])

    console.log(`Total unique brokers: ${uniqueBrokers.length}`)

    // Insert brokers in batches to avoid rate limits
    const batchSize = 50
    let insertedCount = 0

    for (let i = 0; i < uniqueBrokers.length; i += batchSize) {
      const batch = uniqueBrokers.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('brokers')
        .upsert(batch, { onConflict: 'slug' })
        .select()

      if (error) {
        console.error('Error inserting batch:', error)
        throw error
      }

      insertedCount += data?.length || 0
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}: ${data?.length} brokers`)
      
      // Add small delay between batches to avoid rate limiting
      if (i + batchSize < uniqueBrokers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log(`Successfully inserted/updated ${insertedCount} brokers into the database.`)
    
    // Verify the insertion by counting records
    const { count, error: countError } = await supabase
      .from('brokers')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error counting brokers:', countError)
    } else {
      console.log(`Total brokers in database: ${count}`)
    }

  } catch (error) {
    console.error('Failed to insert broker data:', error)
    process.exit(1)
  }
}

// Run the insertion
insertBrokersData().then(() => {
  console.log('Broker data insertion completed.')
  process.exit(0)
})