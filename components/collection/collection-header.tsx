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

interface CollectionHeaderProps {
  totalValue: number;
  isPrivacyMode: boolean;
  setIsPrivacyMode: (val: boolean) => void;
}

export function CollectionHeader({
  totalValue,
  isPrivacyMode,
  setIsPrivacyMode,
}: CollectionHeaderProps) {
  // Mock data for the text metrics
  const change24h = 5.2; // Percentage
  const pnlValue = 1240;
  const pnlPercent = 8.4;
  const isPositive = true; // Overall trend

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
      {/* Left Side: Portfolio Value & Inline Stats */}
      <div className="flex flex-col items-start min-w-[140px]">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Main Portfolio
        </span>

        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          {/* Main Value */}
          <div className="flex items-center gap-2">
            <span className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {isPrivacyMode ? '••••••••' : `₳ ${totalValue.toLocaleString()}`}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              title={isPrivacyMode ? 'Show Values' : 'Hide Values'}
            >
              {isPrivacyMode ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </Button>
          </div>

          {/* Inline Stats (24h Change & PnL) */}
          {!isPrivacyMode && (
            <div className="flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-left-2 duration-500">
              {/* 24h Change */}
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
                <span>{change24h}% (24h)</span>
              </div>

              <span className="text-muted-foreground/30">|</span>

              {/* Profit / Loss */}
              <div
                className={cn(
                  'flex items-center',
                  pnlValue >= 0 ? 'text-green-500' : 'text-red-500'
                )}
              >
                <span>
                  {pnlValue >= 0 ? '+' : ''}${pnlValue.toLocaleString()} (
                  {pnlPercent}%) PnL
                </span>
              </div>
            </div>
          )}
        </div>

        <span className="text-base text-muted-foreground font-medium mt-1">
          {isPrivacyMode ? '••••••' : '$45,690 USD'}
        </span>
      </div>

      {/* Right Side: Actions */}
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          title="Refresh Data"
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
