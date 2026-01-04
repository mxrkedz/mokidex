export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
export type CardType = 'Moki' | 'Scheme' | 'Promo';
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
