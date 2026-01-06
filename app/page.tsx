/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { fetchDashboardData } from '@/app/actions/fetch-dashboard';

// Components
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  IconBox,
  IconUsers,
  IconChartBar,
  IconTag,
  IconCurrencyDollar,
  IconTrendingUp,
  IconActivity,
  IconShoppingBag,
  IconArrowRight,
  IconTags,
  IconMail,
  IconTransfer,
} from '@tabler/icons-react';
import Image from 'next/image';

export default function DashboardPage() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div
      className={cn(
        'flex h-screen w-full bg-background text-foreground overflow-hidden flex-col md:flex-row transition-colors duration-300',
        isDarkMode ? 'dark' : ''
      )}
    >
      <MobileNav />
      <Sidebar />

      <div className="flex-1 h-full overflow-hidden flex flex-col relative">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-4">
            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Market Dashboard
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Real-time market analytics for Moku
                </p>
              </div>

              {/* RON Price Ticker */}
              <div className="flex items-center gap-3 bg-secondary/30 px-4 py-2 rounded-xl border border-border/50 shadow-sm">
                <Image
                  src="/Ronin_Mark_Blue.svg"
                  alt="RON"
                  width={20}
                  height={20}
                  className="w-10 h-10"
                />
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    RON Price
                  </p>
                  {loading ? (
                    <Skeleton className="h-6 w-20" />
                  ) : (
                    <p className="text-xl font-mono font-bold">
                      ${data?.ronPrice?.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* --- Tabs --- */}
            <Tabs defaultValue="moki" className="w-full space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-muted/50">
                <TabsTrigger
                  value="moki"
                  className="data-[state=active]:bg-background"
                >
                  Moki Genesis
                </TabsTrigger>
                <TabsTrigger
                  value="booster"
                  className="data-[state=active]:bg-background"
                >
                  GA Booster Box
                </TabsTrigger>
              </TabsList>

              {/* MOKI TAB */}
              <TabsContent
                value="moki"
                className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <MarketStats
                  stats={data?.moki}
                  loading={loading}
                  symbol="MOKI"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Listings by Fur */}
                  <Card className="h-full border-border bg-card shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <IconTag className="w-5 h-5 text-primary" />
                        Listings by Fur
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="space-y-4">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {data?.moki?.listingsByFur?.map((item: any) => (
                            <div key={item.fur} className="space-y-1.5">
                              <div className="flex justify-between text-sm font-medium">
                                <span className="flex items-center gap-2">
                                  <div
                                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  {item.fur}
                                </span>
                                <span className="font-mono text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                                  {item.count} listed
                                </span>
                              </div>
                              <div className="h-2.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                                <div
                                  className="h-full transition-all duration-1000 ease-out"
                                  style={{
                                    width: `${
                                      (item.count / (data.moki.listings || 1)) *
                                      100
                                    }%`,
                                    backgroundColor: item.color,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Activity Feed */}
                  <ActivityFeed
                    activityData={data?.moki?.activity}
                    loading={loading}
                  />
                </div>
              </TabsContent>

              {/* BOOSTER TAB */}
              <TabsContent
                value="booster"
                className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <MarketStats
                  stats={data?.booster}
                  loading={loading}
                  symbol="BOX"
                />

                <div className="grid grid-cols-1 gap-6">
                  <ActivityFeed
                    activityData={data?.booster?.activity}
                    loading={loading}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Footer isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function MarketStats({
  stats,
  loading,
  symbol,
}: {
  stats: any;
  loading: boolean;
  symbol: string;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: 'Total Volume',
      value: `${stats.volume.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })} RON`,
      sub: `$${stats.volumeUsd.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}`,
      icon: IconChartBar,
    },
    {
      label: 'Floor Price',
      value: `${stats.floor} RON`,
      sub: `$${stats.floorUsd.toFixed(2)}`,
      icon: IconCurrencyDollar,
      highlight: true,
    },
    {
      label: 'Total Supply',
      value: stats.supply.toLocaleString(),
      sub: symbol,
      icon: IconBox,
    },
    {
      label: 'Listed',
      value: stats.listings.toLocaleString(),
      sub: `${((stats.listings / stats.supply) * 100).toFixed(1)}% Listed`,
      icon: IconTag,
    },
    {
      label: 'Owners',
      value: stats.owners.toLocaleString(),
      sub: 'Wallets',
      icon: IconUsers,
    },
    {
      label: 'Unique',
      value: `${((stats.owners / stats.supply) * 100).toFixed(1)}%`,
      sub: 'Ownership Ratio',
      icon: IconTrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {items.map((item, i) => (
        <Card
          key={i}
          className="flex flex-col justify-between overflow-hidden relative border-border bg-card hover:border-primary/20 transition-all hover:shadow-sm"
        >
          <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {item.label}
            </span>
            <item.icon className="h-4 w-4 text-muted-foreground opacity-50" />
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div
              className={cn(
                'text-xl md:text-2xl font-bold truncate tracking-tight',
                item.highlight
              )}
            >
              {item.value}
            </div>
            <p className="text-xs text-muted-foreground truncate font-medium opacity-80 mt-1">
              {item.sub}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ActivityFeed({
  activityData,
  loading,
}: {
  activityData: any;
  loading: boolean;
}) {
  return (
    <Card className="h-full min-h-[400px] border-border bg-card shadow-sm flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <IconActivity className="w-5 h-5 text-primary" />
          Live Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <Tabs defaultValue="sales" className="w-full h-full flex flex-col">
          <div className="px-4 pb-2">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50">
              <TabsTrigger value="sales" className="text-xs gap-1">
                <IconShoppingBag size={14} /> Sales
              </TabsTrigger>
              <TabsTrigger value="listings" className="text-xs gap-1">
                <IconTags size={14} /> Listings
              </TabsTrigger>
              <TabsTrigger value="offers" className="text-xs gap-1">
                <IconMail size={14} /> Offers
              </TabsTrigger>
              <TabsTrigger value="transfers" className="text-xs gap-1">
                <IconTransfer size={14} /> Transfers
              </TabsTrigger>
            </TabsList>
          </div>

          {['sales', 'listings', 'offers', 'transfers'].map((tab) => (
            <TabsContent key={tab} value={tab} className="flex-1 mt-0">
              <ScrollArea className="h-[300px]">
                {loading ? (
                  <div className="space-y-4 p-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                  </div>
                ) : activityData?.[tab] && activityData[tab].length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {activityData[tab].map((item: any) => (
                      <div
                        key={item.id + item.time + item.type}
                        className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="relative h-10 w-10 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={500}
                              height={500}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted text-[8px] text-muted-foreground">
                              {item.name}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              #{item.id}
                            </span>
                          </div>

                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            {tab === 'transfers' ? (
                              <span className="flex items-center gap-1 overflow-hidden truncate">
                                {item.from} <IconArrowRight size={10} />{' '}
                                {item.to}
                              </span>
                            ) : (
                              <span>
                                {tab === 'offers' ? 'Offer:' : 'Price:'}{' '}
                                <span className="font-bold text-foreground">
                                  {item.price} RON
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className="text-[10px] h-5 font-mono opacity-70"
                          >
                            {item.time.split(',')[0]}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 min-h-[200px]">
                    <IconActivity className="w-8 h-8 opacity-20 mb-2" />
                    <p className="text-sm">No recent {tab}</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
