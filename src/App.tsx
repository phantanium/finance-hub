import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Footer } from "@/components/layout/Footer";
import Dashboard from "./pages/Dashboard";
import LiquidityRatios from "./pages/LiquidityRatios";
import ProfitabilityRatios from "./pages/ProfitabilityRatios";
import LeverageRatios from "./pages/LeverageRatios";
import ActivityRatios from "./pages/ActivityRatios";
import CompanyComparison from "./pages/CompanyComparison";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface Company {
  ticker: string;
  name: string;
  sector: string;
}

const App = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company>({
    ticker: "BBCA.JK",
    name: "Bank Central Asia Tbk",
    sector: "Banking"
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex flex-col w-full bg-background">
              <Header 
                selectedCompany={selectedCompany} 
                onCompanyChange={setSelectedCompany} 
              />
              
              <div className="flex flex-1 w-full">
                <AppSidebar />
                
                <main className="flex-1 p-6 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard selectedCompany={selectedCompany} />} />
                    <Route path="/liquidity" element={<LiquidityRatios selectedCompany={selectedCompany} />} />
                    <Route path="/profitability" element={<ProfitabilityRatios selectedCompany={selectedCompany} />} />
                    <Route path="/leverage" element={<LeverageRatios selectedCompany={selectedCompany} />} />
                    <Route path="/activity" element={<ActivityRatios selectedCompany={selectedCompany} />} />
                    <Route path="/comparison" element={<CompanyComparison selectedCompany={selectedCompany} />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
              
              <Footer />
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
