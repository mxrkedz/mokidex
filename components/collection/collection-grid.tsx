'use client';

import * as React from 'react';
import { MokuAsset } from '@/lib/types';
import { ThreeDCard } from '@/components/shared/three-d-card';
import { Button } from '@/components/ui/button';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface CollectionGridProps {
  assets: MokuAsset[];
  itemsPerPage?: number;
  onCardClick: (asset: MokuAsset) => void;
}

export function CollectionGrid({
  assets,
  itemsPerPage = 12,
  onCardClick,
}: CollectionGridProps) {
  const [currentPage, setCurrentPage] = React.useState(1);

  // Reset page when data changes (e.g. filtering)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [assets.length]);

  const totalPages = Math.ceil(assets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAssets = assets.slice(startIndex, startIndex + itemsPerPage);

  if (assets.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl bg-card/50">
        <p>No cards found.</p>
        <span className="text-xs mt-1">Try adjusting your filters.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentAssets.map((asset) => (
          // Wrapper to capture click and constrain size
          <div
            key={asset.id}
            className="aspect-[4/5] cursor-pointer group perspective-1000"
            onClick={() => onCardClick(asset)}
          >
            <ThreeDCard asset={asset} />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <IconChevronLeft size={16} />
          </Button>

          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <IconChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
