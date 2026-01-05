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
} from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconCards, IconBox, IconPackage } from '@tabler/icons-react';

import { HISTORY_DATA } from '@/lib/constants';
import { TimeRange } from '@/lib/types';

const chartConfig = {
  value: { label: 'Value (RON)', color: '#2563eb' },
};

export function CollectionOverview({
  isPrivacyMode,
}: {
  isPrivacyMode: boolean;
}) {
  // State for the Graph Tabs (24h, 7d, etc.)
  const [timeRange, setTimeRange] = React.useState<TimeRange>('7d');

  // Mock asset counts
  const assets = [
    {
      label: 'Cards',
      count: 142,
      icon: IconCards,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Booster Packs',
      count: 5,
      icon: IconPackage,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Booster Boxes',
      count: 2,
      icon: IconBox,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: Asset Summary Stats */}
      <Card className="lg:col-span-1 h-full">
        <CardHeader>
          <CardTitle>My Assets</CardTitle>
          <CardDescription>Inventory breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {assets.map((item) => (
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
              <span>149</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden flex">
              <div className="bg-blue-500 h-full w-[85%]" />
              <div className="bg-purple-500 h-full w-[10%]" />
              <div className="bg-orange-500 h-full w-[5%]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT: Portfolio History Chart (Exact copy of Dashboard logic) */}
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div className="space-y-1">
            <CardTitle>Portfolio History</CardTitle>
            <CardDescription>Value fluctuation (RON)</CardDescription>
          </div>

          {/* Time Range Tabs */}
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
          <ChartContainer
            config={chartConfig}
            className="h-full w-full aspect-auto"
          >
            <AreaChart
              accessibilityLayer
              data={HISTORY_DATA[timeRange]}
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
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                stroke="#888888"
                hide={isPrivacyMode}
                tickFormatter={(value) => `₳${value}`}
                domain={['auto', 'auto']}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" hideLabel />}
              />
              <Area
                dataKey="value"
                type="monotone"
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
