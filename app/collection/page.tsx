'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { fetchWalletNFTs } from '@/app/actions/fetch-nfts';
import { fetchRonPrice } from '@/app/actions/fetch-ron-price';
import { fetchCollectionTrades } from '@/app/actions/fetch-trades';
import { RealNFT } from '@/lib/nft-types';

// Layout & Components
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Footer } from '@/components/layout/footer';
import { CollectionHeader } from '@/components/collection/collection-header';
import { CollectionOverview } from '@/components/collection/collection-overview';
import {
  CollectionToolbar,
  SortOption,
} from '@/components/collection/collection-toolbar';
import { CollectionGrid } from '@/components/collection/collection-grid';
import { AddCardModal } from '@/components/collection/add-card-modal';
import { AssetModal } from '@/components/dashboard/asset-modal';

// Constants for contracts
const MOKI_CONTRACT = '0x47b5a7c2e4f07772696bbf8c8c32fe2b9eabd550';
const BOOSTER_CONTRACT = '0x3a3ea46230688a20ee45ec851dc81f76371f1235';

export default function CollectionPage() {
  const [isPrivacyMode, setIsPrivacyMode] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  // Data State
  const [assets, setAssets] = React.useState<RealNFT[]>([]);
  const [ronPrice, setRonPrice] = React.useState({ usdPrice: 0, change24h: 0 });
  const [historyData, setHistoryData] = React.useState<
    { date: string; value: number }[]
  >([]);
  const [portfolioChange24h, setPortfolioChange24h] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  // Filtering & Sorting
  const [activeTab, setActiveTab] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortOption, setSortOption] = React.useState<SortOption>('most-value');

  // Modal State
  const [selectedAsset, setSelectedAsset] = React.useState<RealNFT | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // --- DATA LOADING & PROCESSING ---
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Assets and Ron Price
      const [fetchedAssets, fetchedPrice] = await Promise.all([
        fetchWalletNFTs(),
        fetchRonPrice(),
      ]);
      setAssets(fetchedAssets);
      setRonPrice(fetchedPrice);

      // 2. Fetch Trades for Collections
      const [mokiTrades, boosterTrades] = await Promise.all([
        fetchCollectionTrades(MOKI_CONTRACT),
        fetchCollectionTrades(BOOSTER_CONTRACT),
      ]);

      // 3. Calculate Counts (Assuming holding count is constant over the trade history duration)
      const mokiCount = fetchedAssets.filter(
        (a) => a.contractType === 'Moki'
      ).length;
      const boosterCount = fetchedAssets.filter(
        (a) => a.contractType === 'Booster'
      ).length;

      // 4. Construct Unified Timeline (Chart Data)
      // Merge all timestamps
      const allTimestamps = [
        ...mokiTrades.map((t) => t.timestamp),
        ...boosterTrades.map((t) => t.timestamp),
      ].sort((a, b) => a - b);

      if (allTimestamps.length > 0) {
        // Track latest known price for each asset as we walk through time
        let lastMokiPrice = mokiTrades[0]?.price || 0;
        let lastBoosterPrice = boosterTrades[0]?.price || 0;

        const timeSeries = allTimestamps.map((timestamp) => {
          // Update prices if there's a trade at this specific timestamp
          const mTrade = mokiTrades.find((t) => t.timestamp === timestamp);
          const bTrade = boosterTrades.find((t) => t.timestamp === timestamp);

          if (mTrade) lastMokiPrice = mTrade.price;
          if (bTrade) lastBoosterPrice = bTrade.price;

          const totalVal =
            lastMokiPrice * mokiCount + lastBoosterPrice * boosterCount;

          return {
            timestamp,
            value: totalVal,
            date: new Date(timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            }),
          };
        });

        // Downsample for chart readability if too many points
        // (Optional: simple version just takes all points or filtered by unique day)
        setHistoryData(timeSeries);

        // 5. Calculate 24h Portfolio Change
        // Find current value (last point)
        const currentVal = timeSeries[timeSeries.length - 1].value;

        // Find value ~24h ago
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        // Find the trade point closest to 24h ago
        const pastPoint = timeSeries.reduce((prev, curr) =>
          Math.abs(curr.timestamp - oneDayAgo) <
          Math.abs(prev.timestamp - oneDayAgo)
            ? curr
            : prev
        );

        if (pastPoint && pastPoint.value > 0) {
          const change =
            ((currentVal - pastPoint.value) / pastPoint.value) * 100;
          setPortfolioChange24h(change);
        } else {
          setPortfolioChange24h(0);
        }
      } else {
        // Fallback if no trades found
        setHistoryData([]);
        setPortfolioChange24h(0);
      }
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  // --- CURRENT PORTFOLIO VALUE (Based on Floor/Latest from Wallet Fetch) ---
  const totalPortfolioValue = React.useMemo(() => {
    return assets.reduce((acc, curr) => acc + curr.floorPrice, 0);
  }, [assets]);

  // --- FILTERED GRID DATA ---
  const filteredAssets = React.useMemo(() => {
    let result = [...assets];

    if (activeTab !== 'All') {
      result = result.filter((asset) => asset.contractType === activeTab);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (asset) =>
          asset.name.toLowerCase().includes(q) || asset.tokenId.includes(q)
      );
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case 'most-value':
          return b.floorPrice - a.floorPrice;
        case 'least-value':
          return a.floorPrice - b.floorPrice;
        case 'most-rare':
          return (a.rarityRank || 999999) - (b.rarityRank || 999999);
        case 'least-rare':
          return (b.rarityRank || 999999) - (a.rarityRank || 999999);
        default:
          return 0;
      }
    });

    return result;
  }, [assets, activeTab, searchQuery, sortOption]);

  return (
    <div
      className={cn(
        'flex h-screen w-full bg-background text-foreground overflow-hidden flex-col md:flex-row transition-colors duration-300',
        isDarkMode ? 'dark' : ''
      )}
    >
      <MobileNav isConnected={true} handleConnect={() => {}} />
      <Sidebar isConnected={true} />

      <div className="flex-1 h-full overflow-hidden flex flex-col relative">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-4">
            {/* Header: Uses Real 24h Change Logic */}
            <CollectionHeader
              totalRonValue={totalPortfolioValue}
              ronPriceUsd={ronPrice.usdPrice}
              portfolioChange24h={portfolioChange24h}
              isPrivacyMode={isPrivacyMode}
              setIsPrivacyMode={setIsPrivacyMode}
              onRefresh={loadData}
              isRefreshing={isLoading}
            />

            {/* Overview: Uses Real Chart History */}
            <CollectionOverview
              isPrivacyMode={isPrivacyMode}
              assets={assets}
              historyData={historyData}
            />

            <div className="space-y-6">
              <CollectionToolbar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortOption={sortOption}
                setSortOption={setSortOption}
                onAddCard={() => setIsAddOpen(true)}
              />

              {isLoading ? (
                <div className="w-full h-64 flex flex-col items-center justify-center text-muted-foreground">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p>Updating portfolio data...</p>
                </div>
              ) : (
                <CollectionGrid
                  assets={filteredAssets}
                  onCardClick={(asset) => {
                    setSelectedAsset(asset);
                    setIsDetailOpen(true);
                  }}
                />
              )}
            </div>

            <Footer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </div>
        </main>
      </div>

      <AssetModal
        isOpen={isDetailOpen}
        onClose={setIsDetailOpen}
        asset={selectedAsset}
      />

      <AddCardModal isOpen={isAddOpen} onClose={setIsAddOpen} />
    </div>
  );
}
