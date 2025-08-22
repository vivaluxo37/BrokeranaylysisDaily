import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Broker {
  id: string
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
  spreads?: any
  commissions?: any
  deposit_methods?: string[]
  withdrawal_methods?: string[]
  customer_support?: any
  educational_resources?: any
  mobile_trading?: boolean
  demo_account?: boolean
  islamic_account?: boolean
  copy_trading?: boolean
  social_trading?: boolean
  automated_trading?: boolean
  market_analysis?: boolean
  economic_calendar?: boolean
  trading_signals?: boolean
  risk_management_tools?: boolean
  negative_balance_protection?: boolean
  segregated_accounts?: boolean
  compensation_scheme?: boolean
  two_factor_authentication?: boolean
  ssl_encryption?: boolean
  regulatory_compliance?: boolean
  financial_reporting?: boolean
  third_party_audits?: boolean
  transparency_score?: number
  user_reviews_count?: number
  user_reviews_average?: number
  expert_rating?: number
  popularity_score?: number
  innovation_score?: number
  customer_service_score?: number
  trading_experience_score?: number
  fees_score?: number
  platform_score?: number
  research_score?: number
  mobile_score?: number
  education_score?: number
  pros?: string[]
  cons?: string[]
  best_for?: string[]
  founded_year?: number
  headquarters?: string
  employees_count?: number
  publicly_traded?: boolean
  parent_company?: string
  subsidiaries?: string[]
  awards?: any
  partnerships?: string[]
  sponsorships?: string[]
  social_media?: any
  contact_info?: any
  languages_supported?: string[]
  currencies_supported?: string[]
  instruments_offered?: string[]
  markets_available?: string[]
  trading_hours?: any
  server_locations?: string[]
  api_trading?: boolean
  white_label_solutions?: boolean
  institutional_services?: boolean
  prime_brokerage?: boolean
  liquidity_providers?: string[]
  execution_model?: string
  order_types?: string[]
  charting_tools?: string[]
  technical_indicators?: string[]
  fundamental_analysis?: boolean
  news_feed?: boolean
  market_scanner?: boolean
  backtesting?: boolean
  strategy_builder?: boolean
  portfolio_management?: boolean
  risk_calculator?: boolean
  profit_calculator?: boolean
  margin_calculator?: boolean
  pip_calculator?: boolean
  currency_converter?: boolean
  economic_indicators?: boolean
  earnings_calendar?: boolean
  dividend_calendar?: boolean
  ipo_calendar?: boolean
  split_calendar?: boolean
  merger_calendar?: boolean
  options_chain?: boolean
  heat_map?: boolean
  correlation_matrix?: boolean
  volatility_surface?: boolean
  yield_curve?: boolean
  bond_screener?: boolean
  stock_screener?: boolean
  etf_screener?: boolean
  mutual_fund_screener?: boolean
  crypto_screener?: boolean
  forex_screener?: boolean
  commodity_screener?: boolean
  index_screener?: boolean
  created_at?: string
  updated_at?: string
}

export interface Article {
  id: string
  title: string
  slug: string
  content?: string
  excerpt?: string
  category?: string
  subcategory?: string
  author_id?: string
  published_at?: string
  updated_at?: string
  meta_description?: string
  meta_keywords?: string
  featured_image_url?: string
  status?: string
  view_count?: number
  tags?: string[]
  language?: string
}

export interface Author {
  id: string
  name: string
  slug: string
  bio?: string
  avatar_url?: string
  email?: string
  expertise?: string[]
  social_links?: any
  is_active?: boolean
  created_at?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  sort_order?: number
}

// Database helper functions
export const getBrokers = async (limit?: number) => {
  let query = supabase
    .from('brokers')
    .select('*')
    .order('overall_rating', { ascending: false })
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching brokers:', error)
    return []
  }
  
  return data as Broker[]
}

export const getBrokerBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('brokers')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Error fetching broker:', error)
    return null
  }
  
  return data as Broker
}

export const getArticles = async (limit?: number) => {
  let query = supabase
    .from('articles')
    .select(`
      *,
      authors (
        name,
        slug,
        avatar_url
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }
  
  return data
}

export const getArticleBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      authors (
        name,
        slug,
        bio,
        avatar_url
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  
  if (error) {
    console.error('Error fetching article:', error)
    return null
  }
  
  return data
}

export const searchBrokers = async (query: string, filters?: any) => {
  let supabaseQuery = supabase
    .from('brokers')
    .select('*')
  
  if (query) {
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
  }
  
  if (filters?.minRating) {
    supabaseQuery = supabaseQuery.gte('overall_rating', filters.minRating)
  }
  
  if (filters?.maxMinDeposit) {
    supabaseQuery = supabaseQuery.lte('minimum_deposit', filters.maxMinDeposit)
  }
  
  const { data, error } = await supabaseQuery.order('overall_rating', { ascending: false })
  
  if (error) {
    console.error('Error searching brokers:', error)
    return []
  }
  
  return data as Broker[]
}