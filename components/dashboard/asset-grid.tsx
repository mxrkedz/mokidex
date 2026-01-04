'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TOP_ASSETS, RARITY_COLORS } from '@/lib/constants';
import { MokuAsset } from '@/lib/types';

interface AssetGridProps {
  isPrivacyMode: boolean;
  onAssetClick: (asset: MokuAsset) => void;
}

export function AssetGrid({ isPrivacyMode, onAssetClick }: AssetGridProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Top Assets</CardTitle>
          <CardDescription>
            Most valuable items in your collection
          </CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {TOP_ASSETS.map((asset, i) => (
            <div
              key={asset.id}
              onClick={() => onAssetClick(asset)}
              className={cn(
                'group/card relative overflow-hidden rounded-xl border border-border bg-card hover:bg-muted/50 transition-all hover:scale-[1.02] cursor-pointer',
                // Hide the 6th item (index 5) ONLY on large screens where grid is 5 cols
                i === 5 ? 'xl:hidden' : ''
              )}
            >
              <div className="aspect-square w-full bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 font-bold text-4xl uppercase tracking-widest select-none">
                  {asset.rarity[0]}
                </div>
                <div
                  className="absolute top-2 right-2 w-3 h-3 rounded-full shadow-lg ring-2 ring-background"
                  style={{
                    backgroundColor: RARITY_COLORS[asset.rarity],
                  }}
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold leading-none tracking-tight truncate text-sm">
                  {asset.name}
                </h3>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px] h-5">
                    {asset.rarity}
                  </Badge>
                  <span className="text-xs font-mono font-medium">
                    {isPrivacyMode ? '••••' : `₳ ${asset.floorPriceRon}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
