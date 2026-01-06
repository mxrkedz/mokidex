'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IconSearch, IconFilter } from '@tabler/icons-react';

export type SortOption = 'Highest Value' | 'Lowest Value';

interface CollectionToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

export function CollectionToolbar({
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
}: CollectionToolbarProps) {
  return (
    <div className="flex items-center gap-2 w-full md:w-auto">
      {/* Search Input */}
      <div className="relative w-full md:w-[240px]">
        <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 bg-background/50"
        />
      </div>

      {/* Filter / Sort Select */}
      <Select
        value={sortOption}
        onValueChange={(val) => setSortOption(val as SortOption)}
      >
        <SelectTrigger className="w-[160px] h-10 bg-background/50 gap-2">
          <IconFilter size={14} className="text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Highest Value">Highest Value</SelectItem>
          <SelectItem value="Lowest Value">Lowest Value</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
