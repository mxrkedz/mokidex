'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { IconSearch, IconFilter, IconPlus } from '@tabler/icons-react';
import { Rarity } from '@/lib/types';

interface CollectionToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  rarityFilter: Rarity | 'All';
  setRarityFilter: (val: Rarity | 'All') => void;
  onAddCard: () => void;
}

export function CollectionToolbar({
  searchQuery,
  setSearchQuery,
  rarityFilter,
  setRarityFilter,
  onAddCard,
}: CollectionToolbarProps) {
  return (
    // REMOVED: bg-card border border-border p-4 rounded-xl (now invisible/transparent)
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Left: Search & Filter */}
      <div className="flex flex-1 gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:max-w-xs">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Simple Rarity Select */}
        <div className="relative w-40">
          <select
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none cursor-pointer"
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
          <IconFilter className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center w-full md:w-auto justify-end">
        {/* UPDATED: Button style to match the "Connect Wallet" blue style */}
        <Button
          onClick={onAddCard}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <IconPlus size={16} />
          <span className="hidden sm:inline">Add Custom Card</span>
          <span className="inline sm:hidden">Add</span>
        </Button>
      </div>
    </div>
  );
}
