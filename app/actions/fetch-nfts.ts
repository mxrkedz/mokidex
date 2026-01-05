'use server';

import { RealNFT, Rarity } from '@/lib/nft-types';
import { fetchRealTraitFloors } from '@/app/actions/fetch-market-data';

const MOKI_CONTRACT = '0x47b5a7c2e4f07772696bbf8c8c32fe2b9eabd550';
const BOOSTER_CONTRACT = '0x3a3ea46230688a20ee45ec851dc81f76371f1235';

interface MoralisRawNFT {
  token_id: string;
  token_address: string;
  metadata?: string | Record<string, unknown>;
  normalized_metadata?: {
    name?: string;
    description?: string;
    image?: string;
    attributes?: { trait_type: string; value: string | number }[];
  };
  collection_logo?: string;
  rarity_label?: string;
  rarity_rank?: number;
  floor_price?: string;
  last_sale?: {
    price?: string;
  };
}

function getTraitRarity(
  attributes: { trait_type: string; value: string | number }[]
): Rarity {
  // 1. Check for "1 of 1"
  const isOneOfOne = attributes.some(
    (attr) =>
      String(attr.value).toLowerCase() === '1 of 1' ||
      attr.trait_type.toLowerCase() === '1 of 1' ||
      String(attr.value).toLowerCase() === '1/1'
  );
  if (isOneOfOne) return '1 of 1';

  // 2. Check Fur Types
  const furTrait = attributes.find(
    (attr) =>
      attr.trait_type === 'Fur Type' ||
      attr.trait_type === 'Fur' ||
      attr.trait_type === 'Type'
  );

  if (furTrait) {
    const value = String(furTrait.value).toLowerCase();
    if (value.includes('spirit')) return 'Spirit';
    if (value.includes('shadow')) return 'Shadow';
    if (value.includes('gold')) return 'Gold';
    if (value.includes('rainbow')) return 'Rainbow';
    if (value.includes('1 of 1')) return '1 of 1';
  }

  return 'Common';
}

function getRarityColor(rarity: Rarity): string {
  switch (rarity) {
    case '1 of 1':
      return '#dc2626';
    case 'Spirit':
      return '#06b6d4';
    case 'Shadow':
      return '#7c3aed';
    case 'Gold':
      return '#eab308';
    case 'Rainbow':
      return '#f472b6';
    default:
      return '#9ca3af';
  }
}

export async function fetchWalletNFTs(walletAddress: string) {
  const apiKey = process.env.MORALIS_API_KEY;
  if (!apiKey || !walletAddress) return [];

  // 1. Fetch real prices first
  const traitFloors = await fetchRealTraitFloors();
  console.log('--- Trait Prices ---', traitFloors);

  const baseUrl = `https://deep-index.moralis.io/api/v2.2/${walletAddress}/nft?chain=ronin&format=decimal&token_addresses%5B0%5D=${MOKI_CONTRACT}&token_addresses%5B1%5D=${BOOSTER_CONTRACT}&media_items=true&include_prices=true`;

  let allNFTs: RealNFT[] = [];
  let cursor: string | null = null;

  try {
    do {
      const url: string = cursor ? `${baseUrl}&cursor=${cursor}` : baseUrl;
      const response: Response = await fetch(url, {
        method: 'GET',
        headers: { accept: 'application/json', 'X-API-Key': apiKey },
        cache: 'no-store',
      });

      if (!response.ok)
        throw new Error(`Moralis API error: ${response.status}`);

      const data: { cursor?: string; result: MoralisRawNFT[] } =
        await response.json();
      cursor = data.cursor || null;

      const pageNFTs: RealNFT[] = data.result.map((item: MoralisRawNFT) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let metadata: any = {};
        try {
          metadata =
            typeof item.metadata === 'string'
              ? JSON.parse(item.metadata)
              : item.metadata || {};
        } catch {
          /* ignore */
        }

        let contractType: 'Moki' | 'Booster' | 'Unknown' = 'Unknown';
        let uiType: 'Moki NFT' | 'Booster Box' = 'Moki NFT';

        if (item.token_address.toLowerCase() === MOKI_CONTRACT.toLowerCase()) {
          contractType = 'Moki';
          uiType = 'Moki NFT';
        } else if (
          item.token_address.toLowerCase() === BOOSTER_CONTRACT.toLowerCase()
        ) {
          contractType = 'Booster';
          uiType = 'Booster Box';
        }

        const attributes =
          item.normalized_metadata?.attributes || metadata.attributes || [];
        const rarity: Rarity = getTraitRarity(attributes);
        const color = getRarityColor(rarity);

        // --- PRICING LOGIC ---
        // 1. Get Moralis Generic Collection Floor
        const collectionFloor = parseFloat(item.floor_price || '0');

        // 2. Get Specific Trait Floor from our Mavis fetch
        const specificTraitFloor = traitFloors[rarity];

        // 3. Assign
        const finalFloorPrice =
          specificTraitFloor > 0 ? specificTraitFloor : collectionFloor;

        return {
          id: item.token_id,
          tokenId: item.token_id,
          name:
            item.normalized_metadata?.name ||
            metadata.name ||
            `#${item.token_id}`,
          description:
            item.normalized_metadata?.description || metadata.description || '',
          image:
            item.normalized_metadata?.image ||
            metadata.image ||
            item.collection_logo ||
            '',
          contractType,
          type: uiType,
          rarity,
          rarityLabel: rarity,
          rarityRank: item.rarity_rank || 0,
          floorPrice: finalFloorPrice,
          change24h: 0,
          lastSale: item.last_sale
            ? parseFloat(item.last_sale.price || '0')
            : 0,
          attributes: attributes,
          contractAddress: item.token_address,
          color,
        };
      });

      allNFTs = [...allNFTs, ...pageNFTs];
    } while (cursor && cursor !== '');

    return allNFTs;
  } catch (err) {
    console.error('Error fetching NFTs:', err);
    return allNFTs.length > 0 ? allNFTs : [];
  }
}
