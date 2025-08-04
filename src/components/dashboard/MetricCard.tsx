import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  previousValue?: number;
  target?: number;
  format?: "percentage" | "decimal" | "currency";
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit = "",
  previousValue,
  target,
  format = "decimal",
  className
}: MetricCardProps) {
  const formatValue = (val: number): string => {
    switch (format) {
      case "percentage":
        return `${val.toFixed(2)}%`;
      case "currency":
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      default:
        return val.toFixed(2);
    }
  };

  const getTrendInfo = () => {
    if (!previousValue) return null;
    
    const change = value - previousValue;
    const changePercent = (change / previousValue) * 100;
    
    if (Math.abs(changePercent) < 0.01) {
      return {
        icon: Minus,
        color: "text-muted-foreground",
        bgColor: "bg-muted/20",
        text: "No change"
      };
    }
    
    const isPositive = change > 0;
    return {
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? "text-success" : "text-destructive",
      bgColor: isPositive ? "bg-success/10" : "bg-destructive/10",
      text: `${isPositive ? '+' : ''}${changePercent.toFixed(1)}%`
    };
  };

  const trendInfo = getTrendInfo();

  const getTargetStatus = () => {
    if (!target) return null;
    
    const achievement = (value / target) * 100;
    const isAchieved = achievement >= 100;
    
    return {
      achievement,
      isAchieved,
      color: isAchieved ? "text-success" : "text-warning"
    };
  };

  const targetStatus = getTargetStatus();

  return (
    <Card className={cn("shadow-card hover:shadow-card-hover transition-smooth", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-foreground">
              {formatValue(value)}
              {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
            </div>
            
            {targetStatus && (
              <div className="text-xs text-muted-foreground mt-1">
                Target: {formatValue(target!)} 
                <span className={cn("ml-1", targetStatus.color)}>
                  ({targetStatus.achievement.toFixed(0)}%)
                </span>
              </div>
            )}
          </div>
          
          {trendInfo && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              trendInfo.bgColor,
              trendInfo.color
            )}>
              <trendInfo.icon className="h-3 w-3" />
              {trendInfo.text}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}