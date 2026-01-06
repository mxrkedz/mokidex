'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  IconBrandTwitter,
  IconMoon,
  IconSun,
  IconCheck,
  IconCopy,
} from '@tabler/icons-react';
import { SUPPORT_ADDRESS, SHORT_ADDRESS } from '@/lib/constants';

export function Footer({
  isDarkMode,
  setIsDarkMode,
}: {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPPORT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="border-t border-border py-6 mt-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
        {/* Left: Branding & Disclaimer */}
        <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left max-w-xs">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full flex items-center justify-center">
              <Image
                src="/mokidex logo.svg"
                alt="MokiDex"
                width={16}
                height={16}
                className="rounded-full"
              />
            </div>
            <span className="font-bold text-base tracking-tight">Mokidex</span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-col md:flex-row md:gap-2 text-xs text-muted-foreground/90">
              <span>
                Built by{' '}
                <span className="font-bold text-foreground">
                  <a
                    href="https://x.com/mxrkedz"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @mxrkedz
                  </a>
                </span>
              </span>
              <span className="hidden md:inline">•</span>
              <span>&copy; {new Date().getFullYear()} Mokidex</span>
            </div>

            {/* Added Disclaimer */}
            <p className="text-[10px] text-muted-foreground/50 leading-tight">
              Mokidex is an independent fan project not affiliated with or
              endorsed by Moku. All trademarks belong to their respective
              owners.
            </p>
          </div>
        </div>

        {/* Middle: Support & Address */}
        <div className="flex flex-col gap-2 w-full md:w-auto items-center">
          <span className="text-xs font-medium text-muted-foreground text-center">
            Your support translates directly into faster updates.
          </span>

          <div className="flex items-center justify-center gap-2 bg-muted/50 border border-border rounded-md px-2 py-1 w-fit">
            <span className="font-mono text-[10px] text-muted-foreground">
              {SHORT_ADDRESS}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              className="h-4 w-4 hover:bg-muted ml-1"
              onClick={handleCopy}
              title="Copy Address"
            >
              {copied ? (
                <IconCheck className="h-3 w-3 text-green-500" />
              ) : (
                <IconCopy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Right: Actions & Links */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-full p-0.5">
              <Button
                variant="ghost"
                size="icon-xs"
                className="h-6 w-6 rounded-full hover:bg-muted"
                onClick={() => setIsDarkMode(!isDarkMode)}
                title="Toggle Theme"
              >
                {isDarkMode ? (
                  <IconMoon className="h-3.5 w-3.5 text-blue-400" />
                ) : (
                  <IconSun className="h-3.5 w-3.5 text-orange-500" />
                )}
              </Button>
            </div>

            <div className="h-4 w-px bg-border mx-1" />

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                className="h-7 w-7 hover:bg-muted text-muted-foreground hover:text-blue-400"
                onClick={() => window.open('https://x.com/mxrkedz', '_blank')}
              >
                <IconBrandTwitter className="h-4 w-4" />
              </Button>
              {/* <Button
                variant="ghost"
                size="icon-xs"
                className="h-7 w-7 hover:bg-muted text-muted-foreground hover:text-indigo-400"
              >
                <IconBrandDiscord className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                className="h-7 w-7 hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <IconBrandGithub className="h-4 w-4" />
              </Button> */}
            </div>
          </div>

          {/* <div className="flex gap-3 text-[10px] text-muted-foreground">
            <a href="#" className="hover:text-foreground hover:underline">
              Terms
            </a>
            <a href="#" className="hover:text-foreground hover:underline">
              Privacy
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
