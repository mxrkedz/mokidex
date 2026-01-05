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
import { ImportWalletModal } from '@/components/collection/import-wallet-modal';

// UI Components
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { IconWallet, IconDownload } from '@tabler/icons-react';

const MOKI_CONTRACT = '0x47b5a7c2e4f07772696bbf8c8c32fe2b9eabd550';
const BOOSTER_CONTRACT = '0x3a3ea46230688a20ee45ec851dc81f76371f1235';

export default function CollectionPage() {
  const [isPrivacyMode, setIsPrivacyMode] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  // Data State
  const [assets, setAssets] = React.useState<RealNFT[]>([]);
  const [ronPrice, setRonPrice] = React.useState({ usdPrice: 0, change24h: 0 });

  // Wallet & Auth State
  const [walletAddress, setWalletAddress] = React.useState('');
  const [portfolioName, setPortfolioName] = React.useState('');
  const [isAuthChecking, setIsAuthChecking] = React.useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);

  // Chart Data State
  const [historyData, setHistoryData] = React.useState<
    { shortDate: string; fullDate: string; value: number }[]
  >([]);

  const [portfolioChange24h, setPortfolioChange24h] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = React.useState(false);

  // Filters & UI State
  const [timeRange, setTimeRange] = React.useState<TimeRange>('7d');
  const [activeTab, setActiveTab] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortOption, setSortOption] =
    React.useState<SortOption>('Highest Value');

  // Modals
  const [selectedAsset, setSelectedAsset] = React.useState<RealNFT | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  // 1. Check Local Storage on Mount
  React.useEffect(() => {
    const savedAddress = localStorage.getItem('userWalletAddress');
    const savedName = localStorage.getItem('userPortfolioName');

    if (savedAddress) setWalletAddress(savedAddress);
    if (savedName) setPortfolioName(savedName);

    setIsAuthChecking(false);
  }, []);

  const handleUpdateName = (name: string) => {
    setPortfolioName(name);
    localStorage.setItem('userPortfolioName', name);
  };

  // 2. Initial Load Data
  const loadInitialData = React.useCallback(async () => {
    if (!walletAddress) return;

    setIsLoading(true);
    try {
      const [fetchedAssets, fetchedPrice] = await Promise.all([
        fetchWalletNFTs(walletAddress),
        fetchRonPrice(),
      ]);
      setAssets(fetchedAssets);
      setRonPrice(fetchedPrice);
    } catch (e) {
      console.error('Failed to load initial data:', e);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  React.useEffect(() => {
    if (walletAddress) {
      loadInitialData();
    }
  }, [loadInitialData, walletAddress]);

  const handleImportWallet = (newAddress: string) => {
    localStorage.setItem('userWalletAddress', newAddress);
    setWalletAddress(newAddress);
    setPortfolioName('');
    localStorage.removeItem('userPortfolioName');
  };

  // 3. History Load
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
        case 'Highest Value':
          return b.floorPrice - a.floorPrice;
        case 'Lowest Value':
          return a.floorPrice - b.floorPrice;
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
      {/* Updated: Removed Props */}
      <MobileNav />
      <Sidebar />

      <div className="flex-1 h-full overflow-hidden flex flex-col relative">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-4 h-full">
            {isAuthChecking ? (
              <div className="flex h-[50vh] items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : !walletAddress ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="bg-primary/10 p-6 rounded-full">
                  <IconWallet className="w-16 h-16 text-primary" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h2 className="text-2xl font-bold">Track Your Portfolio</h2>
                  <p className="text-muted-foreground">
                    Import your Ronin wallet address to view your Moki
                    collection.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <IconDownload className="w-5 h-5" />
                  Import Wallet
                </Button>
              </div>
            ) : (
              <>
                <CollectionHeader
                  totalRonValue={totalPortfolioValue}
                  ronPriceUsd={ronPrice.usdPrice}
                  portfolioChange24h={portfolioChange24h}
                  isPrivacyMode={isPrivacyMode}
                  setIsPrivacyMode={setIsPrivacyMode}
                  onRefresh={loadInitialData}
                  isRefreshing={isLoading}
                  timeRange={timeRange}
                  onImportWallet={() => setIsImportModalOpen(true)}
                  walletAddress={walletAddress}
                  portfolioName={portfolioName}
                  onUpdateName={handleUpdateName}
                />

                <CollectionOverview
                  isPrivacyMode={isPrivacyMode}
                  assets={assets}
                  historyData={historyData}
                  timeRange={timeRange}
                  setTimeRange={setTimeRange}
                  isLoading={isHistoryLoading}
                />

                <Card className="w-full">
                  <CardHeader className="pb-4">
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <TabsList>
                          <TabsTrigger value="All">All Items</TabsTrigger>
                          <TabsTrigger value="Moki">Moki</TabsTrigger>
                          <TabsTrigger value="Booster">Booster</TabsTrigger>
                        </TabsList>

                        <CollectionToolbar
                          searchQuery={searchQuery}
                          setSearchQuery={setSearchQuery}
                          sortOption={sortOption}
                          setSortOption={setSortOption}
                        />
                      </div>
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
              </>
            )}

            <Footer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </div>
        </main>
      </div>

      <AssetModal
        isOpen={isDetailOpen}
        onClose={setIsDetailOpen}
        asset={selectedAsset}
        isDarkMode={isDarkMode}
      />

      <ImportWalletModal
        isOpen={isImportModalOpen}
        onClose={setIsImportModalOpen}
        onImport={handleImportWallet}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
