// components/collection/collection-overview.tsx
'use client';

import * as React from 'react';
import { RealNFT } from '@/lib/nft-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { IconBox, IconChartPie, IconTrophy } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface CollectionOverviewProps {
  assets: RealNFT[];
  isLoading: boolean;
  isPrivacyMode: boolean;
}

export function CollectionOverview({
  assets,
  isLoading,
  isPrivacyMode,
}: CollectionOverviewProps) {
  const [topFilter, setTopFilter] = React.useState('All');

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

    return {
      totalValue: totalValue || 1, // Prevent div by zero
      mokiCount: mokiAssets.length,
      boosterCount: boosterAssets.length,
      mokiValue,
      boosterValue,
      mokiPercent: (mokiValue / (totalValue || 1)) * 100,
      boosterPercent: (boosterValue / (totalValue || 1)) * 100,
    };
  }, [assets]);

  const topAssets = React.useMemo(() => {
    let filtered = [...assets];
    if (topFilter === 'Moki') {
      filtered = filtered.filter((a) => a.contractType === 'Moki');
    } else if (topFilter === 'Booster') {
      filtered = filtered.filter((a) => a.contractType === 'Booster');
    }
    // Sort by Floor Price Descending
    return filtered.sort((a, b) => b.floorPrice - a.floorPrice).slice(0, 4);
  }, [assets, topFilter]);

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
      {/* --- LEFT: Holdings Breakdown (3 Cols) --- */}
      <Card className="col-span-full md:col-span-3 flex flex-col">
        <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <IconChartPie className="w-5 h-5 text-primary" />
            Holdings Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-6 pt-4">
          {/* Moki Stat */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="font-medium text-muted-foreground">
                  Moki NFTs
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  {isPrivacyMode
                    ? '****'
                    : `${stats.mokiValue.toLocaleString()} RON`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stats.mokiCount} Items
                </div>
              </div>
            </div>
            <Progress value={stats.mokiPercent} className="h-2 bg-secondary" />
          </div>

          {/* Booster Stat */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="font-medium text-muted-foreground">
                  Booster Boxes
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  {isPrivacyMode
                    ? '****'
                    : `${stats.boosterValue.toLocaleString()} RON`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stats.boosterCount} Items
                </div>
              </div>
            </div>
            <Progress
              value={stats.boosterPercent}
              className="h-2 bg-secondary [&>div]:bg-purple-500"
            />
          </div>

          {/* Total Summary */}
          <div className="pt-4 border-t mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Allocation</span>
              <span className="text-sm font-mono text-muted-foreground">
                {stats.mokiPercent.toFixed(1)}% Moki /{' '}
                {stats.boosterPercent.toFixed(1)}% Box
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- RIGHT: Top Assets (4 Cols) --- */}
      <Card className="col-span-full md:col-span-4 flex flex-col">
        <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <IconTrophy className="w-5 h-5 text-yellow-500" />
            Top Assets
          </CardTitle>
          <Tabs
            value={topFilter}
            onValueChange={setTopFilter}
            className="w-auto"
          >
            <TabsList className="h-8 p-0 bg-secondary/50">
              <TabsTrigger
                value="All"
                className="h-full px-3 text-xs data-[state=active]:bg-background rounded-sm"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="Moki"
                className="h-full px-3 text-xs data-[state=active]:bg-background rounded-sm"
              >
                Moki
              </TabsTrigger>
              <TabsTrigger
                value="Booster"
                className="h-full px-3 text-xs data-[state=active]:bg-background rounded-sm"
              >
                Box
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-4 flex-1">
          {topAssets.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 overflow-hidden"
                >
                  {/* Image Area */}
                  <div className="aspect-square relative bg-secondary/20 overflow-hidden">
                    <img
                      src={asset.cdnImage || asset.image}
                      alt={asset.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Rarity Badge */}
                    <div className="absolute top-1 right-1">
                      <span
                        className="px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md"
                        style={{ backgroundColor: asset.color }}
                      >
                        {asset.rarityLabel}
                      </span>
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="p-2 space-y-1">
                    <h3
                      className="font-semibold text-xs truncate"
                      title={asset.name}
                    >
                      {asset.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        Floor
                      </span>
                      <span
                        className={cn(
                          'text-[11px] font-bold font-mono',
                          isPrivacyMode ? 'blur-sm' : ''
                        )}
                        style={{
                          color:
                            asset.floorPrice > 1000 ? '#4ade80' : undefined,
                        }}
                      >
                        {isPrivacyMode
                          ? '999'
                          : asset.floorPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
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
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
