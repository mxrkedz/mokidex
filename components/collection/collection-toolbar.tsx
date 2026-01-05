'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { IconSearch, IconFilter, IconRefresh } from '@tabler/icons-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type SortOption =
  | 'most-rare'
  | 'least-rare'
  | 'most-value'
  | 'least-value';

interface CollectionToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  sortOption: SortOption;
  setSortOption: (val: SortOption) => void;
  onRefresh: () => void;
}

export function CollectionToolbar({
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  onRefresh,
}: CollectionToolbarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Top Row: Search, Sort, Refresh */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Left: Search & Filter */}
        <div className="flex flex-1 gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:max-w-xs">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          {/* Sort Select */}
          <div className="relative w-48">
            <select
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none cursor-pointer"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
            >
              <option value="most-value">Most Value</option>
              <option value="least-value">Least Value</option>
              <option value="most-rare">Most Rare</option>
              <option value="least-rare">Least Rare</option>
            </select>
            <IconFilter className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Right: Refresh Button */}
        <div className="flex items-center w-full md:w-auto justify-end">
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            className="w-9 h-9"
            title="Refresh Collection"
          >
            <IconRefresh size={18} />
          </Button>
        </div>
      </div>

      {/* Bottom Row: Tabs */}
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="All">All Items</TabsTrigger>
          <TabsTrigger value="Moki">Moki NFT</TabsTrigger>
          <TabsTrigger value="Booster">Booster Box</TabsTrigger>
        </TabsList>
      </div>
    </div>
  );
}
