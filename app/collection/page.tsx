'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { MokuAsset, Rarity } from '@/lib/types';
import { ALL_MOCK_ASSETS } from '@/lib/constants';

// Layout
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Footer } from '@/components/layout/footer';

// Components
import { CollectionHeader } from '@/components/collection/collection-header';
import { CollectionOverview } from '@/components/collection/collection-overview';
import {
  CollectionToolbar,
  AssetCategory,
} from '@/components/collection/collection-toolbar';
import { CollectionGrid } from '@/components/collection/collection-grid';
import { AddCardModal } from '@/components/collection/add-card-modal';
import { AssetModal } from '@/components/dashboard/asset-modal';

// UI
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function CollectionPage() {
  const [activeTab, setActiveTab] = React.useState('Collection');
  const [isConnected, setIsConnected] = React.useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  // Filter State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [rarityFilter, setRarityFilter] = React.useState<Rarity | 'All'>('All');
  const [assetCategory, setAssetCategory] =
    React.useState<AssetCategory>('All');

  // Modal State
  const [selectedAsset, setSelectedAsset] = React.useState<MokuAsset | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  const handleConnect = () => setIsConnected(true);

  // Filter Logic
  const filteredAssets = React.useMemo(() => {
    return ALL_MOCK_ASSETS.filter((asset) => {
      // 1. Text Search
      const matchesSearch = asset.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // 2. Rarity Filter
      const matchesRarity =
        rarityFilter === 'All' || asset.rarity === rarityFilter;

      // 3. Asset Category Filter
      let matchesCategory = true;
      if (assetCategory === 'Cards') {
        // "Cards" usually implies playable cards like Moki, Schemes, Promo
        matchesCategory = ['Moki', 'Scheme', 'Promo'].includes(asset.type);
      } else if (assetCategory === 'Booster Box') {
        matchesCategory = asset.type === 'Booster Box';
      } else if (assetCategory === 'Packs') {
        matchesCategory = asset.type === 'Pack';
      } else if (assetCategory === 'Moku NFT') {
        matchesCategory = asset.type === 'Moku NFT';
      }

      return matchesSearch && matchesRarity && matchesCategory;
    });
  }, [searchQuery, rarityFilter, assetCategory]);

  // Calculate Total Value
  const totalValue = React.useMemo(() => {
    return filteredAssets.reduce((acc, curr) => acc + curr.floorPriceRon, 0);
  }, [filteredAssets]);

  return (
    <div
      className={cn(
        'flex h-screen w-full bg-background text-foreground overflow-hidden flex-col md:flex-row transition-colors duration-300',
        isDarkMode ? 'dark' : ''
      )}
    >
      <MobileNav isConnected={isConnected} handleConnect={handleConnect} />
      <Sidebar isConnected={isConnected} />

      <div className="flex-1 h-full overflow-hidden flex flex-col relative">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-4">
            {/* 1. Header Section */}
            <CollectionHeader
              totalValue={totalValue}
              isPrivacyMode={isPrivacyMode}
              setIsPrivacyMode={setIsPrivacyMode}
            />

            {/* 2. Overview Section (Stats & Graphs) */}
            <CollectionOverview isPrivacyMode={isPrivacyMode} />

            {/* 3. Main Content Area (Wrapped in Card as requested) */}
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border pb-6">
                <div className="flex flex-col gap-1">
                  <CardTitle>Inventory</CardTitle>
                  <CardDescription>
                    Manage and view your entire collection
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-8">
                {/* Filters */}
                <CollectionToolbar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  rarityFilter={rarityFilter}
                  setRarityFilter={setRarityFilter}
                  assetCategory={assetCategory}
                  setAssetCategory={setAssetCategory}
                  onAddCard={() => setIsAddOpen(true)}
                />

                {/* Grid */}
                <CollectionGrid
                  assets={filteredAssets}
                  onCardClick={(asset) => {
                    setSelectedAsset(asset);
                    setIsDetailOpen(true);
                  }}
                />
              </CardContent>
            </Card>

            <Footer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </div>
        </main>
      </div>

      {/* Modals */}
      <AssetModal
        isOpen={isDetailOpen}
        onClose={setIsDetailOpen}
        asset={selectedAsset}
      />

      <AddCardModal isOpen={isAddOpen} onClose={setIsAddOpen} />
    </div>
  );
}
