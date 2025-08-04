const API_BASE_URL = 'http://localhost:5000/api';

export interface CompanyData {
  ticker: string;
  name: string;
  sector: string;
  latest_period: string;
  ratios: {
    liquidity?: {
      currentRatio: number;
      quickRatio: number;
      cashRatio: number;
    };
    profitability?: {
      roe: number;
      roa: number;
      npm: number;
      gpm: number;
    };
    leverage?: {
      der: number;
      dar: number;
      timesInterestEarned: number;
    };
    activity?: {
      assetTurnover: number;
      inventoryTurnover: number;
    };
  };
  trends: Array<{
    period: string;
    value: number;
    benchmark?: number;
  }>;
  industry_average?: {
    sector: string;
    total_companies_in_sector: number;
    [key: string]: any;
  };
  health_score?: number;
}

export interface ComparisonData {
  comparison_data: {
    [ticker: string]: CompanyData;
  };
}

export const fetchCompanyData = async (ticker: string): Promise<CompanyData> => {
  const response = await fetch(`${API_BASE_URL}/company/${ticker}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch company data: ${response.statusText}`);
  }
  return response.json();
};

export const fetchCompanyComparison = async (ticker1: string, ticker2: string): Promise<ComparisonData> => {
  const response = await fetch(`${API_BASE_URL}/compare?ticker1=${ticker1}&ticker2=${ticker2}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch comparison data: ${response.statusText}`);
  }
  return response.json();
};

export const fetchCompanies = async () => {
  const response = await fetch(`${API_BASE_URL}/companies`);
  if (!response.ok) {
    throw new Error(`Failed to fetch companies: ${response.statusText}`);
  }
  return response.json();
};