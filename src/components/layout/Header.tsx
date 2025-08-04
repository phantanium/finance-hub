import { Building2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";

interface Company {
  ticker: string;
  name: string;
  sector: string;
}

const companies: Company[] = [
  { ticker: "BBCA.JK", name: "Bank Central Asia Tbk", sector: "Banking" },
  { ticker: "BMRI.JK", name: "Bank Mandiri Tbk", sector: "Banking" },
  { ticker: "TLKM.JK", name: "Telkom Indonesia Tbk", sector: "Telecommunications" },
  { ticker: "UNVR.JK", name: "Unilever Indonesia Tbk", sector: "Consumer Goods" },
  { ticker: "ASII.JK", name: "Astra International Tbk", sector: "Automotive" },
  { ticker: "BBRI.JK", name: "Bank Rakyat Indonesia Tbk", sector: "Banking" },
  { ticker: "BBNI.JK", name: "Bank Negara Indonesia Tbk", sector: "Banking" },
  { ticker: "INTP.JK", name: "Indocement Tunggal Prakarsa Tbk", sector: "Cement" },
  { ticker: "SMGR.JK", name: "Semen Indonesia Tbk", sector: "Cement" },
  { ticker: "ICBP.JK", name: "Indofood CBP Sukses Makmur Tbk", sector: "Food & Beverages" }
];

interface HeaderProps {
  selectedCompany: Company;
  onCompanyChange: (company: Company) => void;
}

export function Header({ selectedCompany, onCompanyChange }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card shadow-card">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">FinDash Indonesia</h1>
              <p className="text-sm text-muted-foreground">Financial Analysis Dashboard</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="min-w-[280px] justify-between shadow-card hover:shadow-card-hover transition-smooth"
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium text-foreground">{selectedCompany.ticker}</span>
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {selectedCompany.name}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-[320px] shadow-dropdown border border-border bg-popover"
            >
              {companies.map((company) => (
                <DropdownMenuItem
                  key={company.ticker}
                  onClick={() => onCompanyChange(company)}
                  className="p-3 hover:bg-accent/50 transition-smooth cursor-pointer"
                >
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{company.ticker}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {company.sector}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{company.name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}