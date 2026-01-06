// lib/nft-types.ts

export type Rarity =
  | '1 of 1'
  | 'Spirit'
  | 'Shadow'
  | 'Gold'
  | 'Rainbow'
  | 'Common';

export interface RoninAttribute {
  key: string;
  value: string;
  count?: number;
  percentage?: number;
}

export interface RealNFT {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  cdnImage?: string;
  contractType: 'Moki' | 'Booster' | 'Unknown';
  type: 'Moki NFT' | 'Booster Box';
  rarity: Rarity;
  rarityLabel: string;
  rarityRank: number;
  floorPrice: number;
  listingPrice?: number;
  change24h: number;
  lastSale: number;
  acquiredAt: number; // New field for timestamp
  attributes: RoninAttribute[];
  contractAddress: string;
  color: string;
}
