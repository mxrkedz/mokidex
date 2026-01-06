/* eslint-disable @typescript-eslint/no-explicit-any */
// app/actions/fetch-nfts.ts
'use server';

import { RealNFT, Rarity, RoninAttribute } from '@/lib/nft-types';

const GRAPHQL_URL = 'https://marketplace-graphql.skymavis.com/graphql';
const MOKI_CONTRACT = '0x47b5a7c2e4f07772696bbf8c8c32fe2b9eabd550';
const BOOSTER_CONTRACT = '0x3a3ea46230688a20ee45ec851dc81f76371f1235';

// --- Queries ---

const GET_ERC721_LIST = `
query GetERC721TokensList($tokenAddress: String, $slug: String, $owner: String, $auctionType: AuctionType, $criteria: [SearchCriteria!], $from: Int!, $size: Int!, $sort: SortBy, $name: String, $priceRange: InputRange, $rangeCriteria: [RangeSearchCriteria!], $excludeAddress: String, $includeLastSalePrice: Boolean!, $includeReceivedTimestamp: Boolean!) {
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
    results {
      ...Erc721TokenBrief
      __typename
    }
    __typename
  }
}

fragment Erc721TokenBrief on Erc721 {
  tokenAddress
  tokenId
  slug
  owner
  name
  order {
    ...OrderInfo
    assets {
      address
      id
      orderId
      token {
        ... on Erc721 {
          image
          cdnImage
          tokenId
          tokenAddress
          name
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
  image
  cdnImage
  video
  isLocked
  attributes
  traitDistribution {
    ...TokenTrait
    __typename
  }
  collectionMetadata
  ownerProfile {
    name
    accountId
    __typename
  }
  badged
  lastSalePrice: price @include(if: $includeLastSalePrice)
  receivedTimestamp @include(if: $includeReceivedTimestamp)
  __typename
}

fragment OrderInfo on Order {
  id
  maker
  kind
  assets {
    ...AssetInfo
    __typename
  }
  expiredAt
  paymentToken
  startedAt
  basePrice
  expectedState
  nonce
  marketFeePercentage
  signature
  hash
  duration
  timeLeft
  currentPrice
  suggestedPrice
  makerProfile {
    ...PublicProfileBrief
    __typename
  }
  orderStatus
  orderQuantity {
    orderId
    quantity
    remainingQuantity
    availableQuantity
    __typename
  }
  __typename
}

fragment AssetInfo on Asset {
  erc
  address
  id
  quantity
  orderId
  __typename
}

fragment PublicProfileBrief on PublicProfile {
  accountId
  addresses {
    ...Addresses
    __typename
  }
  activated
  name
  __typename
}

fragment Addresses on NetAddresses {
  ethereum
  ronin
  __typename
}

fragment TokenTrait on TokenTrait {
  key
  value
  count
  percentage
  displayType
  maxValue
  __typename
}
`;

// --- Helpers ---

async function fetchGraphQL(query: string, variables: any) {
  try {
    const cleanVariables = JSON.parse(JSON.stringify(variables));

    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Origin: 'https://marketplace.skymavis.com',
        Referer: 'https://marketplace.skymavis.com/',
      },
      body: JSON.stringify({
        operationName: 'GetERC721TokensList',
        query,
        variables: cleanVariables,
      }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('GraphQL Error response:', errorText);
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    if (json.errors) {
      console.error('GraphQL Query Errors:', json.errors);
      throw new Error('GraphQL Query Error');
    }

    return json.data;
  } catch (error) {
    console.error('Fetch failed:', error);
    return null;
  }
}

function parsePrice(wei: string | undefined): number {
  if (!wei) return 0;
  return parseInt(wei) / 1e18;
}

function getMokiRarity(attributes: RoninAttribute[]): Rarity {
  const fur = attributes.find((a) => a.key === 'Fur')?.value;
  if (fur === 'Spirit') return 'Spirit';
  if (fur === 'Shadow') return 'Shadow';
  if (fur === 'Gold') return 'Gold';
  if (fur === 'Rainbow') return 'Rainbow';
  return 'Common';
}

function getRarityColor(rarity: Rarity): string {
  switch (rarity) {
    case 'Spirit':
      return '#a4f4f9';
    case 'Shadow':
      return '#8a65db';
    case 'Gold':
      return '#ffd700';
    case 'Rainbow':
      return '#ff99cc';
    case '1 of 1':
      return '#ff0000';
    default:
      return '#a1a1aa';
  }
}

async function fetchAllUserTokens(owner: string, tokenAddress: string) {
  const BATCH_SIZE = 50;

  const baseVariables = {
    auctionType: 'All',
    criteria: [],
    from: 0,
    size: BATCH_SIZE,
    sort: 'PriceAsc',
    name: undefined,
    priceRange: undefined,
    rangeCriteria: [],
    excludeAddress: undefined,
    includeLastSalePrice: true,
    includeReceivedTimestamp: true,
    owner,
    tokenAddress,
  };

  const firstBatch = await fetchGraphQL(GET_ERC721_LIST, baseVariables);

  if (!firstBatch?.erc721Tokens) return [];

  const total = firstBatch.erc721Tokens.total;
  let allResults = [...firstBatch.erc721Tokens.results];

  if (total > BATCH_SIZE) {
    const promises = [];
    for (let i = BATCH_SIZE; i < total; i += BATCH_SIZE) {
      promises.push(
        fetchGraphQL(GET_ERC721_LIST, {
          ...baseVariables,
          from: i,
        })
      );
    }

    const remainingBatches = await Promise.all(promises);

    remainingBatches.forEach((batch) => {
      if (batch?.erc721Tokens?.results) {
        allResults = [...allResults, ...batch.erc721Tokens.results];
      }
    });
  }

  return allResults;
}

// --- Main Action ---

export async function fetchWalletNFTs(
  walletAddress: string
): Promise<RealNFT[]> {
  if (!walletAddress) return [];

  // 1. Fetch User Assets
  const [userMokis, userBoosters] = await Promise.all([
    fetchAllUserTokens(walletAddress, MOKI_CONTRACT),
    fetchAllUserTokens(walletAddress, BOOSTER_CONTRACT),
  ]);

  // 2. Fetch Market Floor Prices
  const floorVariables = {
    auctionType: 'All',
    criteria: [],
    from: 0,
    size: 1,
    sort: 'PriceAsc',
    name: undefined,
    priceRange: undefined,
    rangeCriteria: [],
    excludeAddress: undefined,
    includeLastSalePrice: true,
    includeReceivedTimestamp: false,
    owner: undefined,
  };

  const [
    floorCommon,
    floorSpirit,
    floorShadow,
    floorGold,
    floorRainbow,
    floorBooster,
  ] = await Promise.all([
    fetchGraphQL(GET_ERC721_LIST, {
      ...floorVariables,
      tokenAddress: MOKI_CONTRACT,
    }),
    fetchGraphQL(GET_ERC721_LIST, {
      ...floorVariables,
      tokenAddress: MOKI_CONTRACT,
      criteria: [{ name: 'Fur', values: ['Spirit'] }],
    }),
    fetchGraphQL(GET_ERC721_LIST, {
      ...floorVariables,
      tokenAddress: MOKI_CONTRACT,
      criteria: [{ name: 'Fur', values: ['Shadow'] }],
    }),
    fetchGraphQL(GET_ERC721_LIST, {
      ...floorVariables,
      tokenAddress: MOKI_CONTRACT,
      criteria: [{ name: 'Fur', values: ['Gold'] }],
    }),
    fetchGraphQL(GET_ERC721_LIST, {
      ...floorVariables,
      tokenAddress: MOKI_CONTRACT,
      criteria: [{ name: 'Fur', values: ['Rainbow'] }],
    }),
    fetchGraphQL(GET_ERC721_LIST, {
      ...floorVariables,
      tokenAddress: BOOSTER_CONTRACT,
    }),
  ]);

  const prices = {
    Common: parsePrice(
      floorCommon?.erc721Tokens?.results[0]?.order?.currentPrice
    ),
    Spirit: parsePrice(
      floorSpirit?.erc721Tokens?.results[0]?.order?.currentPrice
    ),
    Shadow: parsePrice(
      floorShadow?.erc721Tokens?.results[0]?.order?.currentPrice
    ),
    Gold: parsePrice(floorGold?.erc721Tokens?.results[0]?.order?.currentPrice),
    Rainbow: parsePrice(
      floorRainbow?.erc721Tokens?.results[0]?.order?.currentPrice
    ),
    Booster: parsePrice(
      floorBooster?.erc721Tokens?.results[0]?.order?.currentPrice
    ),
    '1 of 1': 0,
  };

  // 3. Map User Assets
  const mappedMokis: RealNFT[] = userMokis.map((token: any) => {
    let attributes: RoninAttribute[] = [];
    if (token.attributes) {
      if (Array.isArray(token.attributes)) {
        attributes = token.attributes;
      } else {
        attributes = Object.entries(token.attributes).map(
          ([key, values]: [string, any]) => ({
            key: key,
            value: Array.isArray(values) ? values[0] : values,
          })
        );
      }
    }

    const rarity = getMokiRarity(attributes);
    const listingPrice = parsePrice(token.order?.currentPrice);

    return {
      id: `${token.tokenAddress}-${token.tokenId}`,
      tokenId: token.tokenId,
      name: token.name || `Moki #${token.tokenId}`,
      description: 'A Moki from the Moku Grand Arena.',
      image: token.cdnImage || token.image,
      contractType: 'Moki',
      type: 'Moki NFT',
      rarity: rarity,
      rarityLabel: rarity,
      rarityRank: 0,
      floorPrice: prices[rarity] || prices.Common,
      listingPrice: listingPrice > 0 ? listingPrice : undefined,
      change24h: 0,
      lastSale: parsePrice(token.lastSalePrice),
      acquiredAt: token.receivedTimestamp
        ? parseInt(token.receivedTimestamp)
        : 0,
      attributes: attributes,
      contractAddress: token.tokenAddress,
      color: getRarityColor(rarity),
    };
  });

  const mappedBoosters: RealNFT[] = userBoosters.map((token: any) => {
    const listingPrice = parsePrice(token.order?.currentPrice);

    // FIXED: Parse Booster Attributes instead of empty array
    let attributes: RoninAttribute[] = [];
    if (token.attributes) {
      if (Array.isArray(token.attributes)) {
        attributes = token.attributes;
      } else {
        attributes = Object.entries(token.attributes).map(
          ([key, values]: [string, any]) => ({
            key: key,
            value: Array.isArray(values) ? values[0] : values,
          })
        );
      }
    }

    return {
      id: `${token.tokenAddress}-${token.tokenId}`,
      tokenId: token.tokenId,
      name: token.name || `Booster Box #${token.tokenId}`,
      description: 'Grand Arena Booster Box',
      image: token.cdnImage || token.image,
      contractType: 'Booster',
      type: 'Booster Box',
      rarity: 'Common',
      rarityLabel: 'Common',
      rarityRank: 0,
      floorPrice: prices.Booster,
      listingPrice: listingPrice > 0 ? listingPrice : undefined,
      change24h: 0,
      lastSale: parsePrice(token.lastSalePrice),
      acquiredAt: token.receivedTimestamp
        ? parseInt(token.receivedTimestamp)
        : 0,
      attributes: attributes, // Now correctly passing attributes
      contractAddress: token.tokenAddress,
      color: '#a1a1aa',
    };
  });

  return [...mappedMokis, ...mappedBoosters];
}
