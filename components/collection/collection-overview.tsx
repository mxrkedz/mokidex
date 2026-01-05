'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconCircleX, IconPackage } from '@tabler/icons-react';
import { RealNFT } from '@/lib/nft-types';
import { TimeRange } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  value: { label: 'Value (RON)', color: '#2563eb' },
} satisfies ChartConfig;

interface CollectionOverviewProps {
  isPrivacyMode: boolean;
  assets: RealNFT[];
  historyData: { shortDate: string; fullDate: string; value: number }[];
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  isLoading?: boolean;
  isHistoryLoading?: boolean;
}

export function CollectionOverview({
  isPrivacyMode,
  assets,
  historyData,
  timeRange,
  setTimeRange,
  isLoading,
  isHistoryLoading,
}: CollectionOverviewProps) {
  // Calculate Counts
  const mokiCount = assets.filter((a) => a.contractType === 'Moki').length;
  const boosterCount = assets.filter(
    (a) => a.contractType === 'Booster'
  ).length;
  const totalCount = assets.length;

  const statsItems = [
    {
      label: 'Moki NFT',
      count: mokiCount,
      icon: IconCircleX,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      label: 'Booster Box',
      count: boosterCount,
      icon: IconPackage,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: Inventory Status */}
      <Card className="lg:col-span-1 h-full flex flex-col">
        <CardHeader>
          <CardTitle>Mokullection Status</CardTitle>
          <CardDescription>Asset distribution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          {statsItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-md flex items-center justify-center ${item.bg}`}
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <span className="text-xl font-bold">
                {isLoading ? <Skeleton className="h-6 w-8" /> : item.count}
              </span>
            </div>
          ))}

          <div className="pt-4 mt-2 border-t border-border">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Total Items</span>
              <span>
                {isLoading ? (
                  <Skeleton className="h-4 w-8 inline-block" />
                ) : (
                  totalCount
                )}
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="w-full h-2 rounded-full" />
            ) : (
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden flex">
                <div
                  className="bg-yellow-400 h-full transition-all duration-500"
                  style={{
                    width: `${
                      totalCount > 0 ? (mokiCount / totalCount) * 100 : 0
                    }%`,
                  }}
                />
                <div
                  className="bg-purple-400 h-full transition-all duration-500"
                  style={{
                    width: `${
                      totalCount > 0 ? (boosterCount / totalCount) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* RIGHT: Portfolio History Chart */}
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div className="space-y-1">
            <CardTitle>Mokullection History</CardTitle>
            <CardDescription>
              {isLoading || isHistoryLoading
                ? 'Updating data...'
                : 'Value fluctuation (RON)'}
            </CardDescription>
          </div>
          <Tabs
            value={timeRange}
            onValueChange={(val) => setTimeRange(val as TimeRange)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-4 sm:w-64 h-8">
              <TabsTrigger value="24h" className="text-xs">
                24h
              </TabsTrigger>
              <TabsTrigger value="7d" className="text-xs">
                7d
              </TabsTrigger>
              <TabsTrigger value="30d" className="text-xs">
                30d
              </TabsTrigger>
              <TabsTrigger value="All" className="text-xs">
                All
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="pl-0 pb-0 flex-1 min-h-[300px]">
          {isLoading || isHistoryLoading ? (
            <div className="w-full h-full p-4 flex flex-col items-end gap-2">
              {/* Mimic Chart Axis and Line (Area Chart Style) */}
              <div className="flex-1 w-full flex items-end gap-0 border-l border-b border-muted pb-2 pl-2">
                <Skeleton className="h-[40%] flex-1 rounded-none rounded-tl-sm" />
                <Skeleton className="h-[60%] flex-1 rounded-none" />
                <Skeleton className="h-[50%] flex-1 rounded-none" />
                <Skeleton className="h-[70%] flex-1 rounded-none" />
                <Skeleton className="h-[80%] flex-1 rounded-none" />
                <Skeleton className="h-[65%] flex-1 rounded-none" />
                <Skeleton className="h-[90%] flex-1 rounded-none rounded-tr-sm" />
              </div>
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="h-full w-full aspect-auto"
            >
              <AreaChart
                accessibilityLayer
                data={historyData}
                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
              >
                <defs>
                  <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-value)"
                      stopOpacity={0.6}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-value)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-muted"
                />

                <XAxis
                  dataKey="shortDate"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  stroke="#888888"
                  minTickGap={32}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  stroke="#888888"
                  hide={isPrivacyMode}
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                  domain={['auto', 'auto']}
                />

                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      hideLabel
                      labelFormatter={(value, payload) => {
                        if (payload && payload.length > 0) {
                          return payload[0].payload.fullDate;
                        }
                        return value;
                      }}
                    />
                  }
                />

                <Area
                  dataKey="value"
                  type="monotone"
                  animationDuration={1500}
                  fill="url(#fillValue)"
                  fillOpacity={1}
                  stroke="var(--color-value)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
