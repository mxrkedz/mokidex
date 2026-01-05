'use server';

export interface HistoryPoint {
  date: string;
  price: number;
}

// Define the interface for the raw API response item
interface MoralisHistoryItem {
  floor_price: string;
  price_currency: string;
  timestamp: string;
  block_number?: string;
}

export async function fetchHistoricalPrices(
  contractAddress: string,
  range: string
): Promise<HistoryPoint[]> {
  const apiKey = process.env.MORALIS_API_KEY;
  if (!apiKey) return [];

  // Map UI TimeRange to Moralis 'interval' parameter
  let apiParam = '7d';
  switch (range) {
    case '24h':
      apiParam = '1d';
      break;
    case '7d':
      apiParam = '7d';
      break;
    case '30d':
      apiParam = '30d';
      break;
    case 'All':
      apiParam = 'all';
      break;
    default:
      apiParam = '7d';
  }

  const url = `https://deep-index.moralis.io/api/v2.2/nft/${contractAddress}/floor-price/historical?chain=ronin&interval=${apiParam}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-API-Key': apiKey,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`History fetch failed: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    if (!data.result || !Array.isArray(data.result)) return [];

    // Map and reverse (Oldest -> Newest)
    // Use the MoralisHistoryItem interface instead of 'any'
    return data.result
      .map((item: MoralisHistoryItem) => ({
        price: parseFloat(item.floor_price) || 0,
        date: item.timestamp,
      }))
      .reverse();
  } catch (e) {
    console.error('Error fetching history:', e);
    return [];
  }
}
