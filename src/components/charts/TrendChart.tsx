import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface TrendData {
  period: string;
  value: number;
  benchmark?: number;
}

interface TrendChartProps {
  data: TrendData[];
  title: string;
  yAxisLabel: string;
  format?: "percentage" | "decimal" | "currency";
  showBenchmark?: boolean;
}

export function TrendChart({ 
  data, 
  title, 
  yAxisLabel, 
  format = "decimal",
  showBenchmark = false 
}: TrendChartProps) {
  const [timeframe, setTimeframe] = useState<'quarterly' | 'yearly'>('quarterly');

  const formatValue = (value: number): string => {
    switch (format) {
      case "percentage":
        return `${value.toFixed(1)}%`;
      case "currency":
        return `${(value / 1000000).toFixed(1)}M`;
      default:
        return value.toFixed(2);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-dropdown p-3">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatValue(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={timeframe === 'quarterly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe('quarterly')}
              className="text-xs"
            >
              Quarterly
            </Button>
            <Button
              variant={timeframe === 'yearly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe('yearly')}
              className="text-xs"
            >
              Yearly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="period" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={formatValue}
                label={{ 
                  value: yAxisLabel, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2, fill: 'hsl(var(--card))' }}
                name="Actual"
              />
              {showBenchmark && (
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 3 }}
                  name="Industry Avg"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}