'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { IconSearch, IconPlus, IconFilter } from '@tabler/icons-react';
import { Rarity, CardType } from '@/lib/types';
import { cn } from '@/lib/utils';

// Define the asset categories for the filter
export type AssetCategory =
  | 'All'
  | 'Booster Box'
  | 'Cards'
  | 'Packs'
  | 'Moku NFT';

interface CollectionToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  rarityFilter: Rarity | 'All';
  setRarityFilter: (val: Rarity | 'All') => void;
  assetCategory: AssetCategory;
  setAssetCategory: (val: AssetCategory) => void;
  onAddCard: () => void;
}

export function CollectionToolbar({
  searchQuery,
  setSearchQuery,
  rarityFilter,
  setRarityFilter,
  assetCategory,
  setAssetCategory,
  onAddCard,
}: CollectionToolbarProps) {
  const categories: AssetCategory[] = [
    'All',
    'Booster Box',
    'Cards',
    'Packs',
    'Moku NFT',
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Row: Asset Category Tabs & Add Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setAssetCategory(cat)}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                assetCategory === cat
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Add Card Button (Matching Header Style) */}
        <Button
          onClick={onAddCard}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
        >
          <IconPlus size={16} />
          <span className="hidden sm:inline">Add Custom Asset</span>
          <span className="inline sm:hidden">Add</span>
        </Button>
      </div>

      {/* Bottom Row: Search & Rarity Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Rarity Select */}
        <div className="relative w-full sm:w-[180px]">
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer"
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value as Rarity | 'All')}
          >
            <option value="All">All Rarities</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
          </select>
          <IconFilter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
