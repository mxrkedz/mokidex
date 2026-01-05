'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { IconCards, IconPackage } from '@tabler/icons-react';
import { RealNFT } from '@/lib/nft-types';

const chartConfig = {
  value: { label: 'Value (RON)', color: '#2563eb' },
};

interface CollectionOverviewProps {
  isPrivacyMode: boolean;
  assets: RealNFT[];
  historyData: { date: string; value: number }[]; // New Prop
}

export function CollectionOverview({
  isPrivacyMode,
  assets,
  historyData,
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
      icon: IconCards,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Booster Box',
      count: boosterCount,
      icon: IconPackage,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: Inventory Status */}
      <Card className="lg:col-span-1 h-full">
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
          <CardDescription>Asset distribution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <span className="text-xl font-bold">{item.count}</span>
            </div>
          ))}

          <div className="pt-4 mt-2 border-t border-border">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Total Items</span>
              <span>{totalCount}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden flex">
              <div
                className="bg-green-500 h-full transition-all duration-500"
                style={{
                  width: `${
                    totalCount > 0 ? (mokiCount / totalCount) * 100 : 0
                  }%`,
                }}
              />
              <div
                className="bg-purple-500 h-full transition-all duration-500"
                style={{
                  width: `${
                    totalCount > 0 ? (boosterCount / totalCount) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT: Portfolio History Chart */}
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader className="pb-4">
          <div className="space-y-1">
            <CardTitle>Portfolio History</CardTitle>
            <CardDescription>
              Value based on recent trade history (RON)
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pl-0 pb-0 flex-1 min-h-[300px]">
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
                <linearGradient
                  id="fillValueCollection"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
                dataKey="date"
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
                content={<ChartTooltipContent indicator="dot" hideLabel />}
              />

              <Area
                dataKey="value"
                type="monotone"
                animationDuration={1500}
                fill="url(#fillValueCollection)"
                fillOpacity={1}
                stroke="var(--color-value)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
