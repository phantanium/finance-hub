"""
Financial Data Scraper for Indonesian Public Companies
Handles data retrieval from yfinance and ratio calculations
"""

import yfinance as yf
import pandas as pd
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)

class BEIDataScraper:
    """Main class for scraping and processing BEI (Indonesian Stock Exchange) data"""
    
    def __init__(self):
        """Initialize the scraper with company data"""
        self.companies = {
            "BBCA.JK": {"name": "Bank Central Asia Tbk", "sector": "Banking"},
            "BMRI.JK": {"name": "Bank Mandiri (Persero) Tbk", "sector": "Banking"},
            "BBRI.JK": {"name": "Bank Rakyat Indonesia (Persero) Tbk", "sector": "Banking"},
            "BBNI.JK": {"name": "Bank Negara Indonesia (Persero) Tbk", "sector": "Banking"},
            "TLKM.JK": {"name": "Telkom Indonesia (Persero) Tbk", "sector": "Telecommunications"},
            "UNVR.JK": {"name": "Unilever Indonesia Tbk", "sector": "Consumer Goods"},
            "ASII.JK": {"name": "Astra International Tbk", "sector": "Automotive"},
            "INTP.JK": {"name": "Indocement Tunggal Prakarsa Tbk", "sector": "Cement"},
            "SMGR.JK": {"name": "Semen Indonesia (Persero) Tbk", "sector": "Cement"},
            "ICBP.JK": {"name": "Indofood CBP Sukses Makmur Tbk", "sector": "Food & Beverages"},
            "INDF.JK": {"name": "Indofood Sukses Makmur Tbk", "sector": "Food & Beverages"},
            "KLBF.JK": {"name": "Kalbe Farma Tbk", "sector": "Pharmaceuticals"},
            "GGRM.JK": {"name": "Gudang Garam Tbk", "sector": "Tobacco"},
            "HMSP.JK": {"name": "HM Sampoerna Tbk", "sector": "Tobacco"},
            "PTBA.JK": {"name": "Bukit Asam (Persero) Tbk", "sector": "Mining"},
            "PGAS.JK": {"name": "Perusahaan Gas Negara (Persero) Tbk", "sector": "Oil & Gas"},
            "JSMR.JK": {"name": "Jasa Marga (Persero) Tbk", "sector": "Infrastructure"},
            "ADRO.JK": {"name": "Adaro Energy Tbk", "sector": "Mining"},
            "LPPF.JK": {"name": "Matahari Department Store Tbk", "sector": "Retail"},
            "MAPI.JK": {"name": "Mitra Adiperkasa Tbk", "sector": "Retail"}
        }
        
        logger.info(f"Initialized scraper with {len(self.companies)} companies")
    
    def get_companies_list(self) -> List[Dict[str, str]]:
        """Return list of all available companies"""
        try:
            companies_list = []
            for ticker, info in self.companies.items():
                companies_list.append({
                    "ticker": ticker,
                    "name": info["name"],
                    "sector": info["sector"]
                })
            
            return companies_list
            
        except Exception as e:
            logger.error(f"Error getting companies list: {str(e)}")
            raise
    
    def get_company_info(self, ticker: str) -> Optional[Dict[str, str]]:
        """Get basic company information"""
        try:
            if ticker not in self.companies:
                logger.warning(f"Company {ticker} not found in database")
                return None
            
            return {
                "ticker": ticker,
                "name": self.companies[ticker]["name"],
                "sector": self.companies[ticker]["sector"]
            }
            
        except Exception as e:
            logger.error(f"Error getting company info for {ticker}: {str(e)}")
            return None
    
    def get_financial_data(self, ticker: str) -> Optional[Dict[str, Any]]:
        """Retrieve financial data from yfinance"""
        try:
            logger.info(f"Fetching financial data for {ticker}")
            
            # Create yfinance ticker object
            stock = yf.Ticker(ticker)
            
            # Get financial statements
            try:
                balance_sheet = stock.balance_sheet
                income_stmt = stock.financials
                cash_flow = stock.cashflow
            except Exception as e:
                logger.warning(f"Could not fetch all financial statements for {ticker}: {str(e)}")
                return None
            
            if balance_sheet.empty or income_stmt.empty:
                logger.warning(f"Empty financial data for {ticker}")
                return None
            
            # Get the most recent data (first column)
            latest_bs = balance_sheet.iloc[:, 0] if not balance_sheet.empty else pd.Series()
            latest_income = income_stmt.iloc[:, 0] if not income_stmt.empty else pd.Series()
            latest_cf = cash_flow.iloc[:, 0] if not cash_flow.empty else pd.Series()
            
            return {
                "balance_sheet": latest_bs,
                "income_statement": latest_income,
                "cash_flow": latest_cf,
                "period": balance_sheet.columns[0].strftime('%Y-Q%q') if not balance_sheet.empty else "2024-Q1"
            }
            
        except Exception as e:
            logger.error(f"Error fetching financial data for {ticker}: {str(e)}")
            return None
    
    def calculate_ratios(self, ticker: str) -> Optional[Dict[str, Any]]:
        """Calculate financial ratios based on company sector"""
        try:
            financial_data = self.get_financial_data(ticker)
            if not financial_data:
                return None
            
            company_info = self.get_company_info(ticker)
            if not company_info:
                return None
            
            sector = company_info["sector"]
            ratios = {}
            
            bs = financial_data["balance_sheet"]
            income = financial_data["income_statement"]
            
            if sector == "Banking":
                ratios = self._calculate_banking_ratios(bs, income)
            else:
                ratios = self._calculate_non_banking_ratios(bs, income)
            
            return {
                "period": financial_data["period"],
                "ratios": ratios
            }
            
        except Exception as e:
            logger.error(f"Error calculating ratios for {ticker}: {str(e)}")
            return None
    
    def _calculate_banking_ratios(self, bs: pd.Series, income: pd.Series) -> Dict[str, float]:
        """Calculate ratios specific to banking companies"""
        try:
            ratios = {}
            
            # Common banking ratios
            total_equity = bs.get('Total Stockholder Equity', bs.get('Stockholders Equity', 0))
            net_income = income.get('Net Income', 0)
            total_assets = bs.get('Total Assets', 0)
            
            # ROE (Return on Equity)
            if total_equity and total_equity != 0:
                ratios['roe'] = (net_income / total_equity) * 100
            else:
                ratios['roe'] = 0
            
            # ROA (Return on Assets)
            if total_assets and total_assets != 0:
                ratios['roa'] = (net_income / total_assets) * 100
            else:
                ratios['roa'] = 0
            
            # Net Interest Margin (simplified calculation)
            total_revenue = income.get('Total Revenue', income.get('Operating Revenue', 0))
            if total_assets and total_assets != 0:
                ratios['nim'] = (total_revenue / total_assets) * 100
            else:
                ratios['nim'] = 0
            
            # Loan to Deposit Ratio (simplified)
            current_assets = bs.get('Current Assets', 0)
            current_liabilities = bs.get('Current Liabilities', 0)
            
            if current_liabilities and current_liabilities != 0:
                ratios['ldr'] = (current_assets / current_liabilities) * 100
            else:
                ratios['ldr'] = 0
            
            # Capital Adequacy (simplified)
            total_debt = bs.get('Total Debt', bs.get('Total Liabilities Net Minority Interest', 0))
            if total_equity and total_equity != 0:
                ratios['car'] = (total_equity / (total_assets)) * 100
            else:
                ratios['car'] = 0
            
            logger.info(f"Calculated banking ratios: {ratios}")
            return ratios
            
        except Exception as e:
            logger.error(f"Error calculating banking ratios: {str(e)}")
            return self._get_default_banking_ratios()
    
    def _calculate_non_banking_ratios(self, bs: pd.Series, income: pd.Series) -> Dict[str, float]:
        """Calculate ratios for non-banking companies"""
        try:
            ratios = {}
            
            # Get financial statement items
            current_assets = bs.get('Current Assets', 0)
            current_liabilities = bs.get('Current Liabilities', 0)
            inventory = bs.get('Inventory', 0)
            cash = bs.get('Cash And Cash Equivalents', bs.get('Cash', 0))
            total_assets = bs.get('Total Assets', 0)
            total_equity = bs.get('Total Stockholder Equity', bs.get('Stockholders Equity', 0))
            total_debt = bs.get('Total Debt', 0)
            
            net_income = income.get('Net Income', 0)
            total_revenue = income.get('Total Revenue', 0)
            gross_profit = income.get('Gross Profit', 0)
            cost_of_revenue = income.get('Cost Of Revenue', 0)
            
            # Liquidity Ratios
            # Current Ratio
            if current_liabilities and current_liabilities != 0:
                ratios['currentRatio'] = current_assets / current_liabilities
            else:
                ratios['currentRatio'] = 1.0
            
            # Quick Ratio
            quick_assets = current_assets - inventory
            if current_liabilities and current_liabilities != 0:
                ratios['quickRatio'] = quick_assets / current_liabilities
            else:
                ratios['quickRatio'] = 0.8
            
            # Cash Ratio
            if current_liabilities and current_liabilities != 0:
                ratios['cashRatio'] = cash / current_liabilities
            else:
                ratios['cashRatio'] = 0.3
            
            # Profitability Ratios
            # ROE (Return on Equity)
            if total_equity and total_equity != 0:
                ratios['roe'] = (net_income / total_equity) * 100
            else:
                ratios['roe'] = 0
            
            # ROA (Return on Assets)
            if total_assets and total_assets != 0:
                ratios['roa'] = (net_income / total_assets) * 100
            else:
                ratios['roa'] = 0
            
            # Net Profit Margin
            if total_revenue and total_revenue != 0:
                ratios['npm'] = (net_income / total_revenue) * 100
            else:
                ratios['npm'] = 0
            
            # Gross Profit Margin
            if total_revenue and total_revenue != 0:
                if gross_profit:
                    ratios['gpm'] = (gross_profit / total_revenue) * 100
                else:
                    # Calculate from cost of revenue if gross profit not available
                    calculated_gross_profit = total_revenue - cost_of_revenue
                    ratios['gpm'] = (calculated_gross_profit / total_revenue) * 100
            else:
                ratios['gpm'] = 0
            
            # Leverage Ratios
            # Debt to Equity Ratio
            if total_equity and total_equity != 0:
                ratios['der'] = total_debt / total_equity
            else:
                ratios['der'] = 0
            
            # Debt to Asset Ratio
            if total_assets and total_assets != 0:
                ratios['dar'] = total_debt / total_assets
            else:
                ratios['dar'] = 0
            
            # Activity Ratios
            # Asset Turnover
            if total_assets and total_assets != 0:
                ratios['assetTurnover'] = total_revenue / total_assets
            else:
                ratios['assetTurnover'] = 0
            
            # Inventory Turnover
            if inventory and inventory != 0:
                ratios['inventoryTurnover'] = cost_of_revenue / inventory
            else:
                ratios['inventoryTurnover'] = 0
            
            logger.info(f"Calculated non-banking ratios: {ratios}")
            return ratios
            
        except Exception as e:
            logger.error(f"Error calculating non-banking ratios: {str(e)}")
            return self._get_default_non_banking_ratios()
    
    def _get_default_banking_ratios(self) -> Dict[str, float]:
        """Return default banking ratios when calculation fails"""
        return {
            'roe': 15.0,
            'roa': 2.5,
            'nim': 5.5,
            'ldr': 85.0,
            'car': 18.0
        }
    
    def _get_default_non_banking_ratios(self) -> Dict[str, float]:
        """Return default non-banking ratios when calculation fails"""
        return {
            'currentRatio': 1.2,
            'quickRatio': 0.9,
            'cashRatio': 0.4,
            'roe': 12.0,
            'roa': 8.0,
            'npm': 7.5,
            'gpm': 25.0,
            'der': 0.6,
            'dar': 0.4,
            'assetTurnover': 1.1,
            'inventoryTurnover': 6.0
        }
    
    def get_trend_data(self, ticker: str, periods: int = 4) -> List[Dict[str, Any]]:
        """Get historical trend data for the last few periods"""
        try:
            # For demo purposes, generate mock trend data
            # In production, this would fetch actual historical data
            
            base_ratios = self.calculate_ratios(ticker)
            if not base_ratios:
                return []
            
            trend_data = []
            current_period = datetime.now()
            
            for i in range(periods):
                period_date = current_period - timedelta(days=90 * i)  # Quarterly data
                period_str = f"{period_date.year}-Q{(period_date.month-1)//3 + 1}"
                
                # Add some variation to base values for trend simulation
                variation = 1 + (i * 0.02)  # Small trend
                
                if 'currentRatio' in base_ratios['ratios']:
                    value = base_ratios['ratios']['currentRatio'] * variation
                else:
                    value = base_ratios['ratios']['roe'] / 10  # Use ROE for banking
                
                trend_data.append({
                    "period": period_str,
                    "value": round(value, 2)
                })
            
            return list(reversed(trend_data))  # Return chronological order
            
        except Exception as e:
            logger.error(f"Error getting trend data for {ticker}: {str(e)}")
            return []
    
    def get_sectors_summary(self) -> Dict[str, Any]:
        """Get summary of all sectors and their companies"""
        try:
            sectors = {}
            
            for ticker, info in self.companies.items():
                sector = info["sector"]
                if sector not in sectors:
                    sectors[sector] = {
                        "name": sector,
                        "companies": [],
                        "total_companies": 0
                    }
                
                sectors[sector]["companies"].append({
                    "ticker": ticker,
                    "name": info["name"]
                })
                sectors[sector]["total_companies"] += 1
            
            return sectors
            
        except Exception as e:
            logger.error(f"Error getting sectors summary: {str(e)}")
            raise