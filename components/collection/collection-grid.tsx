// components/collection/collection-grid.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import { RealNFT } from '@/lib/nft-types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IconChevronLeft,
  IconChevronRight,
  IconBox,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface CollectionGridProps {
  assets: RealNFT[];
  itemsPerPage?: number;
  onCardClick: (asset: RealNFT) => void;
  isLoading?: boolean;
  ronPrice: number; // Added prop for USD conversion
}

export function CollectionGrid({
  assets,
  itemsPerPage = 25,
  onCardClick,
  isLoading = false,
  ronPrice,
}: CollectionGridProps) {
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [assets.length]);

  const totalPages = Math.ceil(assets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAssets = assets.slice(startIndex, startIndex + itemsPerPage);

  // Helper to split price for styling
  const getPriceParts = (price: number) => {
    const str = price.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    const parts = str.split('.');
    return {
      whole: parts[0],
      decimal: parts[1] ? `.${parts[1]}` : '',
    };
  };

  const formatUsd = (ronValue: number) => {
    const val = ronValue * ronPrice;
    return val.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // -- Loading Skeleton State --
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl bg-card/50">
        <IconBox className="w-10 h-10 opacity-20 mb-2" />
        <p>No Assets Found.</p>
        <span className="text-xs mt-1">
          Try adjusting your filters or importing a wallet.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {currentAssets.map((asset) => {
          const { whole, decimal } = getPriceParts(asset.floorPrice || 0);

          return (
            <div
              key={`${asset.contractAddress}-${asset.id}`}
              onClick={() => onCardClick(asset)}
              className={cn(
                'group/card relative overflow-hidden rounded-xl border border-border bg-card',
                'hover:bg-muted/50 transition-all',
                'hover:scale-[1.02] cursor-pointer'
              )}
            >
              {/* Image Container */}
              <div className="aspect-square w-full bg-muted relative">
                {asset.image ? (
                  <Image
                    src={asset.cdnImage || asset.image}
                    alt={asset.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 font-bold text-4xl uppercase tracking-widest select-none">
                    ?
                  </div>
                )}
                {/* Rarity Badge (Top Right) */}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold font-mono text-white shadow-sm backdrop-blur-sm bg-black/60">
                    #{asset.tokenId}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-3 space-y-2">
                <h3 className="font-semibold leading-none tracking-tight truncate text-xs md:text-sm">
                  {asset.name}
                </h3>
                <div className="flex items-center pt-1 border-t border-border/50">
                  <div className="text-left">
                    {/* RON Price */}
                    <div className="text-xs font-medium">
                      <span className="font-semibold text-xs md:text-sm text-white font-mono">
                        {whole}
                      </span>
                      <span className="text-muted-foreground text-[9px] md:text-[10px] ml-[1px] font-mono">
                        {decimal} RON
                      </span>
                    </div>
                    {/* USD Price */}
                    <div className="text-[10px] text-muted-foreground/80 -mt-0.5 font-mono">
                      ≈ {formatUsd(asset.floorPrice)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8 border-t border-border mt-8">
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
