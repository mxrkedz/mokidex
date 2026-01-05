'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { MokuAsset, Rarity } from '@/lib/types';
import { ALL_MOCK_ASSETS } from '@/lib/constants';

// Layout
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Footer } from '@/components/layout/footer';

// Collection Components
import { CollectionHeader } from '@/components/collection/collection-header';
import { CollectionOverview } from '@/components/collection/collection-overview';
import { CollectionToolbar } from '@/components/collection/collection-toolbar';
import { CollectionGrid } from '@/components/collection/collection-grid';
import { AddCardModal } from '@/components/collection/add-card-modal';
import { AssetModal } from '@/components/dashboard/asset-modal';

export default function CollectionPage() {
  const [isConnected, setIsConnected] = React.useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  // Filter State (Removed showUnowned)
  const [searchQuery, setSearchQuery] = React.useState('');
  const [rarityFilter, setRarityFilter] = React.useState<Rarity | 'All'>('All');

  // Modal State
  const [selectedAsset, setSelectedAsset] = React.useState<MokuAsset | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  const handleConnect = () => setIsConnected(true);

  // Filter Logic (Simplified)
  const filteredAssets = React.useMemo(() => {
    return ALL_MOCK_ASSETS.filter((asset) => {
      const matchesSearch = asset.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRarity =
        rarityFilter === 'All' || asset.rarity === rarityFilter;
      return matchesSearch && matchesRarity;
    });
  }, [searchQuery, rarityFilter]);

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

            {/* 2. Middle Section: Stats & Chart */}
            <CollectionOverview isPrivacyMode={isPrivacyMode} />

            {/* 3. Bottom Section: Toolbar & Grid */}
            <div className="space-y-6">
              <CollectionToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                rarityFilter={rarityFilter}
                setRarityFilter={setRarityFilter}
                onAddCard={() => setIsAddOpen(true)}
              />

              <CollectionGrid
                assets={filteredAssets}
                onCardClick={(asset) => {
                  setSelectedAsset(asset);
                  setIsDetailOpen(true);
                }}
              />
            </div>

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
