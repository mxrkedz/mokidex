'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconArrowsExchange, IconInfoCircle } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { MokuAsset } from '@/lib/types';
import { RARITY_COLORS } from '@/lib/constants';
import { ThreeDCard } from '@/components/shared/three-d-card';

interface AssetModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  asset: MokuAsset | null;
}

export function AssetModal({ isOpen, onClose, asset }: AssetModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 bg-background text-foreground border-border shadow-2xl focus:outline-none w-[90vw] max-h-[85vh] overflow-y-auto rounded-xl md:overflow-hidden md:max-h-none">
        <DialogClose className="absolute right-4 top-4 z-50 opacity-70 hover:opacity-100 transition-opacity" />

        {asset && (
          <div className="flex flex-col md:flex-row bg-background">
            {/* Left: 3D Visual */}
            <div className="w-full md:w-1/2 bg-muted/30 p-8 flex items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-border">
              <div className="absolute inset-0 bg-grid-black/5 dark:bg-grid-white/5 [mask-image:linear-gradient(0deg,rgba(0,0,0,0.5),transparent)]" />
              <ThreeDCard asset={asset} />
            </div>

            {/* Right: Info */}
            <div className="w-full md:w-1/2 p-6 flex flex-col gap-6">
              <DialogHeader className="text-left relative">
                <div className="flex items-center justify-between mb-2 pr-12">
                  <Badge
                    variant="outline"
                    className={cn(
                      'uppercase tracking-widest text-[10px]',
                      asset.type === 'Scheme'
                        ? 'text-blue-500 border-blue-500/30'
                        : 'text-primary border-primary/30'
                    )}
                  >
                    {asset.type} Card
                  </Badge>
                  <span className="text-sm font-mono text-muted-foreground">
                    #{asset.id.split('-')[1].padStart(4, '0')}
                  </span>
                </div>
                <DialogTitle className="text-2xl font-bold">
                  {asset.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: RARITY_COLORS[asset.rarity],
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {asset.rarity}
                  </span>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border text-sm italic text-muted-foreground">
                  &quot;{asset.description}&quot;
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {asset.stats.map((stat, i) => (
                    <div
                      key={i}
                      className="flex flex-col p-3 rounded-md border border-border bg-card/50"
                    >
                      <span className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">
                        {stat.label}
                      </span>
                      <span className="font-medium text-foreground">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-6 flex gap-3">
                <Button className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none">
                  View on Marketplace <IconArrowsExchange size={16} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  title="Asset Info"
                  className="bg-muted text-foreground hover:bg-muted/80"
                >
                  <IconInfoCircle size={18} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
