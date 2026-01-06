'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IconRefresh,
  IconWallet,
  IconPencil,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { TimeRange } from '@/lib/types';

interface CollectionHeaderProps {
  totalRonValue: number;
  ronPriceUsd: number;
  onRefresh: () => void;
  isRefreshing: boolean;
  isLoading?: boolean;
  timeRange: TimeRange;
  onImportWallet: () => void;
  walletAddress: string;
  portfolioName: string;
  onUpdateName: (name: string) => void;
}

export function CollectionHeader({
  totalRonValue,
  ronPriceUsd,
  onRefresh,
  isRefreshing,
  isLoading = false,
  onImportWallet,
  walletAddress,
  portfolioName,
  onUpdateName,
}: CollectionHeaderProps) {
  const totalUsdValue = totalRonValue * ronPriceUsd;

  // -- Edit Name Logic --
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempName, setTempName] = React.useState('');

  const defaultName = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}'s Mokullection`
    : 'My Mokullection';

  const displayName = portfolioName || defaultName;

  const handleStartEdit = () => {
    setTempName(portfolioName || defaultName);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (tempName.trim()) {
      onUpdateName(tempName.trim());
    } else {
      onUpdateName('');
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

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
        {/* Editable Label Section */}
        <div className="h-8 flex items-center mb-1 w-full">
          {isLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : isEditing ? (
            <div className="flex items-center gap-1 animate-in fade-in duration-200">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-7 w-[200px] text-xs font-semibold uppercase tracking-wider bg-background"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                onClick={handleSave}
              >
                <IconCheck size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={handleCancel}
              >
                <IconX size={14} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {displayName}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                onClick={handleStartEdit}
              >
                <IconPencil size={12} />
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <div className="flex items-center gap-2">
            <div className="text-3xl md:text-4xl font-bold tracking-tight text-foreground min-h-[40px] flex items-center">
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                <>
                  <span>{whole}</span>
                  <span className="text-muted-foreground/60 font-mono">
                    {decimal} <span className="font-normal">RON</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <span className="text-base text-muted-foreground font-medium mt-1 min-h-[24px] flex items-center font-mono">
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            `≈ $${totalUsdValue.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}`
          )}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <Button
          variant="ghost"
          size="icon"
          title="Refresh Data"
          onClick={onRefresh}
          disabled={isRefreshing || isLoading}
          className={cn((isRefreshing || isLoading) && 'animate-spin')}
        >
          <IconRefresh className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          className="gap-2 flex-1 md:flex-none"
          onClick={onImportWallet}
        >
          <IconWallet className="w-4 h-4" />
          Change Wallet
        </Button>
      </div>
    </div>
  );
}
