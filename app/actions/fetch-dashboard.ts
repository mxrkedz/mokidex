/* eslint-disable @typescript-eslint/no-explicit-any */
// app/actions/fetch-dashboard.ts
'use server';

import { fetchRonPrice } from './fetch-ron-price';

const GRAPHQL_URL = 'https://marketplace-graphql.skymavis.com/graphql';

const MOKI_ADDRESS = '0x47b5a7c2e4f07772696bbf8c8c32fe2b9eabd550';
const BOOSTER_ADDRESS = '0x3a3ea46230688a20ee45ec851dc81f76371f1235';

// --- QUERIES ---

const GET_TOKEN_DATA = `
query GetTokenData($tokenAddress: String) {
  tokenData(tokenAddress: $tokenAddress) {
    ...TokenData
    __typename
  }
}

fragment TokenData on TokenData {
  tokenAddress
  volumeAllTime
  totalOwners
  totalItems
  totalListing
  minPrice
  __typename
}
`;

const GET_ERC721_COUNT = `
query GetERC721TokensList($tokenAddress: String, $slug: String, $owner: String, $auctionType: AuctionType, $criteria: [SearchCriteria!], $from: Int!, $size: Int!, $sort: SortBy, $name: String, $priceRange: InputRange, $rangeCriteria: [RangeSearchCriteria!], $excludeAddress: String) {
  erc721Tokens(
    tokenAddress: $tokenAddress
    slug: $slug
    owner: $owner
    auctionType: $auctionType
    criteria: $criteria
    from: $from
    size: $size
    sort: $sort
    name: $name
    priceRange: $priceRange
    rangeCriteria: $rangeCriteria
    excludeAddress: $excludeAddress
  ) {
    total
    __typename
  }
}
`;

const GET_COLLECTION_ACTIVITIES = `
query GetCollectionActivities($tokenAddress: String!, $activityTypes: [ActivityType!]!, $size: Int!) {
  activities(
    tokenAddress: $tokenAddress
    activityTypes: $activityTypes
    size: $size
  ) {
    results {
      ...CollectionActivity
      __typename
    }
    __typename
  }
}

fragment CollectionActivity on Activity {
  activityType
  id
  timestamp
  txHash
  metadata 
  fromProfile {
    name
    __typename
  }
  toProfile {
    name
    __typename
  }
  asset {
    token {
      ... on Erc721 {
        erc721TokenId: tokenId
        erc721Name: name
        erc721Image: image
        erc721CdnImage: cdnImage
        __typename
      }
      ... on Erc1155 {
        erc1155TokenId: tokenId
        erc1155Name: name
        erc1155Image: image
        erc1155CdnImage: cdnImage
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}
`;

// --- Helpers ---

async function fetchGraphQL(query: string, variables: any) {
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
        Origin: 'https://marketplace.roninchain.com',
        Referer: 'https://marketplace.roninchain.com/',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'sec-ch-ua':
          '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      // console.error(`GraphQL Fetch Error: ${res.status}`);
      return null;
    }
    const json = await res.json();
    return json.data;
  } catch (e) {
    console.error('Fetch exception:', e);
    return null;
  }
}

// --- Main Data Fetcher ---

export async function fetchDashboardData() {
  const ronPriceData = await fetchRonPrice();
  const ronPrice = ronPriceData.usdPrice;

  // 1. Fetch Stats
  const [mokiData, boosterData] = await Promise.all([
    fetchGraphQL(GET_TOKEN_DATA, { tokenAddress: MOKI_ADDRESS }),
    fetchGraphQL(GET_TOKEN_DATA, { tokenAddress: BOOSTER_ADDRESS }),
  ]);

  // 2. Fetch Listings by Fur (Moki Only)
  // UPDATED ORDER: Rainbow > Gold > Spirit > Shadow
  // Note: "Common" is added programmatically to the beginning later.
  const furs = ['Rainbow', 'Gold', 'Spirit', 'Shadow'];

  const furPromises = furs.map((fur) =>
    fetchGraphQL(GET_ERC721_COUNT, {
      tokenAddress: MOKI_ADDRESS,
      auctionType: 'Sale',
      size: 0,
      from: 0,
      sort: 'PriceAsc',
      criteria: [{ name: 'Fur', values: [fur] }],
      slug: null,
      owner: null,
      name: null,
      priceRange: null,
      rangeCriteria: [],
      excludeAddress: null,
    })
  );

  const furResults = await Promise.all(furPromises);

  const listingsByFur = furs.map((fur, i) => ({
    fur,
    count: furResults[i]?.erc721Tokens?.total || 0,
    color:
      fur === 'Spirit'
        ? '#a4f4f9'
        : fur === 'Shadow'
        ? '#8a65db'
        : fur === 'Gold'
        ? '#ffd700'
        : fur === 'Rainbow'
        ? '#ff99cc'
        : '#a1a1aa',
  }));

  // Common Listings Calculation (Total - Sum of Specials)
  const totalMokiListings = mokiData?.tokenData?.totalListing || 0;
  const specialCount = listingsByFur.reduce((acc, curr) => acc + curr.count, 0);

  // Add Common to the start of the list
  listingsByFur.unshift({
    fur: 'Common',
    count: Math.max(0, totalMokiListings - specialCount),
    color: '#a1a1aa',
  });

  // 3. Fetch Activities
  const fetchActivity = (address: string, type: string) =>
    fetchGraphQL(GET_COLLECTION_ACTIVITIES, {
      tokenAddress: address,
      activityTypes: [type],
      size: 10,
    });

  const [
    mokiSales,
    mokiListings,
    mokiOffers,
    mokiTransfers,
    boosterSales,
    boosterListings,
    boosterOffers,
    boosterTransfers,
  ] = await Promise.all([
    fetchActivity(MOKI_ADDRESS, 'Sale'),
    fetchActivity(MOKI_ADDRESS, 'Listing'),
    fetchActivity(MOKI_ADDRESS, 'Offer'),
    fetchActivity(MOKI_ADDRESS, 'Transfer'),
    fetchActivity(BOOSTER_ADDRESS, 'Sale'),
    fetchActivity(BOOSTER_ADDRESS, 'Listing'),
    fetchActivity(BOOSTER_ADDRESS, 'Offer'),
    fetchActivity(BOOSTER_ADDRESS, 'Transfer'),
  ]);

  // Helper: Parse Stats
  const parseStats = (data: any) => {
    const t = data?.tokenData;
    const volumeRon = t?.volumeAllTime;
    const floorRon = t?.minPrice ? Number(t.minPrice) / 1e18 : 0;

    return {
      volume: volumeRon,
      volumeUsd: volumeRon * ronPrice,
      floor: floorRon,
      floorUsd: floorRon * ronPrice,
      supply: t?.totalItems || 0,
      owners: t?.totalOwners || 0,
      listings: t?.totalListing || 0,
    };
  };

  // Helper: Parse Activity List
  const parseActivityList = (data: any) => {
    return (
      data?.activities?.results?.map((item: any) => {
        const token = item.asset?.token;
        const name = token?.erc721Name || token?.erc1155Name || 'Unknown';
        const id = token?.erc721TokenId || token?.erc1155TokenId || '?';
        const image =
          token?.erc721CdnImage || token?.erc721Image || token?.erc1155CdnImage;

        const priceWei =
          item.metadata?.price || item.metadata?.item_price || '0';
        const price = Number(priceWei) / 1e18;

        return {
          id,
          name,
          image,
          price,
          type: item.activityType,
          from: item.fromProfile?.name || item.from?.slice(0, 6) || '?',
          to: item.toProfile?.name || item.to?.slice(0, 6) || '?',
          time: item.timestamp
            ? new Date(item.timestamp * 1000).toLocaleString()
            : '',
          timestamp: item.timestamp,
        };
      }) || []
    );
  };

  return {
    ronPrice,
    moki: {
      ...parseStats(mokiData),
      listingsByFur,
      activity: {
        sales: parseActivityList(mokiSales),
        listings: parseActivityList(mokiListings),
        offers: parseActivityList(mokiOffers),
        transfers: parseActivityList(mokiTransfers),
      },
    },
    booster: {
      ...parseStats(boosterData),
      activity: {
        sales: parseActivityList(boosterSales),
        listings: parseActivityList(boosterListings),
        offers: parseActivityList(boosterOffers),
        transfers: parseActivityList(boosterTransfers),
      },
    },
  };
}
