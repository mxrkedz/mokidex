import {
  IconLayoutDashboard,
  IconCircleX,
  IconBubble,
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
    Common: 59,
    Rainbow: 20,
    Gold: 10,
    Shadow: 7,
    Spirit: 3,
    '1 of 1': 1,
  },
];

// Specific Floor Prices for Traits (in RON)
// These values override the collection floor price multiplier logic.

export const TOP_ASSETS: MokuAsset[] = [
  {
    id: 'moki-0',
    name: 'The Origin',
    rarity: '1 of 1',
    type: 'Moki',
    floorPriceRon: 150000,
    stars: 5,
    color: '#dc2626',
    description: 'The very first Moki ever created.',
    stats: [
      { label: 'Element', value: 'Divine' },
      { label: 'Type', value: '1 of 1' },
    ],
  },
  {
    id: 'moki-1',
    name: 'Dark Doodie',
    rarity: 'Shadow',
    type: 'Moki',
    floorPriceRon: 22000,
    stars: 4,
    color: '#7c3aed',
    description: 'A mysterious Moki shrouded in dark energy.',
    stats: [
      { label: 'Element', value: 'Shadow' },
      { label: 'Fur', value: 'Shadow' },
    ],
  },
  {
    id: 'moki-2',
    name: 'Gilded Grump',
    rarity: 'Gold',
    type: 'Moki',
    floorPriceRon: 8500,
    stars: 3,
    color: '#eab308',
    description: 'Shining bright with a heart of gold.',
    stats: [
      { label: 'Element', value: 'Metal' },
      { label: 'Fur', value: 'Gold' },
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
];

export const RARITY_COLORS: Record<Rarity, string> = {
  Common: '#9ca3af', // Gray
  Rainbow: '#f472b6', // Pink
  Gold: '#eab308', // Gold
  Shadow: '#7c3aed', // Violet
  Spirit: '#06b6d4', // Cyan
  '1 of 1': '#dc2626', // Red/Crimson
};

export const NAV_ITEMS = [
  { name: 'Dashboard', icon: IconLayoutDashboard, href: '/' },
  { name: 'Mokullection', icon: IconCircleX, href: '/collection' },
  { name: 'More Comming Soon', icon: IconBubble, href: '#' },
  // { name: 'Arena Stats', icon: IconChartBar, href: '#' },
  // { name: 'Marketplace', icon: IconBuildingStore, href: '#' },
  // { name: 'Leaderboard', icon: IconTrophy, href: '#' },
];

export const SUPPORT_ADDRESS = '0x387aa341db18fc0b4e685ecbcbe0ad775f5c760b';

export const SHORT_ADDRESS = `${SUPPORT_ADDRESS.slice(
  0,
  6
)}...${SUPPORT_ADDRESS.slice(-4)}`;
