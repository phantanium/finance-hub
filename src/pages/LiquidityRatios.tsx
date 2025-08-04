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

interface LiquidityRatiosProps {
  selectedCompany: Company;
}

export default function LiquidityRatios({ selectedCompany }: LiquidityRatiosProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['liquidityRatios', selectedCompany.ticker],
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
          Failed to load liquidity ratios data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || !data.ratios.liquidity) return null;

  const comparisonData = [
    { 
      metric: "Current Ratio", 
      company: data.ratios.liquidity.currentRatio, 
      industry: data.industry_average?.average_current_ratio || 0 
    },
    { 
      metric: "Quick Ratio", 
      company: data.ratios.liquidity.quickRatio, 
      industry: data.industry_average?.average_quick_ratio || 0 
    },
    { 
      metric: "Cash Ratio", 
      company: data.ratios.liquidity.cashRatio, 
      industry: data.industry_average?.average_cash_ratio || 0 
    }
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
          value={data.ratios.liquidity.currentRatio}
          format="decimal"
        />
        <MetricCard
          title="Quick Ratio"
          value={data.ratios.liquidity.quickRatio}
          format="decimal"
        />
        <MetricCard
          title="Cash Ratio"
          value={data.ratios.liquidity.cashRatio}
          format="decimal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          data={data.trends}
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