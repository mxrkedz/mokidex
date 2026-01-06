// components/collection/collection-overview.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import { RealNFT } from '@/lib/nft-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IconChartPie, IconTrophy, IconBox } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface CollectionOverviewProps {
  assets: RealNFT[];
  isLoading: boolean;
  ronPrice: number;
  onCardClick?: (asset: RealNFT) => void;
}

export function CollectionOverview({
  assets,
  isLoading,
  ronPrice,
  onCardClick,
}: CollectionOverviewProps) {
  // --- Calculations ---
  const stats = React.useMemo(() => {
    const totalValue = assets.reduce((acc, curr) => acc + curr.floorPrice, 0);
    const mokiAssets = assets.filter((a) => a.contractType === 'Moki');
    const boosterAssets = assets.filter((a) => a.contractType === 'Booster');

    const mokiValue = mokiAssets.reduce(
      (acc, curr) => acc + curr.floorPrice,
      0
    );
    const boosterValue = boosterAssets.reduce(
      (acc, curr) => acc + curr.floorPrice,
      0
    );

    const safeTotal = totalValue || 1;

    return {
      totalValue,
      mokiCount: mokiAssets.length,
      boosterCount: boosterAssets.length,
      mokiValue,
      boosterValue,
      mokiPercent: (mokiValue / safeTotal) * 100,
      boosterPercent: (boosterValue / safeTotal) * 100,
    };
  }, [assets]);

  // Top 4 Assets by Floor Price (No filters)
  const topAssets = React.useMemo(() => {
    return [...assets].sort((a, b) => b.floorPrice - a.floorPrice).slice(0, 4);
  }, [assets]);

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

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
      {/* --- LEFT: Holdings Breakdown (3 Cols) --- */}
      <Card className="col-span-full md:col-span-3 flex flex-col h-full shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <IconChartPie className="w-5 h-5 text-primary" />
            Holdings Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center space-y-8">
          {/* Stats Row */}
          <div className="flex justify-between items-end px-1">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {/* Moki Indicator: Yellow-500 */}
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                Moki
              </div>
              <div className="text-2xl font-bold tracking-tight">
                {`${stats.mokiPercent.toFixed(0)}%`}
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.mokiCount} Items
              </div>
            </div>

            <div className="space-y-1 text-right">
              <div className="flex items-center justify-end gap-2 text-sm font-medium text-muted-foreground">
                Box
                <div className="w-2 h-2 rounded-full bg-purple-500" />
              </div>
              <div className="text-2xl font-bold tracking-tight">
                {`${stats.boosterPercent.toFixed(0)}%`}
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.boosterCount} Items
              </div>
            </div>
          </div>

          {/* Single Stacked Progress Bar */}
          <div className="h-3 w-full rounded-full bg-secondary/50 overflow-hidden flex relative">
            {/* Moki Segment: Yellow-500 */}
            <div
              className="h-full bg-yellow-500 transition-all duration-500 ease-in-out"
              style={{ width: `${stats.mokiPercent}%` }}
            />
            {/* Booster Segment: Purple-500 */}
            <div
              className="h-full bg-purple-500 transition-all duration-500 ease-in-out"
              style={{ width: `${stats.boosterPercent}%` }}
            />
          </div>

          {/* Allocation Text */}
          <div className="pt-4 border-t border-border/50">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Total Allocation</span>
              <div className="text-right">
                <div className="font-medium text-foreground font-mono">
                  {`${stats.totalValue.toLocaleString()} RON`}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {formatUsd(stats.totalValue)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- RIGHT: Top Assets (4 Cols) --- */}
      <Card className="col-span-full md:col-span-4 flex flex-col h-full shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <IconTrophy className="w-5 h-5 text-yellow-500" />
            Most Valuable
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {topAssets.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {topAssets.map((asset) => {
                const { whole, decimal } = getPriceParts(asset.floorPrice || 0);

                return (
                  <div
                    key={asset.id}
                    onClick={() => onCardClick?.(asset)}
                    className={cn(
                      'group/card relative overflow-hidden rounded-xl border border-border bg-card',
                      'hover:bg-muted/50 transition-all',
                      'hover:scale-[1.02] cursor-pointer'
                    )}
                  >
                    {/* Image Container */}
                    <div className="aspect-square w-full bg-muted relative">
                      <Image
                        src={asset.cdnImage || asset.image}
                        alt={asset.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      {/* Badge: NFT ID */}
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold text-white shadow-sm backdrop-blur-sm bg-black/60">
                          #{asset.tokenId}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-3 space-y-2">
                      <h3 className="font-semibold leading-none tracking-tight truncate text-xs md:text-sm">
                        {asset.name}
                      </h3>
                      <div className="flex items-center justify-between pt-1 border-t border-border/50">
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
          ) : (
            <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl bg-card/50">
              <IconBox className="w-8 h-8 opacity-20 mb-2" />
              <p className="text-sm">No assets found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-7">
      <Card className="col-span-3">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <Skeleton className="aspect-square w-full rounded-none" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
