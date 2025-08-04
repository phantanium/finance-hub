import { MetricCard } from "@/components/dashboard/MetricCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { ComparisonChart } from "@/components/charts/ComparisonChart";

interface Company {
  ticker: string;
  name: string;
  sector: string;
}

interface LeverageRatiosProps {
  selectedCompany: Company;
}

export default function LeverageRatios({ selectedCompany }: LeverageRatiosProps) {
  const trendData = [
    { period: "2023-Q1", value: 0.68, benchmark: 0.70 },
    { period: "2023-Q2", value: 0.67, benchmark: 0.69 },
    { period: "2023-Q3", value: 0.66, benchmark: 0.68 },
    { period: "2023-Q4", value: 0.65, benchmark: 0.67 },
    { period: "2024-Q1", value: 0.64, benchmark: 0.66 }
  ];

  const comparisonData = [
    { metric: "DER", company: 0.65, industry: 0.67 },
    { metric: "DAR", company: 0.39, industry: 0.42 },
    { metric: "Times Interest Earned", company: 4.2, industry: 3.8 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leverage Ratios</h1>
        <p className="text-muted-foreground">
          Assess {selectedCompany.name}'s debt levels and financial leverage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Debt to Equity (DER)"
          value={0.65}
          previousValue={0.66}
          format="decimal"
        />
        <MetricCard
          title="Debt to Assets (DAR)"
          value={0.39}
          previousValue={0.40}
          format="decimal"
        />
        <MetricCard
          title="Times Interest Earned"
          value={4.2}
          previousValue={4.0}
          format="decimal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          data={trendData}
          title="Debt to Equity Trend"
          yAxisLabel="Debt to Equity Ratio"
          format="decimal"
          showBenchmark={true}
        />
        
        <ComparisonChart
          data={comparisonData}
          title="Leverage Ratios Comparison"
          companyName={selectedCompany.ticker}
          format="decimal"
        />
      </div>
    </div>
  );
}