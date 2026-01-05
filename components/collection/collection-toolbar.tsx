'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { IconSearch, IconFilter, IconPlus } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export type SortOption =
  | 'most-rare'
  | 'least-rare'
  | 'most-value'
  | 'least-value';

interface CollectionToolbarProps {
  activeTab: string;
  onTabChange: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  sortOption: SortOption;
  setSortOption: (val: SortOption) => void;
  onAddCard: () => void;
}

export function CollectionToolbar({
  activeTab,
  onTabChange,
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  onAddCard,
}: CollectionToolbarProps) {
  const tabs = [
    { id: 'All', label: 'All Items' },
    { id: 'Moki', label: 'Moki NFT' },
    { id: 'Booster', label: 'Booster Box' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Top Row: Search, Sort, Add */}
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

        {/* Right: Add Button */}
        <div className="flex items-center w-full md:w-auto justify-end">
          <Button
            onClick={onAddCard}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <IconPlus size={16} />
            <span className="hidden sm:inline">Add Custom Item</span>
            <span className="inline sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Bottom Row: Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
