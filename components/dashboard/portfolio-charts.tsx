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

const portfolioChartConfig = {
  value: {
    label: 'Value (RON)',
    color: '#2563eb',
  },
} satisfies ChartConfig;

const rarityChartConfig = {
  Common: { label: 'Common', color: RARITY_COLORS.Common },
  Rainbow: { label: 'Rainbow', color: RARITY_COLORS.Rainbow },
  Gold: { label: 'Gold', color: RARITY_COLORS.Gold },
  Shadow: { label: 'Shadow', color: RARITY_COLORS.Shadow },
  Spirit: { label: 'Spirit', color: RARITY_COLORS.Spirit },
  '1 of 1': { label: '1 of 1', color: RARITY_COLORS['1 of 1'] },
} satisfies ChartConfig;

export function PortfolioCharts({ isPrivacyMode }: { isPrivacyMode: boolean }) {
  const [timeRange, setTimeRange] = React.useState<TimeRange>('7d');

  return (
    <div className="space-y-8 lg:col-span-2 flex flex-col">
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
                  dataKey="Rainbow"
                  stackId="a"
                  fill="var(--color-Rainbow)"
                  stroke="var(--background)"
                  strokeWidth={2}
                />
                <Bar
                  dataKey="Gold"
                  stackId="a"
                  fill="var(--color-Gold)"
                  stroke="var(--background)"
                  strokeWidth={2}
                />
                <Bar
                  dataKey="Shadow"
                  stackId="a"
                  fill="var(--color-Shadow)"
                  stroke="var(--background)"
                  strokeWidth={2}
                />
                <Bar
                  dataKey="Spirit"
                  stackId="a"
                  fill="var(--color-Spirit)"
                  stroke="var(--background)"
                  strokeWidth={2}
                />
                <Bar
                  dataKey="1 of 1"
                  stackId="a"
                  fill="var(--color-1 of 1)"
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
