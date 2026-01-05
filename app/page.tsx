'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { MokuAsset } from '@/lib/types';
import { RealNFT } from '@/lib/nft-types'; // Import RealNFT type

// --- Layout Components ---
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Footer } from '@/components/layout/footer';

// --- Dashboard Components ---
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { MetricCard } from '@/components/dashboard/metric-card';
import { AssetGrid } from '@/components/dashboard/asset-grid';
import { AssetModal } from '@/components/dashboard/asset-modal';
import { PortfolioCharts } from '@/components/dashboard/portfolio-charts';
import { CollectionStats } from '@/components/dashboard/collection-stats';
import { RecentActivity } from '@/components/dashboard/recent-activity';

// --- Icons for Inline Metrics ---
import {
  IconPercentage,
  IconChartPie,
  IconDeviceGamepad2,
  IconCards,
  IconBox,
  IconTrophy,
} from '@tabler/icons-react';

// Helper to convert mock MokuAsset to RealNFT structure for the shared Modal
const convertToRealNFT = (asset: MokuAsset): RealNFT => {
  return {
    id: asset.id,
    tokenId: asset.id.split('-')[1] || '0', // Extract ID number
    name: asset.name,
    description: asset.description,
    image: '', // Mock assets don't have real images in this demo
    contractType: asset.type === 'Booster Box' ? 'Booster' : 'Moki',
    type: asset.type === 'Booster Box' ? 'Booster Box' : 'Moki NFT',
    rarity: asset.rarity,
    rarityLabel: asset.rarity,
    rarityRank: 0,
    floorPrice: asset.floorPriceRon,
    change24h: 0,
    lastSale: 0,
    attributes: asset.stats.map((s) => ({
      trait_type: s.label,
      value: s.value,
    })),
    contractAddress: '0xMock...',
    color: asset.color,
  };
};

export default function DashboardPage() {
  // Global State
  const [isConnected, setIsConnected] = React.useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  // Modal State
  const [selectedAsset, setSelectedAsset] = React.useState<MokuAsset | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Handlers
  const handleConnect = () => setIsConnected(true);

  const openAssetModal = (asset: MokuAsset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  return (
    <div
      className={cn(
        'flex h-screen w-full bg-background text-foreground overflow-hidden flex-col md:flex-row transition-colors duration-300',
        isDarkMode ? 'dark' : ''
      )}
    >
      {/* 1. Mobile Navigation (Header) - Removed unused props */}
      <MobileNav />

      {/* 2. Desktop Sidebar - Removed unused props */}
      <Sidebar />

      {/* 3. Main Content Area */}
      <div className="flex-1 h-full overflow-hidden flex flex-col relative">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-4">
            {/* Header Section */}
            <DashboardHeader
              isPrivacyMode={isPrivacyMode}
              setIsPrivacyMode={setIsPrivacyMode}
              isConnected={isConnected}
              handleConnect={handleConnect}
            />

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <MetricCard
                title="24h Change"
                value="+5.2%"
                icon={IconPercentage}
                trend="up"
                trendValue="+5.2%"
              />
              <MetricCard
                title="Profit / Loss"
                value="+$1,240"
                icon={IconChartPie}
                trend="up"
                trendValue="+8.4%"
                hidden={isPrivacyMode}
              />
              <MetricCard
                title="Win Rate"
                value="58.4%"
                subtext="Last 50 Matches"
                icon={IconDeviceGamepad2}
                trend="up"
                trendValue="+2.1%"
              />
              <MetricCard
                title="Cards"
                value="142"
                subtext="+12 New"
                icon={IconCards}
              />
              <MetricCard
                title="Packs"
                value="5"
                subtext="2 Legendary"
                icon={IconBox}
              />
              <MetricCard
                title="Rank"
                value="#402"
                subtext="Diamond"
                icon={IconTrophy}
              />
            </div>

            {/* Middle Section: Stats & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="space-y-8 lg:col-span-1">
                <CollectionStats />
                <RecentActivity isPrivacyMode={isPrivacyMode} />
              </div>

              {/* Right Column (Charts) */}
              <PortfolioCharts isPrivacyMode={isPrivacyMode} />
            </div>

            {/* Bottom Section: Asset Grid */}
            <AssetGrid
              isPrivacyMode={isPrivacyMode}
              onAssetClick={openAssetModal}
            />

            {/* Footer */}
            <Footer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </div>
        </main>
      </div>

      {/* Asset Detail Modal */}
      <AssetModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        // Convert mock asset to RealNFT structure
        asset={selectedAsset ? convertToRealNFT(selectedAsset) : null}
        // Pass isDarkMode prop
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
