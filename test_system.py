#!/usr/bin/env python3
"""
Test script for MARA Hackathon Optimization System
Verifies all components are working correctly.
"""

import sys
import logging
from api_client import MaraAPIClient
from optimizer import ProfitOptimizer
from config import API_BASE_URL

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_api_connection():
    """Test API connectivity."""
    print("🔌 Testing API Connection...")
    
    try:
        client = MaraAPIClient()
        
        # Test prices endpoint
        prices = client.get_prices()
        print(f"✓ Prices endpoint: {len(prices)} price records")
        
        # Test inventory endpoint
        inventory = client.get_inventory()
        print(f"✓ Inventory endpoint: {len(inventory)} categories")
        
        return True
        
    except Exception as e:
        print(f"✗ API connection failed: {e}")
        return False

def test_optimizer():
    """Test optimization engine."""
    print("\n🧮 Testing Optimization Engine...")
    
    try:
        optimizer = ProfitOptimizer()
        
        # Test with sample data
        sample_prices = [{
            'energy_price': 0.65,
            'hash_price': 8.5,
            'token_price': 3.0,
            'timestamp': '2025-06-21T13:00:00'
        }]
        
        sample_inventory = {
            'miners': {
                'air': {'hashrate': 1000, 'power': 3500},
                'hydro': {'hashrate': 5000, 'power': 5000},
                'immersion': {'hashrate': 10000, 'power': 10000}
            },
            'inference': {
                'asic': {'tokens': 50000, 'power': 15000},
                'gpu': {'tokens': 1000, 'power': 5000}
            }
        }
        
        result = optimizer.optimize_allocation(
            max_power=1000000,
            prices=sample_prices,
            inventory=sample_inventory
        )
        
        if result.constraints_satisfied:
            print(f"✓ Optimization successful")
            print(f"  - Expected profit: ${result.expected_profit:,.2f}")
            print(f"  - Power used: {result.total_power_used:,} W")
            print(f"  - ROI: {result.roi:.2%}")
        else:
            print(f"✗ Optimization failed: {result.optimization_status}")
            return False
            
        return True
        
    except Exception as e:
        print(f"✗ Optimizer test failed: {e}")
        return False

def test_site_creation():
    """Test site creation (optional)."""
    print("\n🏗️  Testing Site Creation...")
    
    try:
        client = MaraAPIClient()
        site_name = f"TestSite_{int(time.time())}"
        
        result = client.create_site(site_name)
        
        if 'api_key' in result:
            print(f"✓ Site created: {site_name}")
            print(f"  - API Key: {result['api_key'][:8]}...")
            print(f"  - Power: {result['power']:,} W")
            return True
        else:
            print("✗ Site creation failed")
            return False
            
    except Exception as e:
        print(f"✗ Site creation test failed: {e}")
        return False

def main():
    """Run all tests."""
    print("🧪 MARA Hackathon Optimization System - Test Suite")
    print("=" * 60)
    
    tests = [
        ("API Connection", test_api_connection),
        ("Optimization Engine", test_optimizer),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name}: PASSED")
            else:
                print(f"❌ {test_name}: FAILED")
        except Exception as e:
            print(f"❌ {test_name}: ERROR - {e}")
    
    print("\n" + "=" * 60)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! System is ready to use.")
        print("\nNext steps:")
        print("1. Run: python main.py --site-name 'YourSiteName'")
        print("2. Or run: python main.py --continuous --auto-apply")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    import time
    main() 