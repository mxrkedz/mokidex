// app/actions/fetch-ron-price.ts
'use server';

export async function fetchRonPrice() {
  try {
    // Using CoinGecko API to get RON price in USD
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ronin&vs_currencies=usd&include_24hr_change=true',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch RON price');
    }

    const data = await res.json();

    return {
      usdPrice: data.ronin?.usd || 0,
      change24h: data.ronin?.usd_24h_change || 0,
    };
  } catch (error) {
    console.error('Error fetching RON price:', error);
    return { usdPrice: 0, change24h: 0 };
  }
}
