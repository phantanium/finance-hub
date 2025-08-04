"""
Advanced Financial Analysis Module
Handles industry comparisons, health scores, and peer analysis
"""

import logging
from typing import Dict, List, Optional, Any
from financial_scraper import BEIDataScraper

logger = logging.getLogger(__name__)

class AnalysisEngine:
    """Advanced analysis engine for financial data processing"""
    
    def __init__(self):
        """Initialize the analysis engine"""
        self.scraper = BEIDataScraper()
        
        # Industry benchmark data (typical ranges for Indonesian companies)
        self.industry_benchmarks = {
            "Banking": {
                "roe": {"excellent": 20, "good": 15, "fair": 10},
                "roa": {"excellent": 3, "good": 2, "fair": 1},
                "nim": {"excellent": 6, "good": 5, "fair": 4},
                "ldr": {"excellent": 90, "good": 85, "fair": 80},
                "car": {"excellent": 20, "good": 18, "fair": 15}
            },
            "Telecommunications": {
                "currentRatio": {"excellent": 1.5, "good": 1.2, "fair": 1.0},
                "roe": {"excellent": 20, "good": 15, "fair": 10},
                "roa": {"excellent": 12, "good": 8, "fair": 5},
                "der": {"excellent": 0.5, "good": 0.7, "fair": 1.0},
                "assetTurnover": {"excellent": 0.8, "good": 0.6, "fair": 0.4}
            },
            "Consumer Goods": {
                "currentRatio": {"excellent": 2.0, "good": 1.5, "fair": 1.2},
                "roe": {"excellent": 25, "good": 18, "fair": 12},
                "roa": {"excellent": 15, "good": 10, "fair": 6},
                "der": {"excellent": 0.4, "good": 0.6, "fair": 0.8},
                "inventoryTurnover": {"excellent": 8, "good": 6, "fair": 4}
            },
            "Automotive": {
                "currentRatio": {"excellent": 1.8, "good": 1.4, "fair": 1.1},
                "roe": {"excellent": 18, "good": 12, "fair": 8},
                "roa": {"excellent": 10, "good": 6, "fair": 3},
                "der": {"excellent": 0.6, "good": 0.8, "fair": 1.2},
                "assetTurnover": {"excellent": 1.5, "good": 1.2, "fair": 0.8}
            },
            "default": {
                "currentRatio": {"excellent": 1.8, "good": 1.3, "fair": 1.0},
                "roe": {"excellent": 20, "good": 15, "fair": 10},
                "roa": {"excellent": 10, "good": 6, "fair": 3},
                "der": {"excellent": 0.5, "good": 0.7, "fair": 1.0},
                "assetTurnover": {"excellent": 1.2, "good": 0.8, "fair": 0.5}
            }
        }
        
        logger.info("Analysis engine initialized with industry benchmarks")
    
    def calculate_industry_average(self, sector: str) -> Dict[str, Any]:
        """Calculate industry averages for a specific sector"""
        try:
            logger.info(f"Calculating industry average for sector: {sector}")
            
            # Get all companies in the same sector
            sector_companies = []
            for ticker, info in self.scraper.companies.items():
                if info["sector"] == sector:
                    sector_companies.append(ticker)
            
            if len(sector_companies) < 2:
                logger.warning(f"Not enough companies in sector {sector} for meaningful average")
                return self._get_default_industry_average(sector)
            
            # Calculate averages from multiple companies
            total_companies = len(sector_companies)
            sector_ratios = {}
            successful_calculations = 0
            
            for ticker in sector_companies:
                try:
                    company_ratios = self.scraper.calculate_ratios(ticker)
                    if company_ratios and company_ratios.get('ratios'):
                        successful_calculations += 1
                        ratios = company_ratios['ratios']
                        
                        for ratio_name, value in ratios.items():
                            if ratio_name not in sector_ratios:
                                sector_ratios[ratio_name] = []
                            sector_ratios[ratio_name].append(value)
                
                except Exception as e:
                    logger.warning(f"Could not get ratios for {ticker}: {str(e)}")
                    continue
            
            # Calculate averages
            industry_averages = {}
            for ratio_name, values in sector_ratios.items():
                if values:
                    industry_averages[ratio_name] = sum(values) / len(values)
            
            # Ensure we have some key ratios
            if not industry_averages:
                logger.warning(f"Could not calculate averages for {sector}, using defaults")
                return self._get_default_industry_average(sector)
            
            result = {
                "sector": sector,
                "total_companies_in_sector": total_companies,
                "successful_calculations": successful_calculations,
                **industry_averages
            }
            
            logger.info(f"Successfully calculated industry averages for {sector}")
            return result
            
        except Exception as e:
            logger.error(f"Error calculating industry average for {sector}: {str(e)}")
            return self._get_default_industry_average(sector)
    
    def _get_default_industry_average(self, sector: str) -> Dict[str, Any]:
        """Return default industry averages when calculation fails"""
        defaults = {
            "Banking": {
                "sector": sector,
                "total_companies_in_sector": 4,
                "roe": 16.5,
                "roa": 2.2,
                "nim": 5.8,
                "ldr": 87.0,
                "car": 19.2
            },
            "Telecommunications": {
                "sector": sector,
                "total_companies_in_sector": 2,
                "currentRatio": 1.3,
                "roe": 16.8,
                "roa": 7.5,
                "der": 0.65,
                "assetTurnover": 0.55
            },
            "Consumer Goods": {
                "sector": sector,
                "total_companies_in_sector": 3,
                "currentRatio": 1.6,
                "roe": 22.3,
                "roa": 11.2,
                "der": 0.52,
                "inventoryTurnover": 6.8
            }
        }
        
        return defaults.get(sector, {
            "sector": sector,
            "total_companies_in_sector": 1,
            "currentRatio": 1.4,
            "roe": 15.0,
            "roa": 8.0,
            "der": 0.6,
            "assetTurnover": 0.8
        })
    
    def calculate_health_score(self, ratios_data: Dict[str, Any], sector: str) -> int:
        """Calculate financial health score (0-100) based on ratios and sector"""
        try:
            logger.info(f"Calculating health score for {sector} sector")
            
            if not ratios_data or 'ratios' not in ratios_data:
                logger.warning("No ratios data provided for health score calculation")
                return 50  # Default neutral score
            
            ratios = ratios_data['ratios']
            benchmarks = self.industry_benchmarks.get(sector, self.industry_benchmarks['default'])
            
            total_score = 0
            max_possible_score = 0
            
            # Define weights for different ratio categories
            if sector == "Banking":
                score_weights = {
                    'roe': 30,      # 30% weight
                    'roa': 25,      # 25% weight
                    'nim': 20,      # 20% weight
                    'ldr': 15,      # 15% weight
                    'car': 10       # 10% weight
                }
            else:
                score_weights = {
                    'currentRatio': 20,     # 20% weight - Liquidity
                    'roe': 25,              # 25% weight - Profitability
                    'roa': 20,              # 20% weight - Profitability
                    'der': 20,              # 20% weight - Leverage
                    'assetTurnover': 15     # 15% weight - Activity
                }
            
            # Calculate score for each available ratio
            for ratio_name, weight in score_weights.items():
                if ratio_name in ratios and ratio_name in benchmarks:
                    ratio_value = ratios[ratio_name]
                    benchmark = benchmarks[ratio_name]
                    
                    # Calculate ratio score (0-100)
                    ratio_score = self._calculate_ratio_score(
                        ratio_value, benchmark, ratio_name
                    )
                    
                    total_score += ratio_score * (weight / 100)
                    max_possible_score += weight
            
            # Calculate final health score
            if max_possible_score > 0:
                health_score = int((total_score / max_possible_score) * 100)
            else:
                health_score = 50  # Default if no ratios could be scored
            
            # Ensure score is within bounds
            health_score = max(0, min(100, health_score))
            
            logger.info(f"Calculated health score: {health_score}")
            return health_score
            
        except Exception as e:
            logger.error(f"Error calculating health score: {str(e)}")
            return 50  # Return neutral score on error
    
    def _calculate_ratio_score(self, value: float, benchmark: Dict[str, float], ratio_name: str) -> float:
        """Calculate score for individual ratio (0-100)"""
        try:
            excellent = benchmark['excellent']
            good = benchmark['good']
            fair = benchmark['fair']
            
            # For ratios where lower is better (like DER, DAR)
            if ratio_name in ['der', 'dar']:
                if value <= excellent:
                    return 100
                elif value <= good:
                    return 75
                elif value <= fair:
                    return 50
                else:
                    return 25
            
            # For ratios where higher is better (most ratios)
            else:
                if value >= excellent:
                    return 100
                elif value >= good:
                    return 75
                elif value >= fair:
                    return 50
                else:
                    return 25
                    
        except Exception as e:
            logger.error(f"Error calculating ratio score for {ratio_name}: {str(e)}")
            return 50
    
    def analyze_company_strengths_weaknesses(self, ratios_data: Dict[str, Any], sector: str) -> Dict[str, List[str]]:
        """Analyze company strengths and weaknesses based on ratios"""
        try:
            if not ratios_data or 'ratios' not in ratios_data:
                return {"strengths": [], "weaknesses": [], "recommendations": []}
            
            ratios = ratios_data['ratios']
            benchmarks = self.industry_benchmarks.get(sector, self.industry_benchmarks['default'])
            
            strengths = []
            weaknesses = []
            recommendations = []
            
            # Analyze each ratio
            for ratio_name, value in ratios.items():
                if ratio_name in benchmarks:
                    benchmark = benchmarks[ratio_name]
                    score = self._calculate_ratio_score(value, benchmark, ratio_name)
                    
                    ratio_display = self._get_ratio_display_name(ratio_name)
                    
                    if score >= 75:
                        strengths.append(f"Strong {ratio_display}")
                    elif score <= 40:
                        weaknesses.append(f"Weak {ratio_display}")
                        recommendations.append(f"Improve {ratio_display}")
            
            # Add generic recommendations if none specific
            if not recommendations:
                recommendations = [
                    "Maintain current performance levels",
                    "Monitor industry trends",
                    "Focus on operational efficiency"
                ]
            
            return {
                "strengths": strengths[:3],  # Top 3 strengths
                "weaknesses": weaknesses[:3],  # Top 3 weaknesses
                "recommendations": recommendations[:3]  # Top 3 recommendations
            }
            
        except Exception as e:
            logger.error(f"Error analyzing strengths/weaknesses: {str(e)}")
            return {"strengths": [], "weaknesses": [], "recommendations": []}
    
    def _get_ratio_display_name(self, ratio_name: str) -> str:
        """Convert ratio names to display-friendly format"""
        display_names = {
            'currentRatio': 'Current Ratio',
            'quickRatio': 'Quick Ratio',
            'cashRatio': 'Cash Ratio',
            'roe': 'Return on Equity',
            'roa': 'Return on Assets',
            'npm': 'Net Profit Margin',
            'gpm': 'Gross Profit Margin',
            'der': 'Debt to Equity Ratio',
            'dar': 'Debt to Asset Ratio',
            'assetTurnover': 'Asset Turnover',
            'inventoryTurnover': 'Inventory Turnover',
            'nim': 'Net Interest Margin',
            'ldr': 'Loan to Deposit Ratio',
            'car': 'Capital Adequacy Ratio'
        }
        
        return display_names.get(ratio_name, ratio_name.title())
    
    def compare_companies_detailed(self, ticker1: str, ticker2: str) -> Dict[str, Any]:
        """Perform detailed comparison between two companies"""
        try:
            logger.info(f"Performing detailed comparison: {ticker1} vs {ticker2}")
            
            # Get data for both companies
            company1_data = self.scraper.calculate_ratios(ticker1)
            company2_data = self.scraper.calculate_ratios(ticker2)
            
            if not company1_data or not company2_data:
                raise ValueError("Could not get data for one or both companies")
            
            # Get company info
            company1_info = self.scraper.get_company_info(ticker1)
            company2_info = self.scraper.get_company_info(ticker2)
            
            # Calculate health scores
            health1 = self.calculate_health_score(company1_data, company1_info['sector'])
            health2 = self.calculate_health_score(company2_data, company2_info['sector'])
            
            # Analyze strengths/weaknesses
            analysis1 = self.analyze_company_strengths_weaknesses(company1_data, company1_info['sector'])
            analysis2 = self.analyze_company_strengths_weaknesses(company2_data, company2_info['sector'])
            
            comparison_result = {
                "company1": {
                    "ticker": ticker1,
                    "name": company1_info['name'],
                    "sector": company1_info['sector'],
                    "ratios": company1_data['ratios'],
                    "health_score": health1,
                    "analysis": analysis1
                },
                "company2": {
                    "ticker": ticker2,
                    "name": company2_info['name'],
                    "sector": company2_info['sector'],
                    "ratios": company2_data['ratios'],
                    "health_score": health2,
                    "analysis": analysis2
                },
                "winner": ticker1 if health1 > health2 else ticker2,
                "health_score_difference": abs(health1 - health2)
            }
            
            logger.info(f"Detailed comparison completed: {ticker1} ({health1}) vs {ticker2} ({health2})")
            return comparison_result
            
        except Exception as e:
            logger.error(f"Error in detailed comparison: {str(e)}")
            raise