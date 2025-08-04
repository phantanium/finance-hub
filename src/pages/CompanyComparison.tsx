import { useState } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyComparison } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Company {
  ticker: string;
  name: string;
  sector: string;
}

const companies = [
  { ticker: "BBCA.JK", name: "Bank Central Asia Tbk", sector: "Banking" },
  { ticker: "BMRI.JK", name: "Bank Mandiri Tbk", sector: "Banking" },
  { ticker: "BBRI.JK", name: "Bank Rakyat Indonesia Tbk", sector: "Banking" },
  { ticker: "BBNI.JK", name: "Bank Negara Indonesia Tbk", sector: "Banking" },
];

interface CompanyComparisonProps {
  selectedCompany: Company;
}

export default function CompanyComparison({ selectedCompany }: CompanyComparisonProps) {
  const [compareCompany, setCompareCompany] = useState<Company>(companies[1]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['companyComparison', selectedCompany.ticker, compareCompany.ticker],
    queryFn: () => fetchCompanyComparison(selectedCompany.ticker, compareCompany.ticker),
    enabled: !!selectedCompany.ticker && !!compareCompany.ticker,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
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
          Failed to load comparison data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  const company1Data = data.comparison_data[selectedCompany.ticker];
  const company2Data = data.comparison_data[compareCompany.ticker];

  const comparisonData = [
    { 
      metric: "Current Ratio", 
      company: company1Data?.ratios.liquidity?.currentRatio || 0, 
      industry: company2Data?.ratios.liquidity?.currentRatio || 0,
    },
    { 
      metric: "ROE", 
      company: company1Data?.ratios.profitability?.roe || 0, 
      industry: company2Data?.ratios.profitability?.roe || 0,
    },
    { 
      metric: "DER", 
      company: company1Data?.ratios.leverage?.der || 0, 
      industry: company2Data?.ratios.leverage?.der || 0,
    },
    { 
      metric: "Asset Turnover", 
      company: company1Data?.ratios.activity?.assetTurnover || 0, 
      industry: company2Data?.ratios.activity?.assetTurnover || 0,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Company Comparison</h1>
          <p className="text-muted-foreground">
            Side-by-side financial analysis
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">Compare with:</div>
          <Select 
            value={compareCompany.ticker} 
            onValueChange={(value) => {
              const company = companies.find(c => c.ticker === value);
              if (company) setCompareCompany(company);
            }}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {companies
                .filter(c => c.ticker !== selectedCompany.ticker)
                .map((company) => (
                  <SelectItem key={company.ticker} value={company.ticker}>
                    {company.ticker} - {company.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Company Headers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border shadow-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">{selectedCompany.name}</h3>
          <p className="text-sm text-muted-foreground">{selectedCompany.ticker} • {selectedCompany.sector}</p>
        </div>
        <div className="bg-card rounded-lg border border-border shadow-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">{compareCompany.name}</h3>
          <p className="text-sm text-muted-foreground">{compareCompany.ticker} • {compareCompany.sector}</p>
        </div>
      </div>

      {/* Metrics Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Liquidity</h4>
          <MetricCard
            title="Current Ratio"
            value={company1Data?.ratios.liquidity?.currentRatio || 0}
            format="decimal"
            className="border-primary/20"
          />
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Profitability</h4>
          <MetricCard
            title="ROE"
            value={company1Data?.ratios.profitability?.roe || 0}
            format="percentage"
            className="border-primary/20"
          />
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Leverage</h4>
          <MetricCard
            title="DER"
            value={company1Data?.ratios.leverage?.der || 0}
            format="decimal"
            className="border-primary/20"
          />
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Activity</h4>
          <MetricCard
            title="Asset Turnover"
            value={company1Data?.ratios.activity?.assetTurnover || 0}
            format="decimal"
            className="border-primary/20"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <ComparisonChart
          data={comparisonData}
          title={`${selectedCompany.ticker} vs ${compareCompany.ticker}`}
          companyName={selectedCompany.ticker}
          format="decimal"
        />
      </div>
    </div>
  );
}