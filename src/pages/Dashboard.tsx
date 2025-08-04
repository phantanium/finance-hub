import { MetricCard } from "@/components/dashboard/MetricCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import { HealthScoreGauge } from "@/components/charts/HealthScoreGauge";

interface Company {
  ticker: string;
  name: string;
  sector: string;
}

interface DashboardProps {
  selectedCompany: Company;
}

export default function Dashboard({ selectedCompany }: DashboardProps) {
  // Mock data - in real application, this would come from API
  const mockTrendData = [
    { period: "2023-Q1", value: 1.20, benchmark: 1.15 },
    { period: "2023-Q2", value: 1.23, benchmark: 1.18 },
    { period: "2023-Q3", value: 1.24, benchmark: 1.20 },
    { period: "2023-Q4", value: 1.25, benchmark: 1.22 },
    { period: "2024-Q1", value: 1.28, benchmark: 1.25 }
  ];

  const mockComparisonData = [
    { metric: "Current Ratio", company: 1.25, industry: 1.22, target: 1.30 },
    { metric: "ROE", company: 15.2, industry: 12.8, target: 16.0 },
    { metric: "DER", company: 0.65, industry: 0.70, target: 0.60 },
    { metric: "Asset Turnover", company: 0.33, industry: 0.35, target: 0.40 }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Financial Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis for {selectedCompany.name} ({selectedCompany.ticker})
          </p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Current Ratio"
          value={1.25}
          previousValue={1.24}
          target={1.30}
          format="decimal"
        />
        <MetricCard
          title="Return on Equity"
          value={15.2}
          previousValue={14.8}
          target={16.0}
          format="percentage"
        />
        <MetricCard
          title="Debt to Equity"
          value={0.65}
          previousValue={0.68}
          target={0.60}
          format="decimal"
        />
        <MetricCard
          title="Asset Turnover"
          value={0.33}
          previousValue={0.32}
          target={0.40}
          format="decimal"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          data={mockTrendData}
          title="Current Ratio Trend"
          yAxisLabel="Current Ratio"
          format="decimal"
          showBenchmark={true}
        />
        
        <HealthScoreGauge
          score={78}
          title="Financial Health Score"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ComparisonChart
          data={mockComparisonData}
          title="Key Ratios Comparison"
          companyName={selectedCompany.ticker}
          format="decimal"
        />
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border shadow-card p-4">
          <h3 className="font-semibold text-foreground mb-2">💪 Strengths</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Strong liquidity position</li>
            <li>• Above-average profitability</li>
            <li>• Stable cash flow generation</li>
          </ul>
        </div>
        
        <div className="bg-card rounded-lg border border-border shadow-card p-4">
          <h3 className="font-semibold text-foreground mb-2">⚠️ Areas for Improvement</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Asset utilization efficiency</li>
            <li>• Debt management optimization</li>
            <li>• Working capital optimization</li>
          </ul>
        </div>
        
        <div className="bg-card rounded-lg border border-border shadow-card p-4">
          <h3 className="font-semibold text-foreground mb-2">🎯 Recommendations</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Improve asset turnover ratio</li>
            <li>• Optimize capital structure</li>
            <li>• Enhance operational efficiency</li>
          </ul>
        </div>
      </div>
    </div>
  );
}