'use client';

import { Button } from '@/components/ui/button';
import {
  IconEye,
  IconEyeOff,
  IconRefresh,
  IconPlus,
  IconWallet,
} from '@tabler/icons-react';

interface DashboardHeaderProps {
  isPrivacyMode: boolean;
  setIsPrivacyMode: (value: boolean) => void;
  isConnected: boolean;
  handleConnect: () => void;
}

export function DashboardHeader({
  isPrivacyMode,
  setIsPrivacyMode,
  isConnected,
  handleConnect,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
      {/* Left Side: Portfolio Value */}
      <div className="flex flex-col items-start min-w-[140px]">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Main Portfolio
        </span>
        <div className="flex items-center gap-2">
          <span className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {isPrivacyMode ? '••••••••' : '₳ 15,230'}
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
        <span className="text-base text-muted-foreground font-medium">
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

        {!isConnected && (
          <Button
            onClick={handleConnect}
            className="gap-2 flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white"
          >
            <IconWallet className="w-4 h-4" />
            Connect Ronin Wallet
          </Button>
        )}
      </div>
    </div>
  );
}
