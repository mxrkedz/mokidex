'use client';

import * as React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { RealNFT } from '@/lib/nft-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface CollectionGridProps {
  assets: RealNFT[];
  itemsPerPage?: number;
  onCardClick: (asset: RealNFT) => void;
}

export function CollectionGrid({
  assets,
  itemsPerPage = 25,
  onCardClick,
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
    // Format with commas, up to 2 decimals
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

  if (assets.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl bg-card/50">
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
                'group/card relative overflow-hidden rounded-xl border border-border bg-card hover:bg-muted/50 transition-all hover:scale-[1.02] cursor-pointer'
              )}
            >
              {/* Image Container */}
              <div className="aspect-square w-full bg-muted relative">
                {asset.image ? (
                  <Image
                    src={asset.image}
                    alt={asset.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 font-bold text-4xl uppercase tracking-widest select-none">
                    {asset.rarity ? asset.rarity[0] : '?'}
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold leading-none tracking-tight truncate text-sm">
                  {asset.name}
                </h3>
                <div className="flex items-center justify-between">
                  {/* ID Badge instead of Rarity */}
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-5 px-1.5 font-mono font-medium opacity-80"
                  >
                    #{asset.tokenId}
                  </Badge>

                  {/* Styled Price */}
                  <div className="text-xs font-medium text-right">
                    <span className="text-foreground font-semibold text-sm">
                      {whole}
                    </span>
                    <span className="text-muted-foreground text-[10px] ml-[1px]">
                      {decimal} RON
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
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
