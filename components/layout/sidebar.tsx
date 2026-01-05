'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IconPin, IconUser } from '@tabler/icons-react';
import { NAV_ITEMS } from '@/lib/constants';

interface SidebarProps {
  isConnected: boolean;
}

export function Sidebar({ isConnected }: SidebarProps) {
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
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-md shrink-0">
            <span className="font-bold text-primary-foreground">M</span>
          </div>
        </div>

        <h1
          className={cn(
            'text-xl font-bold tracking-tight transition-opacity duration-300 whitespace-nowrap overflow-hidden absolute left-12',
            isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          MokuDash
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
          // Check if link is active
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

      {/* User Section */}
      <div className="mt-auto pt-2 border-t border-border">
        <div className="flex items-center h-12 rounded-md hover:bg-card/50 cursor-pointer transition-all duration-300 relative overflow-hidden">
          <div
            className={cn(
              'w-full flex items-center justify-center shrink-0 transition-all duration-300',
              isPinned ? 'w-10' : 'group-hover:w-10'
            )}
          >
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border shrink-0">
              <IconUser className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div
            className={cn(
              'flex flex-col overflow-hidden transition-opacity duration-300 absolute left-10 w-[calc(100%-2.5rem)]',
              isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}
          >
            {isConnected ? (
              <>
                <span className="text-sm font-medium truncate">
                  Ronin Wallet
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground leading-none">
                    Connected
                  </span>
                </div>
              </>
            ) : (
              <span className="text-sm font-medium truncate text-muted-foreground">
                Guest User
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
