import {
  IconLayoutDashboard,
  IconCards,
  IconDeviceGamepad2,
  IconChartBar,
  IconBuildingStore,
  IconTrophy,
} from '@tabler/icons-react';
import { MokuAsset, Rarity, TimeRange } from './types';

export const HISTORY_DATA: Record<
  TimeRange,
  { date: string; value: number }[]
> = {
  '24h': [
    { date: '00:00', value: 15200 },
    { date: '04:00', value: 15230 },
    { date: '08:00', value: 15180 },
    { date: '12:00', value: 15250 },
    { date: '16:00', value: 15300 },
    { date: '20:00', value: 15280 },
    { date: '23:59', value: 15230 },
  ],
  '7d': [
    { date: 'Mon', value: 14800 },
    { date: 'Tue', value: 14950 },
    { date: 'Wed', value: 14900 },
    { date: 'Thu', value: 15100 },
    { date: 'Fri', value: 15050 },
    { date: 'Sat', value: 15200 },
    { date: 'Sun', value: 15230 },
  ],
  '30d': [
    { date: 'Week 1', value: 13500 },
    { date: 'Week 2', value: 14200 },
    { date: 'Week 3', value: 14800 },
    { date: 'Week 4', value: 15230 },
  ],
  All: [
    { date: 'Jan', value: 1250 },
    { date: 'Feb', value: 2500 },
    { date: 'Mar', value: 4800 },
    { date: 'Apr', value: 4200 },
    { date: 'May', value: 6500 },
    { date: 'Jun', value: 9800 },
    { date: 'Jul', value: 11200 },
    { date: 'Aug', value: 15230 },
  ],
};

export const RARITY_DISTRIBUTION = [
  {
    name: 'Card Rarity',
    Common: 45,
    Uncommon: 30,
    Rare: 15,
    Epic: 8,
    Legendary: 2,
  },
];

export const TOP_ASSETS: MokuAsset[] = [
  {
    id: 'moki-1',
    name: 'Dark Doodie',
    rarity: 'Common',
    type: 'Moki',
    floorPriceRon: 45,
    stars: 2,
    color: '#9ca3af',
    description:
      'A mysterious Moki shrouded in dark energy. Often found lurking in shadows, plotting its next move.',
    stats: [
      { label: 'Element', value: 'Shadow' },
      { label: 'Power', value: '120' },
      { label: 'Artist', value: 'MOMOMOOING' },
    ],
  },
  {
    id: 'scheme-1',
    name: 'Beat The Buzzer',
    rarity: 'Rare',
    type: 'Scheme',
    floorPriceRon: 350,
    stars: 3,
    color: '#3b82f6',
    description:
      '+300 points when winning Gacha Ball delivered to base. A game-changing scheme for clutch moments.',
    stats: [
      { label: 'Effect', value: 'Score Boost' },
      { label: 'Trigger', value: 'Delivery' },
      { label: 'Artist', value: 'DELIRIUM + RXICHOO' },
    ],
  },
  {
    id: 'moki-2',
    name: 'Zesty Von Grump',
    rarity: 'Rare',
    type: 'Moki',
    floorPriceRon: 125,
    stars: 2,
    color: '#4ade80',
    description:
      'Always sour, always grumpy. This citrus-infused Moki brings a tangy attitude to the arena.',
    stats: [
      { label: 'Element', value: 'Nature' },
      { label: 'Attitude', value: 'Sour' },
      { label: 'Artist', value: 'RXICHOO' },
    ],
  },
  {
    id: 'scheme-2',
    name: 'Aggressive Specialization',
    rarity: 'Uncommon',
    type: 'Scheme',
    floorPriceRon: 88,
    stars: 2,
    color: '#60a5fa',
    description:
      'Eliminations are worth double points. Delivering Gacha Balls is worth no Points. Pure combat focus.',
    stats: [
      { label: 'Effect', value: 'Combat Multiplier' },
      { label: 'Penalty', value: 'No Delivery Pts' },
      { label: 'Artist', value: 'DELIRIUM' },
    ],
  },
  {
    id: 'moki-3',
    name: 'Duchess Doodle',
    rarity: 'Epic',
    type: 'Moki',
    floorPriceRon: 850,
    stars: 6,
    color: '#a78bfa',
    description:
      'Royalty of the canvas. She paints her victory with broad strokes and an imperious gaze.',
    stats: [
      { label: 'Element', value: 'Arcane' },
      { label: 'Rank', value: 'Nobility' },
      { label: 'Artist', value: 'RXICHOO' },
    ],
  },
  {
    id: 'moki-4',
    name: 'Master Nanner',
    rarity: 'Epic',
    type: 'Moki',
    floorPriceRon: 920,
    stars: 4,
    color: '#fbbf24',
    description:
      'A master of disguise or just a fan of potassium? The mask hides a thousand secrets.',
    stats: [
      { label: 'Element', value: 'Light' },
      { label: 'Weapon', value: 'Banana' },
      { label: 'Artist', value: 'RXICHOO' },
    ],
  },
];

export const RECENT_ACTIVITY = [
  {
    type: 'Bought',
    item: 'Moku #332',
    price: '45 RON',
    time: '2h ago',
    positive: false,
  },
  {
    type: 'Sold',
    item: 'Arena Pass',
    price: '120 RON',
    time: '5h ago',
    positive: true,
  },
  {
    type: 'Minted',
    item: 'Booster Pack',
    price: '10 RON',
    time: '1d ago',
    positive: false,
  },
  {
    type: 'Received',
    item: 'Moku #999',
    price: '-',
    time: '2d ago',
    positive: true,
  },
];

export const RARITY_COLORS: Record<Rarity, string> = {
  Common: '#9ca3af',
  Uncommon: '#86efac',
  Rare: '#60a5fa',
  Epic: '#a78bfa',
  Legendary: '#fb923c',
};

export const NAV_ITEMS = [
  { name: 'Dashboard', icon: IconLayoutDashboard },
  { name: 'Collection', icon: IconCards },
  { name: 'Deck Builder', icon: IconDeviceGamepad2 },
  { name: 'Arena Stats', icon: IconChartBar },
  { name: 'Marketplace', icon: IconBuildingStore },
  { name: 'Leaderboard', icon: IconTrophy },
];

export const SUPPORT_ADDRESS = '0x61759fb5255532f8f977d0a51b7037651becac74';

export const SHORT_ADDRESS = `${SUPPORT_ADDRESS.slice(0, 6)}...${SUPPORT_ADDRESS.slice(
  -4
)}`;
