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

  const comparisonData = [
    { 
      metric: "Current Ratio", 
      company: 1.25, 
      industry: 1.35,
      target: 1.30 
    },
    { 
      metric: "ROE", 
      company: 15.2, 
      industry: 17.8,
      target: 16.0 
    },
    { 
      metric: "DER", 
      company: 0.65, 
      industry: 0.58,
      target: 0.60 
    },
    { 
      metric: "Asset Turnover", 
      company: 0.33, 
      industry: 0.28,
      target: 0.40 
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
            value={1.25}
            format="decimal"
            className="border-primary/20"
          />
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Profitability</h4>
          <MetricCard
            title="ROE"
            value={15.2}
            format="percentage"
            className="border-primary/20"
          />
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Leverage</h4>
          <MetricCard
            title="DER"
            value={0.65}
            format="decimal"
            className="border-primary/20"
          />
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Activity</h4>
          <MetricCard
            title="Asset Turnover"
            value={0.33}
            format="decimal"
            className="border-primary/20"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <ComparisonChart
          data={comparisonData.map(item => ({
            ...item,
            industry: item.industry // This would be the compare company's data
          }))}
          title={`${selectedCompany.ticker} vs ${compareCompany.ticker}`}
          companyName={selectedCompany.ticker}
          format="decimal"
        />
      </div>
    </div>
  );
}