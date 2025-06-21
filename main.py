#!/usr/bin/env python3
"""
MARA Hackathon Optimization System
Main application for automated profit optimization.
"""

import os
import sys
import time
import logging
import argparse
from typing import Optional
from colorama import init, Fore, Style
from tabulate import tabulate

from api_client import MaraAPIClient
from optimizer import ProfitOptimizer, OptimizationResult
from config import LOG_LEVEL, LOG_FORMAT

# Initialize colorama for colored output
init()

# Configure logging
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format=LOG_FORMAT,
    handlers=[
        logging.FileHandler('mara_optimizer.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

class MaraOptimizerApp:
    """Main application class for the MARA optimization system."""
    
    def __init__(self, api_key: Optional[str] = None, site_name: Optional[str] = None):
        self.api_client = MaraAPIClient(api_key)
        self.optimizer = ProfitOptimizer()
        self.site_name = site_name
        self.site_info = None
        
    def setup_site(self) -> bool:
        """Set up the mining site."""
        try:
            if not self.api_client.api_key:
                if not self.site_name:
                    self.site_name = input(f"{Fore.CYAN}Enter site name: {Style.RESET_ALL}")
                
                print(f"{Fore.YELLOW}Creating new site: {self.site_name}{Style.RESET_ALL}")
                result = self.api_client.create_site(self.site_name)
                self.site_info = result
                print(f"{Fore.GREEN}✓ Site created successfully!{Style.RESET_ALL}")
                print(f"{Fore.GREEN}API Key: {result['api_key'][:8]}...{Style.RESET_ALL}")
                print(f"{Fore.GREEN}Max Power: {result['power']:,} W{Style.RESET_ALL}")
            else:
                print(f"{Fore.GREEN}Using existing API key{Style.RESET_ALL}")
                self.site_info = self.api_client.get_site_info()
                
            return True
            
        except Exception as e:
            print(f"{Fore.RED}✗ Failed to setup site: {e}{Style.RESET_ALL}")
            return False
    
    def get_current_status(self) -> dict:
        """Get current site status."""
        try:
            machines = self.api_client.get_machines()
            prices = self.api_client.get_prices()
            inventory = self.api_client.get_inventory()
            
            return {
                'machines': machines,
                'prices': prices,
                'inventory': inventory
            }
        except Exception as e:
            logger.error(f"Failed to get current status: {e}")
            return {}
    
    def display_status(self, status: dict):
        """Display current site status."""
        if not status:
            print(f"{Fore.RED}No status data available{Style.RESET_ALL}")
            return
            
        machines = status.get('machines', {})
        prices = status.get('prices', [])
        inventory = status.get('inventory', {})
        
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}CURRENT SITE STATUS{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        
        # Display current allocation
        if machines:
            print(f"\n{Fore.YELLOW}Current Machine Allocation:{Style.RESET_ALL}")
            allocation_data = []
            for machine_type, count in machines.items():
                if count > 0:
                    allocation_data.append([machine_type, count])
            
            if allocation_data:
                print(tabulate(allocation_data, headers=['Machine Type', 'Count'], tablefmt='grid'))
            else:
                print("No machines allocated")
            
            # Display financial metrics
            if 'total_revenue' in machines:
                print(f"\n{Fore.YELLOW}Financial Metrics:{Style.RESET_ALL}")
                metrics_data = [
                    ['Total Revenue', f"${machines['total_revenue']:,.2f}"],
                    ['Power Cost', f"${machines['total_power_cost']:,.2f}"],
                    ['Net Profit', f"${machines['total_revenue'] - machines['total_power_cost']:,.2f}"],
                    ['Power Used', f"{machines['total_power_used']:,} W"]
                ]
                print(tabulate(metrics_data, tablefmt='grid'))
        
        # Display current prices
        if prices:
            latest_prices = prices[0]
            print(f"\n{Fore.YELLOW}Current Prices:{Style.RESET_ALL}")
            price_data = [
                ['Energy Price', f"${latest_prices.get('energy_price', 0):.4f}/W"],
                ['Hash Price', f"${latest_prices.get('hash_price', 0):.4f}/TH"],
                ['Token Price', f"${latest_prices.get('token_price', 0):.4f}/token"]
            ]
            print(tabulate(price_data, tablefmt='grid'))
    
    def run_optimization(self, auto_apply: bool = False) -> Optional[OptimizationResult]:
        """Run optimization and optionally apply the results."""
        try:
            print(f"\n{Fore.CYAN}Running optimization...{Style.RESET_ALL}")
            
            # Get current data
            status = self.get_current_status()
            if not status:
                print(f"{Fore.RED}Failed to get current status{Style.RESET_ALL}")
                return None
            
            machines = status['machines']
            prices = status['prices']
            inventory = status['inventory']
            
            if not self.site_info:
                self.site_info = self.api_client.get_site_info()
            
            max_power = self.site_info.get('power', 1000000)
            current_allocation = {k: v for k, v in machines.items() if k in ['air_miners', 'hydro_miners', 'immersion_miners', 'asic_compute', 'gpu_compute']}
            
            # Run optimization
            result = self.optimizer.optimize_allocation(
                max_power=max_power,
                prices=prices,
                inventory=inventory,
                current_allocation=current_allocation
            )
            
            if not result.constraints_satisfied:
                print(f"{Fore.RED}Optimization failed: {result.optimization_status}{Style.RESET_ALL}")
                return None
            
            # Display optimization results
            self.display_optimization_results(result, current_allocation)
            
            # Check if rebalancing is needed
            if self.optimizer.should_rebalance(current_allocation, result.allocation):
                print(f"\n{Fore.YELLOW}Rebalancing recommended!{Style.RESET_ALL}")
                
                if auto_apply:
                    return self.apply_optimization(result)
                else:
                    response = input(f"{Fore.CYAN}Apply optimization? (y/n): {Style.RESET_ALL}").lower()
                    if response in ['y', 'yes']:
                        return self.apply_optimization(result)
            else:
                print(f"\n{Fore.GREEN}Current allocation is optimal{Style.RESET_ALL}")
            
            return result
            
        except Exception as e:
            print(f"{Fore.RED}Optimization error: {e}{Style.RESET_ALL}")
            logger.error(f"Optimization error: {e}")
            return None
    
    def display_optimization_results(self, result: OptimizationResult, current_allocation: dict):
        """Display optimization results."""
        print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}OPTIMIZATION RESULTS{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
        
        # Display optimal allocation
        print(f"\n{Fore.YELLOW}Optimal Allocation:{Style.RESET_ALL}")
        allocation_data = []
        for machine_type, count in result.allocation.items():
            if count > 0:
                current = current_allocation.get(machine_type, 0)
                change = count - current
                change_str = f"({change:+d})" if change != 0 else "(no change)"
                allocation_data.append([machine_type, count, change_str])
        
        if allocation_data:
            print(tabulate(allocation_data, headers=['Machine Type', 'Optimal Count', 'Change'], tablefmt='grid'))
        else:
            print("No machines in optimal allocation")
        
        # Display metrics
        print(f"\n{Fore.YELLOW}Expected Performance:{Style.RESET_ALL}")
        metrics_data = [
            ['Expected Profit', f"${result.expected_profit:,.2f}"],
            ['Profit Margin', f"{result.profit_margin:.2%}"],
            ['ROI', f"{result.roi:.2%}"],
            ['Power Used', f"{result.total_power_used:,} W"]
        ]
        print(tabulate(metrics_data, tablefmt='grid'))
        
        # Display insights
        status = self.get_current_status()
        if status.get('prices'):
            insights = self.optimizer.get_optimization_insights(result, status['prices'])
            if insights.get('recommendations'):
                print(f"\n{Fore.YELLOW}Recommendations:{Style.RESET_ALL}")
                for rec in insights['recommendations']:
                    print(f"• {rec}")
    
    def apply_optimization(self, result: OptimizationResult) -> OptimizationResult:
        """Apply the optimization results to the site."""
        try:
            print(f"\n{Fore.YELLOW}Applying optimization...{Style.RESET_ALL}")
            
            # Filter out zero allocations
            allocation = {k: v for k, v in result.allocation.items() if v > 0}
            
            # Apply the allocation
            response = self.api_client.update_machines(allocation)
            
            print(f"{Fore.GREEN}✓ Optimization applied successfully!{Style.RESET_ALL}")
            
            # Get updated status
            time.sleep(2)  # Wait for API to update
            updated_status = self.get_current_status()
            if updated_status:
                self.display_status(updated_status)
            
            return result
            
        except Exception as e:
            print(f"{Fore.RED}✗ Failed to apply optimization: {e}{Style.RESET_ALL}")
            logger.error(f"Failed to apply optimization: {e}")
            return result
    
    def run_continuous_optimization(self, interval_minutes: int = 5):
        """Run continuous optimization with periodic checks."""
        print(f"\n{Fore.CYAN}Starting continuous optimization (checking every {interval_minutes} minutes){Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Press Ctrl+C to stop{Style.RESET_ALL}")
        
        try:
            while True:
                print(f"\n{Fore.CYAN}{'='*40}{Style.RESET_ALL}")
                print(f"{Fore.CYAN}Optimization Cycle - {time.strftime('%Y-%m-%d %H:%M:%S')}{Style.RESET_ALL}")
                print(f"{Fore.CYAN}{'='*40}{Style.RESET_ALL}")
                
                # Display current status
                status = self.get_current_status()
                self.display_status(status)
                
                # Run optimization
                self.run_optimization(auto_apply=True)
                
                print(f"\n{Fore.YELLOW}Waiting {interval_minutes} minutes until next optimization...{Style.RESET_ALL}")
                time.sleep(interval_minutes * 60)
                
        except KeyboardInterrupt:
            print(f"\n{Fore.YELLOW}Continuous optimization stopped{Style.RESET_ALL}")

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description='MARA Hackathon Optimization System')
    parser.add_argument('--api-key', help='API key for existing site')
    parser.add_argument('--site-name', help='Name for new site')
    parser.add_argument('--continuous', action='store_true', help='Run continuous optimization')
    parser.add_argument('--interval', type=int, default=5, help='Interval in minutes for continuous mode')
    parser.add_argument('--auto-apply', action='store_true', help='Automatically apply optimizations')
    
    args = parser.parse_args()
    
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}MARA HACKATHON OPTIMIZATION SYSTEM{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
    
    # Initialize app
    app = MaraOptimizerApp(api_key=args.api_key, site_name=args.site_name)
    
    # Setup site
    if not app.setup_site():
        sys.exit(1)
    
    # Run optimization
    if args.continuous:
        app.run_continuous_optimization(args.interval)
    else:
        app.run_optimization(auto_apply=args.auto_apply)

if __name__ == "__main__":
    main() 