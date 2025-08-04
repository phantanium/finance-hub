"""
FinDash Indonesia Backend API
A Flask-based API for Indonesian public company financial analysis
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
from datetime import datetime, timedelta
import json
from financial_scraper import BEIDataScraper
from analysis_module import AnalysisEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize data scraper and analysis engine
scraper = BEIDataScraper()
analyzer = AnalysisEngine()

# Simple in-memory cache (1 hour expiration)
cache = {}
CACHE_EXPIRY = 3600  # 1 hour in seconds

def is_cache_valid(timestamp):
    """Check if cached data is still valid (within 1 hour)"""
    return datetime.now().timestamp() - timestamp < CACHE_EXPIRY

def get_from_cache(key):
    """Get data from cache if valid"""
    if key in cache:
        data, timestamp = cache[key]
        if is_cache_valid(timestamp):
            return data
    return None

def set_cache(key, data):
    """Store data in cache with timestamp"""
    cache[key] = (data, datetime.now().timestamp())

@app.route('/')
def health_check():
    """API health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "FinDash Indonesia API is running",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

@app.route('/api/companies')
def get_companies():
    """Get list of all available Indonesian public companies"""
    try:
        logger.info("Fetching companies list")
        
        # Check cache first
        cached_data = get_from_cache('companies_list')
        if cached_data:
            logger.info("Returning cached companies list")
            return jsonify(cached_data)
        
        companies = scraper.get_companies_list()
        
        # Cache the result
        set_cache('companies_list', companies)
        
        logger.info(f"Successfully fetched {len(companies)} companies")
        return jsonify(companies)
        
    except Exception as e:
        logger.error(f"Error fetching companies: {str(e)}")
        return jsonify({
            "error": "Failed to fetch companies list",
            "message": str(e)
        }), 500

@app.route('/api/company/<ticker>')
def get_company_data(ticker):
    """Get comprehensive financial data for a specific company"""
    try:
        logger.info(f"Fetching data for company: {ticker}")
        
        # Validate ticker format
        if not ticker or not ticker.endswith('.JK'):
            return jsonify({
                "error": "Invalid ticker format",
                "message": "Ticker must end with .JK"
            }), 400
        
        # Check cache first
        cache_key = f"company_data_{ticker}"
        cached_data = get_from_cache(cache_key)
        if cached_data:
            logger.info(f"Returning cached data for {ticker}")
            return jsonify(cached_data)
        
        # Get company basic info
        company_info = scraper.get_company_info(ticker)
        if not company_info:
            return jsonify({
                "error": "Company not found",
                "message": f"No data available for ticker {ticker}"
            }), 404
        
        # Get financial ratios
        ratios = scraper.calculate_ratios(ticker)
        if not ratios:
            return jsonify({
                "error": "Financial data unavailable",
                "message": f"Could not calculate ratios for {ticker}"
            }), 404
        
        # Get trend data (last 4 periods)
        trends = scraper.get_trend_data(ticker)
        
        # Get industry averages
        industry_avg = analyzer.calculate_industry_average(company_info['sector'])
        
        # Calculate health score
        health_score = analyzer.calculate_health_score(ratios, company_info['sector'])
        
        # Prepare response
        response_data = {
            "ticker": ticker,
            "name": company_info['name'],
            "sector": company_info['sector'],
            "latest_period": ratios.get('period', '2024-Q1'),
            "ratios": ratios['ratios'],
            "trends": trends,
            "industry_average": industry_avg,
            "health_score": health_score,
            "last_updated": datetime.now().isoformat()
        }
        
        # Cache the result
        set_cache(cache_key, response_data)
        
        logger.info(f"Successfully fetched data for {ticker}")
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error fetching data for {ticker}: {str(e)}")
        return jsonify({
            "error": "Failed to fetch company data",
            "message": str(e),
            "ticker": ticker
        }), 500

@app.route('/api/compare')
def compare_companies():
    """Compare financial data between two companies"""
    try:
        ticker1 = request.args.get('ticker1')
        ticker2 = request.args.get('ticker2')
        
        if not ticker1 or not ticker2:
            return jsonify({
                "error": "Missing parameters",
                "message": "Both ticker1 and ticker2 are required"
            }), 400
        
        if ticker1 == ticker2:
            return jsonify({
                "error": "Invalid comparison",
                "message": "Cannot compare company with itself"
            }), 400
        
        logger.info(f"Comparing companies: {ticker1} vs {ticker2}")
        
        # Check cache first
        cache_key = f"comparison_{min(ticker1, ticker2)}_{max(ticker1, ticker2)}"
        cached_data = get_from_cache(cache_key)
        if cached_data:
            logger.info(f"Returning cached comparison for {ticker1} vs {ticker2}")
            return jsonify(cached_data)
        
        # Get data for both companies
        company1_info = scraper.get_company_info(ticker1)
        company2_info = scraper.get_company_info(ticker2)
        
        if not company1_info or not company2_info:
            return jsonify({
                "error": "Company not found",
                "message": "One or both companies not found"
            }), 404
        
        # Get ratios for both companies
        ratios1 = scraper.calculate_ratios(ticker1)
        ratios2 = scraper.calculate_ratios(ticker2)
        
        if not ratios1 or not ratios2:
            return jsonify({
                "error": "Financial data unavailable",
                "message": "Could not get ratios for one or both companies"
            }), 404
        
        # Calculate health scores
        health_score1 = analyzer.calculate_health_score(ratios1, company1_info['sector'])
        health_score2 = analyzer.calculate_health_score(ratios2, company2_info['sector'])
        
        # Prepare comparison response
        response_data = {
            "comparison_data": {
                ticker1: {
                    "name": company1_info['name'],
                    "sector": company1_info['sector'],
                    "ratios": ratios1['ratios'],
                    "health_score": health_score1
                },
                ticker2: {
                    "name": company2_info['name'],
                    "sector": company2_info['sector'],
                    "ratios": ratios2['ratios'],
                    "health_score": health_score2
                }
            },
            "last_updated": datetime.now().isoformat()
        }
        
        # Cache the result
        set_cache(cache_key, response_data)
        
        logger.info(f"Successfully compared {ticker1} vs {ticker2}")
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error comparing companies: {str(e)}")
        return jsonify({
            "error": "Failed to compare companies",
            "message": str(e)
        }), 500

@app.route('/api/sectors')
def get_sectors():
    """Get list of all sectors and their companies"""
    try:
        logger.info("Fetching sectors data")
        
        # Check cache first
        cached_data = get_from_cache('sectors_data')
        if cached_data:
            logger.info("Returning cached sectors data")
            return jsonify(cached_data)
        
        sectors = scraper.get_sectors_summary()
        
        # Cache the result
        set_cache('sectors_data', sectors)
        
        logger.info(f"Successfully fetched data for {len(sectors)} sectors")
        return jsonify(sectors)
        
    except Exception as e:
        logger.error(f"Error fetching sectors: {str(e)}")
        return jsonify({
            "error": "Failed to fetch sectors data",
            "message": str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        "error": "Endpoint not found",
        "message": "The requested API endpoint does not exist"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        "error": "Internal server error",
        "message": "An unexpected error occurred"
    }), 500

if __name__ == '__main__':
    logger.info("Starting FinDash Indonesia API server...")
    app.run(debug=True, host='0.0.0.0', port=5000)