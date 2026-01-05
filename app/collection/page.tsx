'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { fetchWalletNFTs } from '@/app/actions/fetch-nfts';
import { fetchRonPrice } from '@/app/actions/fetch-ron-price';
import { fetchHistoricalPrices } from '@/app/actions/fetch-history';
import { RealNFT } from '@/lib/nft-types';
import { TimeRange } from '@/lib/types';

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
import { AssetModal } from '@/components/dashboard/asset-modal';

// UI Components
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';

const MOKI_CONTRACT = '0x47b5a7c2e4f07772696bbf8c8c32fe2b9eabd550';
const BOOSTER_CONTRACT = '0x3a3ea46230688a20ee45ec851dc81f76371f1235';

export default function CollectionPage() {
  const [isPrivacyMode, setIsPrivacyMode] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  // Data State
  const [assets, setAssets] = React.useState<RealNFT[]>([]);
  const [ronPrice, setRonPrice] = React.useState({ usdPrice: 0, change24h: 0 });

  // Chart Data State: Now includes shortDate (X-Axis) and fullDate (Tooltip)
  const [historyData, setHistoryData] = React.useState<
    { shortDate: string; fullDate: string; value: number }[]
  >([]);

  const [portfolioChange24h, setPortfolioChange24h] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = React.useState(false);

  // Filters & UI State
  const [timeRange, setTimeRange] = React.useState<TimeRange>('7d');
  const [activeTab, setActiveTab] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortOption, setSortOption] = React.useState<SortOption>('most-value');

  // Modals
  const [selectedAsset, setSelectedAsset] = React.useState<RealNFT | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  // 1. Initial Load
  const loadInitialData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedAssets, fetchedPrice] = await Promise.all([
        fetchWalletNFTs(),
        fetchRonPrice(),
      ]);
      setAssets(fetchedAssets);
      setRonPrice(fetchedPrice);
    } catch (e) {
      console.error('Failed to load initial data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 2. History Load
  React.useEffect(() => {
    if (assets.length === 0) return;

    const loadHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const mokiCount = assets.filter(
          (a) => a.contractType === 'Moki'
        ).length;
        const boosterCount = assets.filter(
          (a) => a.contractType === 'Booster'
        ).length;

        const [mokiHistory, boosterHistory] = await Promise.all([
          fetchHistoricalPrices(MOKI_CONTRACT, timeRange),
          fetchHistoricalPrices(BOOSTER_CONTRACT, timeRange),
        ]);

        const timestampSet = new Set<string>();
        mokiHistory.forEach((h) => timestampSet.add(h.date));
        boosterHistory.forEach((h) => timestampSet.add(h.date));

        const sortedTimestamps = Array.from(timestampSet).sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );

        const combinedData = sortedTimestamps.map((timestamp) => {
          const mPoint = mokiHistory.find((h) => h.date === timestamp);
          const bPoint = boosterHistory.find((h) => h.date === timestamp);

          const mPrice = mPoint ? mPoint.price : 0;
          const bPrice = bPoint ? bPoint.price : 0;
          const totalValue = mPrice * mokiCount + bPrice * boosterCount;
          const dateObj = new Date(timestamp);

          // -- DATE FORMATTING LOGIC --
          let shortDate = '';
          if (timeRange === '24h') {
            shortDate = dateObj.toLocaleTimeString(undefined, {
              hour: 'numeric',
              minute: '2-digit',
            });
          } else {
            shortDate = dateObj.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            });
          }

          const fullDate = dateObj.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          });

          return {
            shortDate,
            fullDate,
            value: totalValue,
          };
        });

        const validData = combinedData.filter((d) => d.value > 0);
        setHistoryData(validData);

        if (validData.length > 1) {
          const start = validData[0].value;
          const end = validData[validData.length - 1].value;
          if (start > 0) {
            setPortfolioChange24h(((end - start) / start) * 100);
          }
        }
      } catch (e) {
        console.error('Failed to load history:', e);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    loadHistory();
  }, [assets, timeRange]);

  const totalPortfolioValue = React.useMemo(() => {
    return assets.reduce((acc, curr) => acc + curr.floorPrice, 0);
  }, [assets]);

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
            <CollectionHeader
              totalRonValue={totalPortfolioValue}
              ronPriceUsd={ronPrice.usdPrice}
              portfolioChange24h={portfolioChange24h}
              isPrivacyMode={isPrivacyMode}
              setIsPrivacyMode={setIsPrivacyMode}
              onRefresh={loadInitialData}
              isRefreshing={isLoading}
              timeRange={timeRange}
            />

            <CollectionOverview
              isPrivacyMode={isPrivacyMode}
              assets={assets}
              historyData={historyData}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              isLoading={isHistoryLoading}
            />

            {/* Filter Toolbar & Grid wrapped in Card */}
            <Card className="w-full">
              <CardHeader className="pb-4">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <CollectionToolbar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    onRefresh={loadInitialData}
                  />
                </Tabs>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="w-full h-64 flex flex-col items-center justify-center text-muted-foreground">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p>Loading assets...</p>
                  </div>
                ) : (
                  <CollectionGrid
                    assets={filteredAssets}
                    itemsPerPage={15}
                    onCardClick={(asset) => {
                      setSelectedAsset(asset);
                      setIsDetailOpen(true);
                    }}
                  />
                )}
              </CardContent>
            </Card>

            <Footer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </div>
        </main>
      </div>

      <AssetModal
        isOpen={isDetailOpen}
        onClose={setIsDetailOpen}
        asset={selectedAsset}
      />
    </div>
  );
}
