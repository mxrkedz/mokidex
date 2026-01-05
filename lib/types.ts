export type Rarity =
  | '1 of 1'
  | 'Spirit'
  | 'Shadow'
  | 'Gold'
  | 'Rainbow'
  | 'Common';

export type CardType =
  | 'Moki'
  | 'Scheme'
  | 'Promo'
  | 'Booster Box'
  | 'Pack'
  | 'Moki NFT';

export type TimeRange = '24h' | '7d' | '30d' | 'All';

export interface MokuAsset {
  id: string;
  name: string;
  rarity: Rarity;
  type: CardType;
  floorPriceRon: number;
  stars: number;
  description: string;
  stats: {
    label: string;
    value: string;
  }[];
  color: string;
}
