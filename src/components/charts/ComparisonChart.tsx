import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComparisonData {
  metric: string;
  company: number;
  industry: number;
  target?: number;
}

interface ComparisonChartProps {
  data: ComparisonData[];
  title: string;
  companyName: string;
  format?: "percentage" | "decimal" | "currency";
}

export function ComparisonChart({ 
  data, 
  title, 
  companyName,
  format = "decimal"
}: ComparisonChartProps) {
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
          <p className="font-medium text-foreground mb-2">{label}</p>
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
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Comparison with industry benchmarks
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="metric" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={formatValue}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="company"
                fill="hsl(var(--primary))"
                name={companyName}
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="industry"
                fill="hsl(var(--muted-foreground))"
                name="Industry Average"
                radius={[2, 2, 0, 0]}
              />
              {data.some(d => d.target) && (
                <Bar
                  dataKey="target"
                  fill="hsl(var(--success))"
                  name="Target"
                  radius={[2, 2, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}