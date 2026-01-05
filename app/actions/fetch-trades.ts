'use server';

interface TradeData {
  price: number;
  timestamp: number; // Unix ms
}

// Define the interface for the raw Moralis trade object
interface MoralisTrade {
  price: string;
  price_formatted?: string;
  block_timestamp: string;
  // Add other fields if you need them later (e.g., token_ids, transaction_hash)
}

export async function fetchCollectionTrades(
  contractAddress: string
): Promise<TradeData[]> {
  const apiKey = process.env.MORALIS_API_KEY;
  if (!apiKey) return [];

  // Using the exact parameters you provided (marketplace=opensea&limit=25)
  const url = `https://deep-index.moralis.io/api/v2.2/nft/${contractAddress}/trades?chain=ronin&marketplace=opensea&limit=25`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-API-Key': apiKey,
      },
      cache: 'no-store', // Always fetch fresh trades on reload
    });

    if (!response.ok) {
      console.error(
        `Trades fetch failed for ${contractAddress}: ${response.status}`
      );
      return [];
    }

    const data = await response.json();

    if (!data.result || !Array.isArray(data.result)) return [];

    // Map to simple { price, timestamp } format
    // Replace 'any' with the 'MoralisTrade' interface
    return data.result
      .map((trade: MoralisTrade) => ({
        // Use formatted price if available, otherwise raw / 1e18
        price: trade.price_formatted
          ? parseFloat(trade.price_formatted)
          : parseFloat(trade.price) / 1e18,
        timestamp: new Date(trade.block_timestamp).getTime(),
      }))
      .sort((a: TradeData, b: TradeData) => a.timestamp - b.timestamp); // Sort Oldest -> Newest
  } catch (error) {
    console.error('Failed to fetch trades:', error);
    return [];
  }
}
