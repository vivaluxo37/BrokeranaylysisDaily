import { NextApiRequest, NextApiResponse } from 'next';
import { marketDataService } from '../../../lib/services/marketDataService';

interface CurrencyPair {
  id: string;
  base_currency: string;
  quote_currency: string;
  symbol: string;
  bid_price: number;
  ask_price: number;
  spread: number;
  change_24h: number;
  change_percentage_24h: number;
  volume_24h: number;
  last_updated: string;
  is_active: boolean;
}

interface CurrenciesResponse {
  data: CurrencyPair[];
  total: number;
  timestamp: string;
  status: 'success' | 'error';
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CurrenciesResponse>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      data: [],
      total: 0,
      timestamp: new Date().toISOString(),
      status: 'error',
      message: 'Method not allowed'
    });
  }

  try {
    const { 
      limit = '50', 
      offset = '0', 
      base_currency, 
      quote_currency,
      active_only = 'true'
    } = req.query;

    // Use the market data service to get currency pairs from multiple sources
    const filters = {
      base_currency: base_currency as string,
      quote_currency: quote_currency as string,
      limit: Math.min(parseInt(limit as string) || 50, 100),
      active_only: active_only === 'true'
    };

    const currencyPairs = await marketDataService.getCurrencyPairs(filters);

    // Apply pagination
    const limitNum = Math.min(parseInt(limit as string) || 50, 100);
    const offsetNum = parseInt(offset as string) || 0;
    const startIndex = offsetNum;
    const endIndex = startIndex + limitNum;
    const paginatedData = currencyPairs.slice(startIndex, endIndex);

    // Transform data to match interface
    const transformedData: CurrencyPair[] = paginatedData.map(item => ({
      id: item.id,
      base_currency: item.base_currency,
      quote_currency: item.quote_currency,
      symbol: item.symbol,
      bid_price: parseFloat(item.bid_price?.toString()) || 0,
      ask_price: parseFloat(item.ask_price?.toString()) || 0,
      spread: parseFloat(item.spread?.toString()) || 0,
      change_24h: parseFloat(item.change_24h?.toString()) || 0,
      change_percentage_24h: parseFloat(item.change_percentage_24h?.toString()) || 0,
      volume_24h: parseFloat(item.volume_24h?.toString()) || 0,
      last_updated: item.last_updated || new Date().toISOString(),
      is_active: item.is_active || false
    }));

    return res.status(200).json({
      data: transformedData,
      total: currencyPairs.length,
      timestamp: new Date().toISOString(),
      status: 'success',
      sources: [...new Set(currencyPairs.map(pair => pair.source))]
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      data: [],
      total: 0,
      timestamp: new Date().toISOString(),
      status: 'error',
      message: 'Internal server error'
    });
  }
}