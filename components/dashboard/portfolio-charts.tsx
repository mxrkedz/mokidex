'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HISTORY_DATA,
  RARITY_DISTRIBUTION,
  RARITY_COLORS,
} from '@/lib/constants';
import { TimeRange } from '@/lib/types';

// Chart configurations local to this component
const portfolioChartConfig = {
  value: {
    label: 'Value (RON)',
    color: '#2563eb',
  },
} satisfies ChartConfig;

const rarityChartConfig = {
  Common: { label: 'Common', color: RARITY_COLORS.Common },
  Uncommon: { label: 'Uncommon', color: RARITY_COLORS.Uncommon },
  Rare: { label: 'Rare', color: RARITY_COLORS.Rare },
  Epic: { label: 'Epic', color: RARITY_COLORS.Epic },
  Legendary: { label: 'Legendary', color: RARITY_COLORS.Legendary },
} satisfies ChartConfig;

export function PortfolioCharts({ isPrivacyMode }: { isPrivacyMode: boolean }) {
  const [timeRange, setTimeRange] = React.useState<TimeRange>('7d');

  return (
    <div className="space-y-8 lg:col-span-2 flex flex-col">
      {/* Portfolio History Chart */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div className="space-y-1">
            <CardTitle>Portfolio History</CardTitle>
            <CardDescription>Value fluctuation (RON)</CardDescription>
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
          <ChartContainer
            config={portfolioChartConfig}
            className="h-full w-full aspect-auto"
          >
            <AreaChart
              accessibilityLayer
              data={HISTORY_DATA[timeRange]}
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
                fill="url(#fillValue)"
                fillOpacity={1}
                stroke="var(--color-value)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Rarity Distribution Chart */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Rarity Distribution</CardTitle>
          <CardDescription className="text-xs">Deck Ratio</CardDescription>
        </CardHeader>
        <CardContent className="py-2">
          <div className="h-[60px] w-full">
            <ChartContainer
              config={rarityChartConfig}
              className="h-full w-full"
            >
              <BarChart
                layout="vertical"
                data={RARITY_DISTRIBUTION}
                stackOffset="expand"
                margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  shared={false}
                />
                <Bar
                  dataKey="Common"
                  stackId="a"
                  fill="var(--color-Common)"
                  radius={[4, 0, 0, 4]}
                  stroke="var(--background)"
                  strokeWidth={2}
                />
                <Bar
                  dataKey="Uncommon"
                  stackId="a"
                  fill="var(--color-Uncommon)"
                  stroke="var(--background)"
                  strokeWidth={2}
                />
                <Bar
                  dataKey="Rare"
                  stackId="a"
                  fill="var(--color-Rare)"
                  stroke="var(--background)"
                  strokeWidth={2}
                />
                <Bar
                  dataKey="Epic"
                  stackId="a"
                  fill="var(--color-Epic)"
                  stroke="var(--background)"
                  strokeWidth={2}
                />
                <Bar
                  dataKey="Legendary"
                  stackId="a"
                  fill="var(--color-Legendary)"
                  radius={[0, 4, 4, 0]}
                  stroke="var(--background)"
                  strokeWidth={2}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
