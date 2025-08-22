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
      category,
      symbol,
      exchange,
      currency,
      is_active,
      limit = 50,
      offset = 0
    } = req.query;

    // Use the market data service to get commodity data from multiple sources
    const filters = {
      category: category as string,
      symbol: symbol as string,
      exchange: exchange as string,
      currency: currency as string,
      is_active: is_active === 'true',
      limit: Number(limit)
    };

    const commodities = await marketDataService.getCommodities(filters);

    // Apply pagination
    const startIndex = Number(offset);
    const endIndex = startIndex + Number(limit);
    const paginatedData = commodities.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedData,
      pagination: {
        total: commodities.length,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: commodities.length > endIndex
      },
      sources: [...new Set(commodities.map(commodity => commodity.source))],
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