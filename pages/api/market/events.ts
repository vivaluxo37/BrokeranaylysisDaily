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
      date_from,
      date_to,
      country,
      currency,
      impact,
      category,
      limit = 50,
      offset = 0
    } = req.query;

    // Use the market data service to get economic events from multiple sources
    const filters = {
      date_from: date_from as string,
      date_to: date_to as string,
      country: country as string,
      currency: currency as string,
      impact: impact as string,
      category: category as string,
      limit: Number(limit)
    };

    const economicEvents = await marketDataService.getEconomicEvents(filters);

    // Apply pagination
    const startIndex = Number(offset);
    const endIndex = startIndex + Number(limit);
    const paginatedData = economicEvents.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedData,
      pagination: {
        total: economicEvents.length,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: economicEvents.length > endIndex
      },
      sources: [...new Set(economicEvents.map(event => event.source))],
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