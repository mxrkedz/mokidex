'use server';

interface RonPriceData {
  usdPrice: number;
  change24h: number; // Percentage
}

export async function fetchRonPrice(): Promise<RonPriceData> {
  const apiKey = process.env.MORALIS_API_KEY;
  if (!apiKey) {
    console.error('MORALIS_API_KEY is not defined');
    return { usdPrice: 0, change24h: 0 };
  }

  // WRON Contract on Ronin
  const address = '0xe514d9deb7966c8be0ca922de8a064264ea6bcd4';
  const url = `https://deep-index.moralis.io/api/v2.2/erc20/${address}/price?chain=ronin`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-API-Key': apiKey,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) throw new Error(`Price fetch failed: ${response.status}`);

    const data = await response.json();

    // Use the 24hrPercentChange directly from the API response
    // Ensure we parse it as a number since it might come as a string
    const change = parseFloat(data['24hrPercentChange'] || '0');

    return {
      usdPrice: data.usdPrice || 0,
      change24h: change,
    };
  } catch (error) {
    console.error('Failed to fetch RON price:', error);
    return { usdPrice: 0, change24h: 0 };
  }
}
