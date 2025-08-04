import { MetricCard } from "@/components/dashboard/MetricCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import { HealthScoreGauge } from "@/components/charts/HealthScoreGauge";
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

interface DashboardProps {
  selectedCompany: Company;
}

export default function Dashboard({ selectedCompany }: DashboardProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['companyData', selectedCompany.ticker],
    queryFn: () => fetchCompanyData(selectedCompany.ticker),
    enabled: !!selectedCompany.ticker,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
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
          Failed to load company data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  const comparisonData = [
    { 
      metric: "Current Ratio", 
      company: data.ratios.liquidity?.currentRatio || 0, 
      industry: data.industry_average?.average_current_ratio || 0 
    },
    { 
      metric: "ROE", 
      company: data.ratios.profitability?.roe || 0, 
      industry: data.industry_average?.average_roe || 0 
    },
    { 
      metric: "DER", 
      company: data.ratios.leverage?.der || 0, 
      industry: data.industry_average?.average_der || 0 
    },
    { 
      metric: "Asset Turnover", 
      company: data.ratios.activity?.assetTurnover || 0, 
      industry: data.industry_average?.average_asset_turnover || 0 
    }
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
          value={data.ratios.liquidity?.currentRatio || 0}
          format="decimal"
        />
        <MetricCard
          title="Return on Equity"
          value={data.ratios.profitability?.roe || 0}
          format="percentage"
        />
        <MetricCard
          title="Debt to Equity"
          value={data.ratios.leverage?.der || 0}
          format="decimal"
        />
        <MetricCard
          title="Asset Turnover"
          value={data.ratios.activity?.assetTurnover || 0}
          format="decimal"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          data={data.trends}
          title="Current Ratio Trend"
          yAxisLabel="Current Ratio"
          format="decimal"
          showBenchmark={true}
        />
        
        <HealthScoreGauge
          score={data.health_score || 0}
          title="Financial Health Score"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ComparisonChart
          data={comparisonData}
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