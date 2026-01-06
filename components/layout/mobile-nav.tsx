'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconMenu2 } from '@tabler/icons-react';
import { NAV_ITEMS } from '@/lib/constants';
import Image from 'next/image';

// Removed MobileNavProps interface

export function MobileNav() {
  const pathname = usePathname();

  return (
    <header className="md:hidden h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 z-50">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full flex items-center justify-center shadow-md">
          <Image
            src="/mokidex logo.svg"
            alt="MokiDex Logo"
            width={32}
            height={32}
          />
        </div>
        <span className="font-bold text-lg tracking-tight">Mokidex</span>
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
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
