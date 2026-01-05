'use server';

import { RealNFT, Rarity } from '@/lib/nft-types';

const MOKI_CONTRACT = '0x47b5a7c2e4f07772696bbf8c8c32fe2b9eabd550';
const BOOSTER_CONTRACT = '0x3a3ea46230688a20ee45ec851dc81f76371f1235';

// Define an interface for the incoming API data to avoid 'any'
interface MoralisRawNFT {
  token_id: string;
  token_address: string;
  metadata?:
    | string
    | {
        name?: string;
        description?: string;
        image?: string;
        attributes?: unknown[];
      };
  normalized_metadata?: {
    name?: string;
    description?: string;
    image?: string;
    attributes?: unknown[];
  };
  collection_logo?: string;
  rarity_label?: string;
  rarity_rank?: number;
  floor_price?: string;
  last_sale?: {
    price?: string;
  };
}

// Added walletAddress parameter
export async function fetchWalletNFTs(walletAddress: string) {
  const apiKey = process.env.MORALIS_API_KEY;
  if (!apiKey || !walletAddress) return [];

  // Use the passed walletAddress in the URL
  const baseUrl = `https://deep-index.moralis.io/api/v2.2/${walletAddress}/nft?chain=ronin&format=decimal&token_addresses%5B0%5D=${MOKI_CONTRACT}&token_addresses%5B1%5D=${BOOSTER_CONTRACT}&media_items=true&include_prices=true`;

  let allNFTs: RealNFT[] = [];
  let cursor: string | null = null;

  try {
    do {
      // Explicitly type 'url' to fix TS7022 inference error
      const url: string = cursor ? `${baseUrl}&cursor=${cursor}` : baseUrl;

      // Explicitly type 'response'
      const response: Response = await fetch(url, {
        method: 'GET',
        headers: { accept: 'application/json', 'X-API-Key': apiKey },
        cache: 'no-store',
      });

      if (!response.ok)
        throw new Error(`Moralis API error: ${response.status}`);

      // Explicitly type 'data' structure
      const data: { cursor?: string; result: MoralisRawNFT[] } =
        await response.json();

      cursor = data.cursor || null;

      // Use the interface instead of 'any'
      const pageNFTs: RealNFT[] = data.result.map((item: MoralisRawNFT) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let metadata: any = {};
        try {
          metadata =
            typeof item.metadata === 'string'
              ? JSON.parse(item.metadata)
              : item.metadata || {};
        } catch {
          /* ignore - removed unused 'e' */
        }

        let contractType: 'Moki' | 'Booster' | 'Unknown' = 'Unknown';
        let uiType: 'Moki NFT' | 'Booster Box' = 'Moki NFT';
        let color = '#9ca3af';

        if (item.token_address.toLowerCase() === MOKI_CONTRACT.toLowerCase()) {
          contractType = 'Moki';
          uiType = 'Moki NFT';
          color = '#4ade80';
        } else if (
          item.token_address.toLowerCase() === BOOSTER_CONTRACT.toLowerCase()
        ) {
          contractType = 'Booster';
          uiType = 'Booster Box';
          color = '#a78bfa';
        }

        let rarity: Rarity = 'Common';
        const label = item.rarity_label || '';
        if (label.includes('Top 1%')) rarity = 'Legendary';
        else if (label.includes('Top 5%')) rarity = 'Epic';
        else if (label.includes('Top 20%')) rarity = 'Rare';
        else if (label.includes('Top 40%')) rarity = 'Uncommon';

        const floor = parseFloat(item.floor_price || '0');
        const mockChange = Math.random() * 13 - 5;

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
          rarityLabel: item.rarity_label || 'Common',
          rarityRank: item.rarity_rank || 999999,
          floorPrice: floor,
          change24h: mockChange,
          lastSale: item.last_sale
            ? parseFloat(item.last_sale.price || '0')
            : 0,
          attributes:
            metadata.attributes || item.normalized_metadata?.attributes || [],
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
