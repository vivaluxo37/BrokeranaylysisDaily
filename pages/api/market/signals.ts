import { NextApiRequest, NextApiResponse } from 'next';
import { marketDataService } from '../../../lib/services/marketDataService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      symbol,
      signal_type,
      source,
      timeframe,
      strength,
      confidence,
      is_active,
      limit = 50,
      offset = 0
    } = req.query;

    // Use the market data service to get market signals from multiple sources
    const filters = {
      symbol: symbol as string,
      signal_type: signal_type as string,
      source: source as string,
      timeframe: timeframe as string,
      strength: strength as string,
      confidence: confidence ? Number(confidence) : undefined,
      is_active: is_active === 'true',
      limit: Number(limit)
    };

    const marketSignals = await marketDataService.getMarketSignals(filters);

    // Apply pagination
    const startIndex = Number(offset);
    const endIndex = startIndex + Number(limit);
    const paginatedData = marketSignals.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedData,
      pagination: {
        total: marketSignals.length,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: marketSignals.length > endIndex
      },
      sources: [...new Set(marketSignals.map(signal => signal.source))],
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}