'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IconPin } from '@tabler/icons-react';
import { NAV_ITEMS } from '@/lib/constants';
import Image from 'next/image';

// Removed SidebarProps interface

export function Sidebar() {
  const [isPinned, setIsPinned] = React.useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'hidden md:flex group flex-col border-r border-border bg-sidebar/50 backdrop-blur-xl h-full transition-all duration-300 ease-in-out shrink-0 z-50 relative overflow-hidden p-2',
        isPinned ? 'w-64' : 'w-16 hover:w-64'
      )}
    >
      {/* Logo Section */}
      <div className="h-14 flex items-center shrink-0 mb-2 px-0 relative overflow-hidden">
        <div
          className={cn(
            'h-full flex items-center justify-center shrink-0 transition-all duration-300 w-full',
            isPinned
              ? 'w-10 justify-start'
              : 'group-hover:w-10 group-hover:justify-start'
          )}
        >
          <div className="h-8 w-8 rounded-full flex items-center justify-center shadow-md shrink-0">
            <Image
              src="/mokidex logo.svg"
              alt="MokiDex Logo"
              width={32}
              height={32}
            />
          </div>
        </div>

        <h1
          className={cn(
            'text-xl font-bold tracking-tight transition-opacity duration-300 whitespace-nowrap overflow-hidden absolute left-12',
            isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          Mokidex
        </h1>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 transition-opacity duration-300',
            isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
          onClick={() => setIsPinned(!isPinned)}
          title={isPinned ? 'Unpin Sidebar' : 'Pin Sidebar'}
        >
          <IconPin
            className={cn('h-4 w-4 rotate-45', isPinned && 'fill-current')}
          />
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href} passHref>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start px-0 overflow-hidden relative transition-all duration-300 h-10 rounded-md',
                  isActive ? 'bg-secondary' : ''
                )}
              >
                <span
                  className={cn(
                    'w-full flex items-center justify-center shrink-0 transition-all duration-300',
                    isPinned ? 'w-10' : 'group-hover:w-10'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </span>

                <span
                  className={cn(
                    'transition-opacity duration-300 whitespace-nowrap absolute left-10',
                    isPinned
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  )}
                >
                  {item.name}
                </span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
