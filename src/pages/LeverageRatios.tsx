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

interface LeverageRatiosProps {
  selectedCompany: Company;
}

export default function LeverageRatios({ selectedCompany }: LeverageRatiosProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['leverageRatios', selectedCompany.ticker],
    queryFn: () => fetchCompanyData(selectedCompany.ticker),
    enabled: !!selectedCompany.ticker,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
          Failed to load leverage ratios data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || !data.ratios.leverage) return null;

  const comparisonData = [
    { 
      metric: "DER", 
      company: data.ratios.leverage.der, 
      industry: data.industry_average?.average_der || 0 
    },
    { 
      metric: "DAR", 
      company: data.ratios.leverage.dar, 
      industry: data.industry_average?.average_dar || 0 
    },
    { 
      metric: "Times Interest Earned", 
      company: data.ratios.leverage.timesInterestEarned, 
      industry: data.industry_average?.average_times_interest_earned || 0 
    }
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
          value={data.ratios.leverage.der}
          format="decimal"
        />
        <MetricCard
          title="Debt to Assets (DAR)"
          value={data.ratios.leverage.dar}
          format="decimal"
        />
        <MetricCard
          title="Times Interest Earned"
          value={data.ratios.leverage.timesInterestEarned}
          format="decimal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          data={data.trends}
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