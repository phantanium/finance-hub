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

interface ActivityRatiosProps {
  selectedCompany: Company;
}

export default function ActivityRatios({ selectedCompany }: ActivityRatiosProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['activityRatios', selectedCompany.ticker],
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
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
          Failed to load activity ratios data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || !data.ratios.activity) return null;

  const comparisonData = [
    { 
      metric: "Asset Turnover", 
      company: data.ratios.activity.assetTurnover, 
      industry: data.industry_average?.average_asset_turnover || 0 
    },
    { 
      metric: "Inventory Turnover", 
      company: data.ratios.activity.inventoryTurnover, 
      industry: data.industry_average?.average_inventory_turnover || 0 
    }
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
          value={data.ratios.activity.assetTurnover}
          format="decimal"
        />
        <MetricCard
          title="Inventory Turnover"
          value={data.ratios.activity.inventoryTurnover}
          format="decimal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          data={data.trends}
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