'use server';

import { Rarity } from '@/lib/nft-types';

const MOKI_CONTRACT = '0x47b5a7c2e4f07772696bbf8c8c32fe2b9eabd550';
const GRAPHQL_ENDPOINT = 'https://marketplace-graphql.skymavis.com/graphql';
const API_KEY = process.env.SKY_MAVIS_API_KEY || '';

// --- EXACT QUERY FROM YOUR PAYLOAD ---
const GRAPHQL_QUERY = `
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

async function fetchFloorForTrait(
  traitType: string,
  traitValue: string
): Promise<number> {
  try {
    const variables = {
      from: 0,
      size: 5, // Fetch a few to ensure we find one with a valid order
      sort: 'PriceAsc',
      auctionType: 'All', // Matches your payload
      criteria: [
        {
          name: traitType,
          values: [traitValue],
        },
      ],
      tokenAddress: MOKI_CONTRACT,
      includeLastSalePrice: true,
      includeReceivedTimestamp: false,
      rangeCriteria: [],
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (API_KEY) {
      headers['X-API-Key'] = API_KEY;
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        operationName: 'GetERC721TokensList',
        query: GRAPHQL_QUERY,
        variables,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[Market API Error] ${traitValue}: ${response.status}`);
      return 0;
    }

    const json = await response.json();
    const results = json.data?.erc721Tokens?.results;

    if (results && Array.isArray(results)) {
      // Find the first result that actually has an active listing order
      const cheapestListing = results.find(
        (item: { order?: { currentPrice?: string } }) =>
          item.order && item.order.currentPrice
      );

      if (cheapestListing) {
        const weiPrice = cheapestListing.order.currentPrice;
        const ronPrice = parseFloat(weiPrice) / 1e18;
        console.log(`✅ ${traitValue} Floor: ${ronPrice} RON`);
        return ronPrice;
      }
    }

    console.log(`⚠️ No listings for ${traitValue}`);
    return 0;
  } catch (error) {
    console.error(`Failed to fetch floor for ${traitValue}:`, error);
    return 0;
  }
}

export async function fetchRealTraitFloors(): Promise<Record<Rarity, number>> {
  // Fetch specific rarities
  const [spirit, shadow, gold, rainbow, oneOfOne] = await Promise.all([
    fetchFloorForTrait('Fur', 'Spirit'),
    fetchFloorForTrait('Fur', 'Shadow'),
    fetchFloorForTrait('Fur', 'Gold'),
    fetchFloorForTrait('Fur', 'Rainbow'),
    // Try 'Fur' for 1 of 1 first, as per your payload structure
    fetchFloorForTrait('Fur', '1 of 1'),
  ]);

  return {
    '1 of 1': oneOfOne > 0 ? oneOfOne : 0,
    Spirit: spirit,
    Shadow: shadow,
    Gold: gold,
    Rainbow: rainbow,
    Common: 0,
  };
}
