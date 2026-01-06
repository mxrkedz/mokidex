'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconWallet } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils'; // 1. Import cn utility

interface ImportWalletModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onImport: (address: string) => void;
  isDarkMode: boolean; // 2. Add prop
}

export function ImportWalletModal({
  isOpen,
  onClose,
  onImport,
  isDarkMode, // 3. Destructure prop
}: ImportWalletModalProps) {
  const [address, setAddress] = React.useState('');

  const handleImport = () => {
    if (address.trim()) {
      // Normalize to lowercase to handle caps lock/mixed case
      onImport(address.trim().toLowerCase());
      onClose(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* 4. Apply 'dark' class conditionally to DialogContent */}
      <DialogContent
        className={cn(
          'bg-background border-border text-foreground sm:max-w-md',
          isDarkMode ? 'dark' : ''
        )}
      >
        <DialogHeader>
          <DialogTitle>Import Wallet</DialogTitle>
          <DialogDescription>
            Enter a Ronin address to track your Mokullection. This will be saved
            locally.
          </DialogDescription>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100"></DialogClose>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="wallet-address">Wallet Address</Label>
            <div className="relative">
              <IconWallet className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="wallet-address"
                placeholder="0x..."
                className="pl-9"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!address.trim()}>
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
