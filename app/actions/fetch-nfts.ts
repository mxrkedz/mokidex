'use server';

import { RealNFT, MoralisAttribute, Rarity } from '@/lib/nft-types';

const MOKI_CONTRACT = '0x47b5a7c2e4f07772696bbf8c8c32fe2b9eabd550';
const BOOSTER_CONTRACT = '0x3a3ea46230688a20ee45ec851dc81f76371f1235';

export async function fetchWalletNFTs() {
  const apiKey = process.env.MORALIS_API_KEY;
  if (!apiKey) return [];

  // Base URL without cursor
  const baseUrl =
    'https://deep-index.moralis.io/api/v2.2/0x61759fb5255532f8f977d0a51b7037651becac74/nft?chain=ronin&format=decimal&token_addresses%5B0%5D=0x47b5a7c2e4f07772696bbf8c8c32fe2b9eabd550&token_addresses%5B1%5D=0x3a3ea46230688a20ee45ec851dc81f76371f1235&media_items=true&include_prices=true';

  let allNFTs: RealNFT[] = [];
  let cursor: string | null = null;

  try {
    do {
      // Append cursor to URL if it exists
      const url = cursor ? `${baseUrl}&cursor=${cursor}` : baseUrl;

      const response = await fetch(url, {
        method: 'GET',
        headers: { accept: 'application/json', 'X-API-Key': apiKey },
        cache: 'no-store',
      });

      if (!response.ok)
        throw new Error(`Moralis API error: ${response.status}`);

      const data = await response.json();

      // Update cursor for next iteration (will be null or undefined if no more pages)
      cursor = data.cursor;

      // Process current page results
      const pageNFTs: RealNFT[] = data.result.map((item: any) => {
        let metadata: any = {};
        try {
          metadata =
            typeof item.metadata === 'string'
              ? JSON.parse(item.metadata)
              : item.metadata || {};
        } catch (e) {
          /* ignore */
        }

        // Determine Type
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

        // Rarity
        let rarity: Rarity = 'Common';
        const label = item.rarity_label || '';
        if (label.includes('Top 1%')) rarity = 'Legendary';
        else if (label.includes('Top 5%')) rarity = 'Epic';
        else if (label.includes('Top 20%')) rarity = 'Rare';
        else if (label.includes('Top 40%')) rarity = 'Uncommon';

        const floor = parseFloat(item.floor_price || '0');

        // MOCK 24h Change: Random variation between -5% and +8% per item
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
    // Return whatever was fetched before the error, or empty if nothing
    return allNFTs.length > 0 ? allNFTs : [];
  }
}
