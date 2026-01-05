export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

export interface MoralisAttribute {
  trait_type: string;
  value: string | number;
  rarity_label?: string;
}

export interface RealNFT {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  contractType: 'Moki' | 'Booster' | 'Unknown';
  type: 'Moki NFT' | 'Booster Box';
  rarity: Rarity;
  rarityLabel: string;
  rarityRank: number;
  floorPrice: number;
  change24h: number; // Added: Simulates individual asset performance
  lastSale: number;
  attributes: MoralisAttribute[];
  contractAddress: string;
  color: string;
}
