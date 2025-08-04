import { MetricCard } from "@/components/dashboard/MetricCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { ComparisonChart } from "@/components/charts/ComparisonChart";

interface Company {
  ticker: string;
  name: string;
  sector: string;
}

interface LiquidityRatiosProps {
  selectedCompany: Company;
}

export default function LiquidityRatios({ selectedCompany }: LiquidityRatiosProps) {
  const trendData = [
    { period: "2023-Q1", value: 1.20, benchmark: 1.15 },
    { period: "2023-Q2", value: 1.23, benchmark: 1.18 },
    { period: "2023-Q3", value: 1.24, benchmark: 1.20 },
    { period: "2023-Q4", value: 1.25, benchmark: 1.22 },
    { period: "2024-Q1", value: 1.28, benchmark: 1.25 }
  ];

  const comparisonData = [
    { metric: "Current Ratio", company: 1.25, industry: 1.22 },
    { metric: "Quick Ratio", company: 0.98, industry: 0.95 },
    { metric: "Cash Ratio", company: 0.45, industry: 0.42 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Liquidity Ratios</h1>
        <p className="text-muted-foreground">
          Analyze {selectedCompany.name}'s ability to meet short-term obligations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Current Ratio"
          value={1.25}
          previousValue={1.24}
          format="decimal"
        />
        <MetricCard
          title="Quick Ratio"
          value={0.98}
          previousValue={0.95}
          format="decimal"
        />
        <MetricCard
          title="Cash Ratio"
          value={0.45}
          previousValue={0.43}
          format="decimal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          data={trendData}
          title="Current Ratio Trend"
          yAxisLabel="Current Ratio"
          format="decimal"
          showBenchmark={true}
        />
        
        <ComparisonChart
          data={comparisonData}
          title="Liquidity Ratios Comparison"
          companyName={selectedCompany.ticker}
          format="decimal"
        />
      </div>
    </div>
  );
}