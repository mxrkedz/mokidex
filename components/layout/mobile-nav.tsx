'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconMenu2, IconUser } from '@tabler/icons-react';
import { NAV_ITEMS } from '@/lib/constants';

interface MobileNavProps {
  isConnected: boolean;
  handleConnect: () => void;
}

export function MobileNav({ isConnected, handleConnect }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <header className="md:hidden h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 z-50">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-md">
          <span className="font-bold text-primary-foreground">M</span>
        </div>
        <span className="font-bold text-lg tracking-tight">MokuDex</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
        >
          <IconMenu2 className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Navigation</DropdownMenuLabel>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} passHref>
                  <DropdownMenuItem className={isActive ? 'bg-accent' : ''}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                  </DropdownMenuItem>
                </Link>
              );
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Wallet</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleConnect}>
              <div className="flex items-center gap-2 w-full">
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                  <IconUser className="h-3 w-3" />
                </div>
                {isConnected ? (
                  <div className="flex flex-col text-xs">
                    <span className="font-medium">Ronin Wallet</span>
                    <span className="text-muted-foreground">
                      ronin:41...89a2
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-medium">Connect Wallet</span>
                )}
                {isConnected && (
                  <Badge
                    variant="outline"
                    className="ml-auto text-[10px] h-4 px-1 text-green-500 border-green-500/20"
                  >
                    Connected
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
