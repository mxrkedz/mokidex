'use client';
import { Button } from '@/components/ui/button';
import {
  IconBrandTwitter,
  IconBrandDiscord,
  IconBrandGithub,
  IconMoon,
  IconSun,
  IconCheck,
  IconCopy,
} from '@tabler/icons-react';
import { SUPPORT_ADDRESS, SHORT_ADDRESS } from '@/lib/constants';
import * as React from 'react';

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
    <footer className="border-t border-border pt-12 mt-12 pb-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
        {/* Left: Branding & Builder */}
        <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary-foreground">
                M
              </span>
            </div>
            <span className="font-bold text-lg tracking-tight">MokuDash</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Built by <span className="font-bold text-foreground">@mxrkedz</span>
          </p>
          <p className="text-xs text-muted-foreground/60">
            &copy; 2024 Moku Grand Arena.
          </p>
        </div>

        {/* Middle: Support & Address (CENTERED) */}
        <div className="flex flex-col gap-3 w-full md:w-auto max-w-sm md:max-w-md bg-muted/30 p-4 rounded-lg border border-border/50 items-center text-center">
          <p className="text-sm font-medium text-foreground">
            Your support translates directly into faster updates and better
            features.
          </p>

          <div className="flex items-center justify-center gap-2 bg-background/80 border border-border rounded-md px-3 py-1.5 w-fit">
            <span className="font-mono text-xs text-muted-foreground">
              {SHORT_ADDRESS}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              className="h-5 w-5 hover:bg-muted ml-1"
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
        <div className="flex flex-col items-center md:items-end gap-4">
          {/* Theme Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Theme
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? (
                <IconMoon className="h-4 w-4 text-blue-400" />
              ) : (
                <IconSun className="h-4 w-4 text-orange-500" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-xs"
              className="h-8 w-8 hover:bg-muted hover:text-blue-400"
            >
              <IconBrandTwitter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="h-8 w-8 hover:bg-muted hover:text-indigo-400"
            >
              <IconBrandDiscord className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="h-8 w-8 hover:bg-muted hover:text-foreground"
            >
              <IconBrandGithub className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground hover:underline">
              Terms
            </a>
            <a href="#" className="hover:text-foreground hover:underline">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
