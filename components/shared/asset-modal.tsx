// components/dashboard/asset-modal.tsx
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
import { fetchBestOffer } from '@/app/actions/fetch-offers';

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
  ronPrice: number;
}

export function AssetModal({
  isOpen,
  onClose,
  asset,
  isDarkMode,
  ronPrice,
}: AssetModalProps) {
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [bestOffer, setBestOffer] = React.useState<{
    price: number;
    token: string;
  } | null>(null);
  const [isLoadingOffer, setIsLoadingOffer] = React.useState(false);

  // Reset and Fetch Offer when asset changes
  React.useEffect(() => {
    if (isOpen && asset) {
      setIsImageLoading(true);
      setIsLoadingOffer(true);
      setBestOffer(null);

      // Fetch Best Offer
      fetchBestOffer(asset.contractAddress, asset.tokenId)
        .then((offer) => setBestOffer(offer))
        .finally(() => setIsLoadingOffer(false));
    }
    // Fixed: Added 'asset' to dependency array to satisfy ESLint
  }, [isOpen, asset]);

  const getMarketplaceUrl = (currentAsset: RealNFT) => {
    if (currentAsset.contractType === 'Booster') {
      return `https://marketplace.roninchain.com/collections/grandarena/${currentAsset.tokenId}`;
    }
    return `https://marketplace.roninchain.com/collections/moki-genesis/${currentAsset.tokenId}`;
  };

  // Price Calculation (Value/Floor)
  const displayPrice = React.useMemo(() => {
    if (!asset) return { ron: 0, usd: 0, label: 'Value' };
    const price =
      asset.listingPrice && asset.listingPrice > 0
        ? asset.listingPrice
        : asset.floorPrice;
    return {
      ron: price,
      usd: price * ronPrice,
      label: asset.listingPrice ? 'Listing Price' : 'Estimated Value',
    };
  }, [asset, ronPrice]);

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
              {/* Header Info */}
              <div className="flex items-center justify-between pr-12">
                <Badge
                  variant="outline"
                  className={cn(
                    'uppercase tracking-widest text-[10px]',
                    asset.type === 'Booster Box'
                      ? 'text-purple-500 border-purple-500/30'
                      : 'text-yellow-500 border-yellow-500/30'
                  )}
                >
                  {asset.type}
                </Badge>
                <span className="text-sm font-mono text-muted-foreground">
                  #{asset.tokenId}
                </span>
              </div>

              <DialogTitle className="text-2xl font-bold leading-tight">
                {asset.name}
              </DialogTitle>

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

              {/* Price & Offer Grid */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                {/* 1. Estimated Value / Listing */}
                <div className="p-3 bg-card border border-border/60 rounded-lg">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                    {displayPrice.label}
                  </span>
                  <div className="text-lg font-bold font-mono leading-none">
                    {displayPrice.ron.toLocaleString()}{' '}
                    <span className="text-sm font-normal text-muted-foreground">
                      RON
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {displayPrice.usd.toLocaleString(undefined, {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </div>
                </div>

                {/* 2. Top Offer */}
                <div className="p-3 bg-card border border-border/60 rounded-lg">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                    Top Offer
                  </span>
                  {isLoadingOffer ? (
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ) : bestOffer ? (
                    <>
                      <div className="text-lg font-bold font-mono leading-none">
                        {bestOffer.price.toLocaleString()}{' '}
                        <span className="text-sm font-normal text-muted-foreground">
                          RON
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {(bestOffer.price * ronPrice).toLocaleString(
                          undefined,
                          {
                            style: 'currency',
                            currency: 'USD',
                          }
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm font-medium text-muted-foreground h-full flex items-center">
                      No Offers
                    </div>
                  )}
                </div>
              </div>

              {/* Marketplace Button */}
              <div className="pb-2">
                <Button
                  className="w-full gap-2 bg-primary hover:bg-primary/80 text-white border-none h-11"
                  onClick={() =>
                    window.open(getMarketplaceUrl(asset), '_blank')
                  }
                >
                  View on Marketplace <IconArrowsExchange size={18} />
                </Button>
              </div>

              {/* Traits */}
              <h3 className="font-semibold text-sm text-foreground mt-2">
                Traits
              </h3>
              <div className="flex-1">
                {asset.attributes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {asset.attributes.map((attr, i) => (
                      <div
                        key={i}
                        className="flex flex-col p-3 rounded-md border border-border bg-card/50"
                      >
                        <span className="text-[10px] uppercase text-muted-foreground font-semibold mb-1 truncate">
                          {/* Fixed: Removed attr.trait_type because it does not exist on RoninAttribute */}
                          {attr.key}
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
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
