import { MetricCard } from "@/components/dashboard/MetricCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { ComparisonChart } from "@/components/charts/ComparisonChart";

interface Company {
  ticker: string;
  name: string;
  sector: string;
}

interface ActivityRatiosProps {
  selectedCompany: Company;
}

export default function ActivityRatios({ selectedCompany }: ActivityRatiosProps) {
  const trendData = [
    { period: "2023-Q1", value: 0.31, benchmark: 0.35 },
    { period: "2023-Q2", value: 0.32, benchmark: 0.35 },
    { period: "2023-Q3", value: 0.32, benchmark: 0.36 },
    { period: "2023-Q4", value: 0.33, benchmark: 0.36 },
    { period: "2024-Q1", value: 0.34, benchmark: 0.37 }
  ];

  const comparisonData = [
    { metric: "Asset Turnover", company: 0.33, industry: 0.36 },
    { metric: "Inventory Turnover", company: 8.5, industry: 7.8 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Activity Ratios</h1>
        <p className="text-muted-foreground">
          Measure {selectedCompany.name}'s efficiency in using assets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Asset Turnover"
          value={0.33}
          previousValue={0.32}
          format="decimal"
        />
        <MetricCard
          title="Inventory Turnover"
          value={8.5}
          previousValue={8.2}
          format="decimal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          data={trendData}
          title="Asset Turnover Trend"
          yAxisLabel="Asset Turnover Ratio"
          format="decimal"
          showBenchmark={true}
        />
        
        <ComparisonChart
          data={comparisonData}
          title="Activity Ratios Comparison"
          companyName={selectedCompany.ticker}
          format="decimal"
        />
      </div>
    </div>
  );
}