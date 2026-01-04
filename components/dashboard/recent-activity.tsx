'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  IconArrowsExchange,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react';
import { RECENT_ACTIVITY } from '@/lib/constants';

export function RecentActivity({ isPrivacyMode }: { isPrivacyMode: boolean }) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest transactions</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {RECENT_ACTIVITY.map((activity, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                    activity.type === 'Sold' || activity.type === 'Received'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-500'
                  )}
                >
                  {activity.type === 'Sold' || activity.type === 'Received' ? (
                    <IconTrendingUp size={16} />
                  ) : (
                    <IconTrendingDown size={16} />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {activity.type} {activity.item}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  'text-sm font-bold whitespace-nowrap',
                  activity.positive ? 'text-green-500' : 'text-foreground'
                )}
              >
                {activity.positive ? '+' : ''}
                {isPrivacyMode ? '•••' : activity.price}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button variant="ghost" size="sm" className="w-full text-xs">
          View on Ronin Explorer <IconArrowsExchange className="ml-2 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
