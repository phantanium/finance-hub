import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface HealthScoreGaugeProps {
  score: number;
  maxScore?: number;
  title?: string;
  className?: string;
}

export function HealthScoreGauge({ 
  score, 
  maxScore = 100, 
  title = "Financial Health Score",
  className 
}: HealthScoreGaugeProps) {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "hsl(var(--success))";
    if (score >= 60) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  const data = [
    { name: 'Score', value: percentage },
    { name: 'Remaining', value: 100 - percentage }
  ];

  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <Card className={`shadow-card ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                <Cell fill={scoreColor} />
                <Cell fill="hsl(var(--muted))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Score display in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold" style={{ color: scoreColor }}>
              {score}
            </div>
            <div className="text-sm text-muted-foreground">out of {maxScore}</div>
            <div className="text-xs font-medium mt-1" style={{ color: scoreColor }}>
              {scoreLabel}
            </div>
          </div>
        </div>
        
        {/* Score breakdown */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Liquidity</span>
            <span className="font-medium text-foreground">
              {Math.round(score * 0.25)}/25
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Profitability</span>
            <span className="font-medium text-foreground">
              {Math.round(score * 0.30)}/30
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Leverage</span>
            <span className="font-medium text-foreground">
              {Math.round(score * 0.25)}/25
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Activity</span>
            <span className="font-medium text-foreground">
              {Math.round(score * 0.20)}/20
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}