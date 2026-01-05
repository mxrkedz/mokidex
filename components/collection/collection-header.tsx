'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  IconEye,
  IconEyeOff,
  IconRefresh,
  IconPlus,
  IconTrendingUp,
  IconTrendingDown,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { TimeRange } from '@/lib/types'; // Import TimeRange type

interface CollectionHeaderProps {
  totalRonValue: number;
  ronPriceUsd: number;
  portfolioChange24h: number;
  isPrivacyMode: boolean;
  setIsPrivacyMode: (val: boolean) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  timeRange: TimeRange; // Added prop
}

export function CollectionHeader({
  totalRonValue,
  ronPriceUsd,
  portfolioChange24h,
  isPrivacyMode,
  setIsPrivacyMode,
  onRefresh,
  isRefreshing,
  timeRange, // Destructure new prop
}: CollectionHeaderProps) {
  const isPositive = portfolioChange24h >= 0;

  const totalUsdValue = totalRonValue * ronPriceUsd;

  // Formatting: "1,234.56" -> ["1,234", ".56"]
  const formatValue = (val: number) => {
    const str = val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const dotIndex = str.indexOf('.');
    if (dotIndex === -1) return [str, ''];
    return [str.slice(0, dotIndex), str.slice(dotIndex)];
  };

  const [whole, decimal] = formatValue(totalRonValue);

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
      <div className="flex flex-col items-start min-w-[140px]">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Main Portfolio
        </span>

        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <div className="flex items-center gap-2">
            <div className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {isPrivacyMode ? (
                '••••••••'
              ) : (
                <>
                  <span>{whole}</span>
                  <span className="text-muted-foreground/60">
                    {decimal} RON
                  </span>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
            >
              {isPrivacyMode ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </Button>
          </div>

          {!isPrivacyMode && (
            <div className="flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-left-2 duration-500">
              <div
                className={cn(
                  'flex items-center',
                  isPositive ? 'text-green-500' : 'text-red-500'
                )}
              >
                {isPositive ? (
                  <IconTrendingUp size={16} className="mr-1" />
                ) : (
                  <IconTrendingDown size={16} className="mr-1" />
                )}
                {/* Dynamically show the time range label */}
                <span>
                  {Math.abs(portfolioChange24h).toFixed(2)}% ({timeRange})
                </span>
              </div>
            </div>
          )}
        </div>

        <span className="text-base text-muted-foreground font-medium mt-1">
          {isPrivacyMode
            ? '••••••'
            : `≈ $${totalUsdValue.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })} USD`}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <Button
          variant="ghost"
          size="icon"
          title="Refresh Data"
          onClick={onRefresh}
          disabled={isRefreshing}
          className={cn(isRefreshing && 'animate-spin')}
        >
          <IconRefresh className="w-4 h-4" />
        </Button>
        <Button variant="outline" className="gap-2 flex-1 md:flex-none">
          <IconPlus className="w-4 h-4" />
          Create Portfolio
        </Button>
      </div>
    </div>
  );
}
