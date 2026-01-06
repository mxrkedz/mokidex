// components/collection/top-assets.tsx
'use client';

import * as React from 'react';
import { RealNFT } from '@/lib/nft-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface TopAssetsProps {
  assets: RealNFT[];
  isLoading: boolean;
}

export function TopAssets({ assets, isLoading }: TopAssetsProps) {
  const [filter, setFilter] = React.useState('All');

  const topAssets = React.useMemo(() => {
    let filtered = [...assets];

    if (filter === 'Moki') {
      filtered = filtered.filter((a) => a.contractType === 'Moki');
    } else if (filter === 'Booster') {
      filtered = filtered.filter((a) => a.contractType === 'Booster');
    }

    // Sort by Value (Floor Price) Descending
    return filtered.sort((a, b) => b.floorPrice - a.floorPrice).slice(0, 4); // Top 4 items
  }, [assets, filter]);

  if (isLoading) {
    return (
      <Card className="w-full h-[340px]">
        <CardHeader>
          <CardTitle>Top Assets</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full pb-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Top Assets</CardTitle>
        <Tabs value={filter} onValueChange={setFilter} className="w-auto">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="All" className="text-xs px-2">
              All
            </TabsTrigger>
            <TabsTrigger value="Moki" className="text-xs px-2">
              Moki
            </TabsTrigger>
            <TabsTrigger value="Booster" className="text-xs px-2">
              Box
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {topAssets.length > 0 ? (
            topAssets.map((asset) => (
              <div
                key={asset.id}
                className="group relative flex flex-col space-y-3 p-3 border rounded-xl bg-card hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 cursor-default"
              >
                {/* Image Container */}
                <div className="aspect-square relative overflow-hidden rounded-lg bg-secondary/20">
                  <img
                    src={asset.cdnImage || asset.image}
                    alt={asset.name}
                    loading="lazy"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Rarity Tag Overlay */}
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm shadow-sm">
                    {asset.rarityLabel}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h3
                    className="font-semibold text-sm truncate"
                    title={asset.name}
                  >
                    {asset.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Est. Value
                    </span>
                    <span
                      className="font-mono text-sm font-bold"
                      style={{
                        color: asset.floorPrice > 1000 ? '#4ade80' : undefined,
                      }}
                    >
                      {asset.floorPrice.toLocaleString()} RON
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full h-40 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border-dashed border-2">
              <p>No assets found in this category</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
