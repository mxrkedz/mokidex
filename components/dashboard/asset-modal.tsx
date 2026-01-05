'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { IconArrowsExchange } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { RealNFT } from '@/lib/nft-types';
import { ThreeDCard } from '@/components/shared/three-d-card';

const RARITY_COLORS: Record<string, string> = {
  Common: '#9ca3af',
  Rainbow: '#f472b6',
  Gold: '#eab308',
  Shadow: '#7c3aed',
  Spirit: '#06b6d4',
  '1 of 1': '#dc2626',
};

interface AssetModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  asset: RealNFT | null;
  isDarkMode: boolean;
}

export function AssetModal({
  isOpen,
  onClose,
  asset,
  isDarkMode,
}: AssetModalProps) {
  const [isImageLoading, setIsImageLoading] = React.useState(true);

  // Reset loading state when asset changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setIsImageLoading(true);
    }
  }, [isOpen, asset?.id]);

  const getMarketplaceUrl = (currentAsset: RealNFT) => {
    if (currentAsset.contractType === 'Booster') {
      return `https://marketplace.roninchain.com/collections/grandarena/${currentAsset.tokenId}`;
    }
    return `https://marketplace.roninchain.com/collections/moki-genesis/${currentAsset.tokenId}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'sm:max-w-3xl p-0 bg-background text-foreground border-border shadow-2xl focus:outline-none w-[90vw] max-h-[85vh] overflow-y-auto rounded-xl md:overflow-hidden md:max-h-none',
          isDarkMode ? 'dark' : ''
        )}
      >
        <DialogClose className="absolute right-4 top-4 z-50 opacity-70 hover:opacity-100 transition-opacity" />

        {asset && (
          <div className="flex flex-col md:flex-row bg-background h-full md:h-[600px]">
            {/* Left Side: Visual Media */}
            <div className="w-full md:w-1/2 bg-muted/30 p-8 flex items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-border min-h-[300px] md:min-h-full">
              <div className="absolute inset-0 bg-grid-black/5 dark:bg-grid-white/5 [mask-image:linear-gradient(0deg,rgba(0,0,0,0.5),transparent)]" />

              {asset.contractType === 'Booster' ? (
                <ThreeDCard asset={asset} />
              ) : (
                <div className="relative w-full h-full max-w-[320px] max-h-[320px] aspect-square flex items-center justify-center">
                  {/* Skeleton while Image is loading */}
                  {isImageLoading && (
                    <Skeleton className="absolute inset-0 w-full h-full rounded-2xl z-10" />
                  )}

                  <Image
                    src={asset.image}
                    alt={asset.name}
                    fill
                    className={cn(
                      'object-contain drop-shadow-2xl rounded-2xl transition-opacity duration-500',
                      isImageLoading ? 'opacity-0' : 'opacity-100'
                    )}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    onLoad={() => setIsImageLoading(false)}
                  />
                </div>
              )}
            </div>

            {/* Right Side: Details & Actions */}
            <div className="w-full md:w-1/2 p-6 flex flex-col gap-4 h-full overflow-y-auto">
              {/* 1. Moki NFT (Type) */}
              <div className="flex items-center justify-between pr-12">
                <Badge
                  variant="outline"
                  className={cn(
                    'uppercase tracking-widest text-[10px]',
                    asset.type === 'Booster Box'
                      ? 'text-purple-500 border-purple-500/30'
                      : 'text-green-500 border-green-500/30'
                  )}
                >
                  {asset.type}
                </Badge>
                <span className="text-sm font-mono text-muted-foreground">
                  #{asset.tokenId}
                </span>
              </div>

              {/* 2. Moki Name */}
              <DialogTitle className="text-2xl font-bold leading-tight">
                {asset.name}
              </DialogTitle>

              {/* 3. Moki Fur (Rarity) */}
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: RARITY_COLORS[asset.rarity] || '#ccc',
                  }}
                />
                <span className="text-sm font-medium text-muted-foreground">
                  {asset.rarity}
                </span>
              </div>

              {/* 4. Marketplace Button */}
              <div className="py-2">
                <Button
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none h-11"
                  onClick={() =>
                    window.open(getMarketplaceUrl(asset), '_blank')
                  }
                >
                  View on Marketplace <IconArrowsExchange size={18} />
                </Button>
              </div>

              {/* 5. Label: Trait */}
              <h3 className="font-semibold text-sm text-foreground mt-2">
                Traits
              </h3>

              {/* 6. Trait List */}
              <div className="flex-1">
                {asset.attributes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {asset.attributes.map((attr, i) => (
                      <div
                        key={i}
                        className="flex flex-col p-3 rounded-md border border-border bg-card/50"
                      >
                        <span className="text-[10px] uppercase text-muted-foreground font-semibold mb-1 truncate">
                          {attr.trait_type}
                        </span>
                        <span className="font-medium text-foreground truncate">
                          {attr.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No traits available.
                  </p>
                )}
              </div>

              {/* Description */}
              {asset.description && (
                <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground italic">
                  &quot;{asset.description}&quot;
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
