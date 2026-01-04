import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

export function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendValue,
  hidden = false,
}: {
  title: string;
  value: string;
  subtext?: string;
  icon?: React.ElementType;
  trend?: 'up' | 'down';
  trendValue?: string;
  hidden?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{hidden ? '••••••' : value}</div>
          {trend && trendValue && (
            <div
              className={cn(
                'text-xs font-medium flex items-center',
                trend === 'up' ? 'text-green-500' : 'text-red-500'
              )}
            >
              {trend === 'up' ? (
                <IconTrendingUp size={12} className="mr-1" />
              ) : (
                <IconTrendingDown size={12} className="mr-1" />
              )}
              {trendValue}
            </div>
          )}
        </div>
        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </CardContent>
    </Card>
  );
}
