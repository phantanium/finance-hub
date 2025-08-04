import { MetricCard } from "@/components/dashboard/MetricCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyData } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Company {
  ticker: string;
  name: string;
  sector: string;
}

interface ProfitabilityRatiosProps {
  selectedCompany: Company;
}

export default function ProfitabilityRatios({ selectedCompany }: ProfitabilityRatiosProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['profitabilityRatios', selectedCompany.ticker],
    queryFn: () => fetchCompanyData(selectedCompany.ticker),
    enabled: !!selectedCompany.ticker,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load profitability ratios data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || !data.ratios.profitability) return null;

  const comparisonData = [
    { 
      metric: "ROE", 
      company: data.ratios.profitability.roe, 
      industry: data.industry_average?.average_roe || 0 
    },
    { 
      metric: "ROA", 
      company: data.ratios.profitability.roa, 
      industry: data.industry_average?.average_roa || 0 
    },
    { 
      metric: "NPM", 
      company: data.ratios.profitability.npm, 
      industry: data.industry_average?.average_npm || 0 
    },
    { 
      metric: "GPM", 
      company: data.ratios.profitability.gpm, 
      industry: data.industry_average?.average_gpm || 0 
    }
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
          value={data.ratios.profitability.roe}
          format="percentage"
        />
        <MetricCard
          title="Return on Assets (ROA)"
          value={data.ratios.profitability.roa}
          format="percentage"
        />
        <MetricCard
          title="Net Profit Margin (NPM)"
          value={data.ratios.profitability.npm}
          format="percentage"
        />
        <MetricCard
          title="Gross Profit Margin (GPM)"
          value={data.ratios.profitability.gpm}
          format="percentage"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          data={data.trends}
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