import { MetricCard } from "@/components/dashboard/MetricCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { ComparisonChart } from "@/components/charts/ComparisonChart";

interface Company {
  ticker: string;
  name: string;
  sector: string;
}

interface ProfitabilityRatiosProps {
  selectedCompany: Company;
}

export default function ProfitabilityRatios({ selectedCompany }: ProfitabilityRatiosProps) {
  const trendData = [
    { period: "2023-Q1", value: 14.5, benchmark: 12.8 },
    { period: "2023-Q2", value: 14.8, benchmark: 13.1 },
    { period: "2023-Q3", value: 15.0, benchmark: 13.3 },
    { period: "2023-Q4", value: 15.2, benchmark: 13.5 },
    { period: "2024-Q1", value: 15.5, benchmark: 13.8 }
  ];

  const comparisonData = [
    { metric: "ROE", company: 15.2, industry: 13.5 },
    { metric: "ROA", company: 2.8, industry: 2.5 },
    { metric: "NPM", company: 8.5, industry: 7.8 },
    { metric: "GPM", company: 12.3, industry: 11.5 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profitability Ratios</h1>
        <p className="text-muted-foreground">
          Evaluate {selectedCompany.name}'s ability to generate profits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Return on Equity (ROE)"
          value={15.2}
          previousValue={15.0}
          format="percentage"
        />
        <MetricCard
          title="Return on Assets (ROA)"
          value={2.8}
          previousValue={2.7}
          format="percentage"
        />
        <MetricCard
          title="Net Profit Margin (NPM)"
          value={8.5}
          previousValue={8.3}
          format="percentage"
        />
        <MetricCard
          title="Gross Profit Margin (GPM)"
          value={12.3}
          previousValue={12.1}
          format="percentage"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          data={trendData}
          title="ROE Trend"
          yAxisLabel="Return on Equity (%)"
          format="percentage"
          showBenchmark={true}
        />
        
        <ComparisonChart
          data={comparisonData}
          title="Profitability Ratios Comparison"
          companyName={selectedCompany.ticker}
          format="percentage"
        />
      </div>
    </div>
  );
}