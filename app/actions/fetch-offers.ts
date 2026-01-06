// app/actions/fetch-offers.ts
'use server';

const GRAPHQL_URL = 'https://marketplace-graphql.skymavis.com/graphql';

const GET_ERC721_TOP_OFFER = `
query GetERC721TopOffer($tokenAddress: String!, $tokenId: String!) {
  bestCollectionAndTraitOffersForNft(
    tokenAddress: $tokenAddress
    tokenId: $tokenId
  ) {
    ...CollectionOfferInfo
    __typename
  }
  erc721Token(tokenAddress: $tokenAddress, tokenId: $tokenId) {
    highestOffer {
      ...OfferInfo
      __typename
    }
    __typename
  }
}

fragment CollectionOfferInfo on CollectionOffer {
  id
  itemPrice
  paymentToken
  signature
  __typename
}

fragment OfferInfo on Order {
  id
  currentPrice
  paymentToken
  signature
  __typename
}
`;

export async function fetchBestOffer(tokenAddress: string, tokenId: string) {
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
        Origin: 'https://marketplace.roninchain.com',
        Referer: 'https://marketplace.roninchain.com/',
      },
      body: JSON.stringify({
        operationName: 'GetERC721TopOffer',
        query: GET_ERC721_TOP_OFFER,
        variables: { tokenAddress, tokenId },
      }),
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const json = await res.json();
    const data = json.data;

    // We prefer the "Collection/Trait" offer as it represents the market floor bid for this trait
    const traitOffer = data?.bestCollectionAndTraitOffersForNft;
    const directOffer = data?.erc721Token?.highestOffer;

    // Helper to parse price (Wei to RON)
    const parseVal = (wei: string) => (wei ? parseInt(wei) / 1e18 : 0);

    const traitPrice = traitOffer ? parseVal(traitOffer.itemPrice) : 0;
    const directPrice = directOffer ? parseVal(directOffer.currentPrice) : 0;

    // Return the highest of the two, strictly as RON
    if (traitPrice >= directPrice && traitPrice > 0) {
      return { price: traitPrice, token: 'RON' };
    } else if (directPrice > 0) {
      return { price: directPrice, token: 'RON' };
    }

    return null; // No offers
  } catch (error) {
    console.error('Failed to fetch offers:', error);
    return null;
  }
}
