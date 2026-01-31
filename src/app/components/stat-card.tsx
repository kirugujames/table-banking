import { Card, CardContent } from "@/app/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/app/components/ui/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  className 
}: StatCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
            {change && (
              <div className="mt-2 flex items-center gap-1">
                <span
                  className={cn(
                    'text-sm font-medium',
                    change.trend === 'up' && 'text-green-600 dark:text-green-400',
                    change.trend === 'down' && 'text-red-600 dark:text-red-400',
                    change.trend === 'neutral' && 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {change.value}
                </span>
                <span className="text-sm text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className={cn('rounded-lg p-3', iconBgColor)}>
            <Icon className={cn('h-6 w-6', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
