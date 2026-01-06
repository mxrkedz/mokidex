'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconX } from '@tabler/icons-react';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export function AddCardModal({ isOpen, onClose }: AddCardModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-border text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Card</DialogTitle>
          <DialogDescription>
            Manually add a card to your portfolio.
          </DialogDescription>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
          <IconX size={16} />
        </DialogClose>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Name</label>
            <input
              className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Moku Master"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rarity</label>
              <select className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Common</option>
                <option>Uncommon</option>
                <option>Rare</option>
                <option>Epic</option>
                <option>Legendary</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (RON)</label>
              <input
                type="number"
                className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button onClick={() => onClose(false)}>Add to Collection</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
