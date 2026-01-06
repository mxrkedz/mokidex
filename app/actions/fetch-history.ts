// app/actions/fetch-history.ts
'use server';

import { TimeRange } from '@/lib/types';
import { RealNFT } from '@/lib/nft-types';

const GRAPHQL_URL = 'https://marketplace-graphql.skymavis.com/graphql';
const MOKI_CONTRACT = '0x47b5a7c2e4f07772696bbf8c8c32fe2b9eabd550';
const BOOSTER_CONTRACT = '0x3a3ea46230688a20ee45ec851dc81f76371f1235';

const GET_COLLECTION_ANALYTICS = `
query GetCollectionAnalytics($tokenAddress: String!) {
  collectionAnalytics(tokenAddress: $tokenAddress) {
    mkpValueCharts
    tokenAddress
    __typename
  }
}
`;

interface HistoryPoint {
  date: string;
  price: number;
}

async function fetchFloorHistory(
  tokenAddress: string
): Promise<HistoryPoint[]> {
  try {
    // console.log(`Fetching history for ${tokenAddress}...`);

    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // IMPORTANT: User-Agent MUST match the sec-ch-ua version below (v143)
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
        Origin: 'https://marketplace.roninchain.com',
        Referer: 'https://marketplace.roninchain.com/',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        // Security Headers (Aligned to v143)
        'sec-ch-ua':
          '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
      },
      body: JSON.stringify({
        operationName: 'GetCollectionAnalytics',
        query: GET_COLLECTION_ANALYTICS,
        variables: { tokenAddress },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`History API Error ${res.status}:`, text);
      return [];
    }

    const json = await res.json();

    if (json.errors) {
      console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
      return [];
    }

    const analytics = json.data?.collectionAnalytics;

    if (!analytics || !analytics.mkpValueCharts) {
      console.warn(`No analytics found for ${tokenAddress}`);
      return [];
    }

    let rawData = analytics.mkpValueCharts;

    // 1. Handle stringified JSON (Common in this API)
    if (typeof rawData === 'string') {
      try {
        rawData = JSON.parse(rawData);
      } catch (e) {
        console.error('Failed to parse mkpValueCharts string', e);
        return [];
      }
    }

    // 2. Extract points
    let points: any[] = [];
    if (Array.isArray(rawData)) points = rawData;
    else if (rawData.points) points = rawData.points;
    else if (rawData.values) points = rawData.values;
    else if (rawData.floorPrice) points = rawData.floorPrice;

    // console.log(`Found ${points.length} points for ${tokenAddress}`);

    // 3. Normalize and Filter
    const normalized = points
      .map((p: any) => {
        // Handle [time, price] array vs object
        let t = Array.isArray(p) ? p[0] : p.time || p.timestamp || p.date;
        let v = Array.isArray(p) ? p[1] : p.price || p.value || p.floor;

        if (!t || v === undefined) return null;

        // Auto-detect seconds vs ms (Timestamps < 1 trillion are usually seconds)
        let timeNum = Number(t);
        if (timeNum < 1000000000000) timeNum *= 1000;

        // Normalize Price (Wei -> RON)
        let price = Number(v);
        if (price > 1000000) price = price / 1e18;

        return {
          date: new Date(timeNum).toISOString(),
          price: price,
          rawTime: timeNum,
        };
      })
      .filter((p) => p !== null && !isNaN(p.price));

    return normalized.sort((a, b) => a.rawTime - b.rawTime);
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return [];
  }
}

export async function fetchPortfolioHistory(
  assets: RealNFT[],
  timeRange: TimeRange
) {
  const now = new Date();

  // Calculate Current Value for fallback/filling
  const currentTotalValue = assets.reduce(
    (acc, curr) => acc + curr.floorPrice,
    0
  );

  // 1. Fetch History
  const [mokiHistory, boosterHistory] = await Promise.all([
    fetchFloorHistory(MOKI_CONTRACT),
    fetchFloorHistory(BOOSTER_CONTRACT),
  ]);

  // --- FALLBACK: Flat Line if API fails ---
  if (mokiHistory.length === 0 && boosterHistory.length === 0) {
    // console.warn("No history data returned from API. Using fallback.");
    const startTime = new Date(now);
    startTime.setHours(startTime.getHours() - 24); // Default 24h view

    return [
      {
        shortDate: startTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        fullDate: startTime.toLocaleString(),
        value: currentTotalValue,
      },
      {
        shortDate: now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        fullDate: now.toLocaleString(),
        value: currentTotalValue,
      },
    ];
  }

  // 2. Setup Calculation Baselines
  // Use the *last known* price as the "current" reference.
  const currentMokiPrice =
    mokiHistory.length > 0 ? mokiHistory[mokiHistory.length - 1].price : 0;
  const currentBoosterPrice =
    boosterHistory.length > 0
      ? boosterHistory[boosterHistory.length - 1].price
      : 0;

  // 3. Merge Timelines
  const allDates = new Set<string>();
  mokiHistory.forEach((h) => allDates.add(h.date));
  boosterHistory.forEach((h) => allDates.add(h.date));

  // If we only have 1 point total, duplicate it to make a line
  if (allDates.size === 1) {
    const d = new Date(Array.from(allDates)[0]);
    d.setHours(d.getHours() - 1);
    allDates.add(d.toISOString());
  }

  const sortedDates = Array.from(allDates).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // 4. Build Historical Value Array
  const fullHistory = sortedDates.map((dateStr) => {
    const dateMs = new Date(dateStr).getTime();

    // Find price at this specific time (or nearest previous/next within 24h)
    // We use a looser find logic to fill gaps
    const findPrice = (history: HistoryPoint[]) => {
      if (history.length === 0) return 0;

      // Exact match?
      const exact = history.find((h) => h.date === dateStr);
      if (exact) return exact.price;

      // Closest match logic
      const closest = history.reduce((prev, curr) => {
        return Math.abs(new Date(curr.date).getTime() - dateMs) <
          Math.abs(new Date(prev.date).getTime() - dateMs)
          ? curr
          : prev;
      });
      return closest.price;
    };

    const mPriceAtTime = findPrice(mokiHistory);
    const bPriceAtTime = findPrice(boosterHistory);

    // Ratios: (Price At Time T) / (Current Price)
    const mRatio = currentMokiPrice > 0 ? mPriceAtTime / currentMokiPrice : 1;
    const bRatio =
      currentBoosterPrice > 0 ? bPriceAtTime / currentBoosterPrice : 1;

    let totalValue = 0;
    assets.forEach((asset) => {
      if (asset.contractType === 'Moki')
        totalValue += asset.floorPrice * mRatio;
      else if (asset.contractType === 'Booster')
        totalValue += asset.floorPrice * bRatio;
    });

    return {
      date: dateStr,
      value: totalValue,
      rawDate: new Date(dateStr),
    };
  });

  // 5. Filter by Time Range
  const startDate = new Date();
  switch (timeRange) {
    case '24h':
      startDate.setHours(now.getHours() - 24);
      break;
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(now.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setFullYear(now.getFullYear() - 10);
      break;
  }

  let filtered = fullHistory.filter((p) => p.rawDate >= startDate);

  // 6. Fix "Floating Line" (Ensure start and end points exist)

  // If no points in range, pull the last known point from before the range
  if (filtered.length === 0) {
    const lastKnown = fullHistory[fullHistory.length - 1];
    if (lastKnown) {
      filtered.push({
        ...lastKnown,
        rawDate: startDate,
        date: startDate.toISOString(),
      });
    } else {
      // Absolute fallback
      filtered.push({
        date: startDate.toISOString(),
        value: currentTotalValue,
        rawDate: startDate,
      });
    }
  }

  // Ensure the graph starts at the left edge (TimeRange Start)
  if (filtered[0].rawDate > startDate) {
    // Find the value immediately preceding the window
    const prevPoint = fullHistory.filter((p) => p.rawDate < startDate).pop();
    const startValue = prevPoint ? prevPoint.value : filtered[0].value;

    filtered.unshift({
      date: startDate.toISOString(),
      value: startValue,
      rawDate: startDate,
    });
  }

  // Ensure the graph ends at the right edge (Now)
  const lastPoint = filtered[filtered.length - 1];
  if (now.getTime() - lastPoint.rawDate.getTime() > 60000) {
    // If gap > 1 min
    filtered.push({
      date: now.toISOString(),
      value: currentTotalValue, // Converge to current true value
      rawDate: now,
    });
  }

  // 7. Format for UI
  return filtered.map((p) => {
    const d = p.rawDate;
    return {
      shortDate:
        timeRange === '24h'
          ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      fullDate: d.toLocaleString(),
      value: p.value,
    };
  });
}
