'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function CollectionStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collection Stats</CardTitle>
        <CardDescription>Breakdown of your assets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Genesis Moki</span>
          <span className="font-medium">12</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Arena Cards</span>
          <span className="font-medium">130</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Booster Boxes</span>
          <span className="font-medium">2</span>
        </div>
      </CardContent>
    </Card>
  );
}
