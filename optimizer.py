"""
Optimization Engine for MARA Hackathon
Uses linear programming to find optimal machine allocations for maximum profit.
"""

import numpy as np
import pandas as pd
from scipy.optimize import linprog
import logging
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
from config import OPTIMIZATION_CONFIG, MACHINE_TYPES

logger = logging.getLogger(__name__)

@dataclass
class OptimizationResult:
    """Result of optimization calculation."""
    allocation: Dict[str, int]
    expected_profit: float
    total_power_used: int
    profit_margin: float
    roi: float
    constraints_satisfied: bool
    optimization_status: str

class ProfitOptimizer:
    """Optimization engine for maximizing mining profits."""
    
    def __init__(self):
        self.config = OPTIMIZATION_CONFIG
        self.machine_types = MACHINE_TYPES
        
    def calculate_expected_revenue(self, 
                                 allocation: Dict[str, int], 
                                 prices: List[Dict[str, Any]], 
                                 inventory: Dict[str, Any]) -> Dict[str, float]:
        """Calculate expected revenue for each machine type."""
        if not prices:
            return {}
            
        # Use most recent price data
        latest_prices = prices[0]
        energy_price = latest_prices.get('energy_price', 0)
        hash_price = latest_prices.get('hash_price', 0)
        token_price = latest_prices.get('token_price', 0)
        
        revenue = {}
        
        # Calculate mining revenue (hashrate * hash_price)
        for machine_type, count in allocation.items():
            if machine_type in inventory.get('miners', {}):
                miner_spec = inventory['miners'][machine_type]
                hashrate = miner_spec.get('hashrate', 0)
                power = miner_spec.get('power', 0)
                
                # Revenue = hashrate * hash_price * count
                revenue[machine_type] = hashrate * hash_price * count
                
            elif machine_type in inventory.get('inference', {}):
                compute_spec = inventory['inference'][machine_type]
                tokens = compute_spec.get('tokens', 0)
                power = compute_spec.get('power', 0)
                
                # Revenue = tokens * token_price * count
                revenue[machine_type] = tokens * token_price * count
                
        return revenue
    
    def calculate_power_costs(self, 
                            allocation: Dict[str, int], 
                            prices: List[Dict[str, Any]], 
                            inventory: Dict[str, Any]) -> float:
        """Calculate total power costs."""
        if not prices:
            return 0.0
            
        latest_prices = prices[0]
        energy_price = latest_prices.get('energy_price', 0)
        
        total_power = 0
        for machine_type, count in allocation.items():
            if machine_type in inventory.get('miners', {}):
                power = inventory['miners'][machine_type].get('power', 0)
                total_power += power * count
            elif machine_type in inventory.get('inference', {}):
                power = inventory['inference'][machine_type].get('power', 0)
                total_power += power * count
                
        return total_power * energy_price
    
    def optimize_allocation(self, 
                          max_power: int, 
                          prices: List[Dict[str, Any]], 
                          inventory: Dict[str, Any],
                          current_allocation: Optional[Dict[str, int]] = None) -> OptimizationResult:
        """
        Find optimal machine allocation using linear programming.
        
        Args:
            max_power: Maximum power available at the site
            prices: Current price data
            inventory: Available inventory
            current_allocation: Current machine allocation (for comparison)
            
        Returns:
            OptimizationResult with optimal allocation and metrics
        """
        if not prices or not inventory:
            raise ValueError("Prices and inventory data required for optimization")
            
        latest_prices = prices[0]
        energy_price = latest_prices.get('energy_price', 0)
        hash_price = latest_prices.get('hash_price', 0)
        token_price = latest_prices.get('token_price', 0)
        
        # Define machine types and their characteristics
        machine_vars = []
        power_constraints = []
        profit_coefficients = []
        
        # Process miners
        for machine_type, spec in inventory.get('miners', {}).items():
            machine_vars.append(machine_type)
            power_constraints.append(spec.get('power', 0))
            
            # Profit coefficient = revenue - cost per unit
            hashrate = spec.get('hashrate', 0)
            power = spec.get('power', 0)
            revenue_per_unit = hashrate * hash_price
            cost_per_unit = power * energy_price
            profit_per_unit = revenue_per_unit - cost_per_unit
            profit_coefficients.append(profit_per_unit)
            
        # Process inference machines
        for machine_type, spec in inventory.get('inference', {}).items():
            machine_vars.append(machine_type)
            power_constraints.append(spec.get('power', 0))
            
            # Profit coefficient = revenue - cost per unit
            tokens = spec.get('tokens', 0)
            power = spec.get('power', 0)
            revenue_per_unit = tokens * token_price
            cost_per_unit = power * energy_price
            profit_per_unit = revenue_per_unit - cost_per_unit
            profit_coefficients.append(profit_per_unit)
        
        # Convert to numpy arrays for optimization
        c = np.array(profit_coefficients)  # Objective function coefficients (negative for maximization)
        A_ub = np.array([power_constraints])  # Power constraint matrix
        b_ub = np.array([max_power])  # Power constraint bounds
        
        # Bounds: all machines must be non-negative integers
        bounds = [(0, None) for _ in machine_vars]
        
        # Solve linear programming problem
        try:
            result = linprog(
                c=-c,  # Negative because we want to maximize
                A_ub=A_ub,
                b_ub=b_ub,
                bounds=bounds,
                method='highs',
                options={'disp': False}
            )
            
            if result.success:
                # Convert continuous solution to integers (round down for safety)
                optimal_allocation = {}
                total_power_used = 0
                total_revenue = 0
                total_cost = 0
                
                for i, machine_type in enumerate(machine_vars):
                    count = int(result.x[i])
                    optimal_allocation[machine_type] = count
                    
                    power = power_constraints[i]
                    total_power_used += power * count
                    
                    # Calculate revenue and cost for this machine type
                    if machine_type in inventory.get('miners', {}):
                        hashrate = inventory['miners'][machine_type].get('hashrate', 0)
                        revenue = hashrate * hash_price * count
                    else:
                        tokens = inventory['inference'][machine_type].get('tokens', 0)
                        revenue = tokens * token_price * count
                        
                    cost = power * energy_price * count
                    total_revenue += revenue
                    total_cost += cost
                
                expected_profit = total_revenue - total_cost
                profit_margin = (expected_profit / total_revenue) if total_revenue > 0 else 0
                roi = (expected_profit / total_cost) if total_cost > 0 else 0
                
                return OptimizationResult(
                    allocation=optimal_allocation,
                    expected_profit=expected_profit,
                    total_power_used=total_power_used,
                    profit_margin=profit_margin,
                    roi=roi,
                    constraints_satisfied=True,
                    optimization_status="success"
                )
            else:
                logger.warning(f"Optimization failed: {result.message}")
                return OptimizationResult(
                    allocation={},
                    expected_profit=0,
                    total_power_used=0,
                    profit_margin=0,
                    roi=0,
                    constraints_satisfied=False,
                    optimization_status=result.message
                )
                
        except Exception as e:
            logger.error(f"Optimization error: {e}")
            return OptimizationResult(
                allocation={},
                expected_profit=0,
                total_power_used=0,
                profit_margin=0,
                roi=0,
                constraints_satisfied=False,
                optimization_status=f"error: {str(e)}"
            )
    
    def should_rebalance(self, 
                        current_allocation: Dict[str, int], 
                        optimal_allocation: Dict[str, int]) -> bool:
        """Determine if rebalancing is needed based on threshold."""
        if not current_allocation:
            return True
            
        total_current = sum(current_allocation.values())
        total_optimal = sum(optimal_allocation.values())
        
        if total_current == 0:
            return total_optimal > 0
            
        # Calculate percentage change
        for machine_type in set(current_allocation.keys()) | set(optimal_allocation.keys()):
            current = current_allocation.get(machine_type, 0)
            optimal = optimal_allocation.get(machine_type, 0)
            
            if current > 0:
                change_pct = abs(optimal - current) / current
                if change_pct > self.config['rebalance_threshold']:
                    return True
                    
        return False
    
    def get_optimization_insights(self, 
                                result: OptimizationResult, 
                                prices: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate insights about the optimization result."""
        if not prices:
            return {}
            
        latest_prices = prices[0]
        
        insights = {
            "current_prices": {
                "energy_price": latest_prices.get('energy_price', 0),
                "hash_price": latest_prices.get('hash_price', 0),
                "token_price": latest_prices.get('token_price', 0)
            },
            "optimization_metrics": {
                "expected_profit": result.expected_profit,
                "profit_margin": result.profit_margin,
                "roi": result.roi,
                "power_efficiency": result.expected_profit / result.total_power_used if result.total_power_used > 0 else 0
            },
            "recommendations": []
        }
        
        # Generate recommendations
        if result.profit_margin < 0.1:
            insights["recommendations"].append("Low profit margin - consider waiting for better prices")
        
        if result.roi < 0.05:
            insights["recommendations"].append("Low ROI - current allocation may not be profitable")
            
        if result.total_power_used < result.total_power_used * 0.9:  # Assuming we have access to max power
            insights["recommendations"].append("Underutilized power capacity - consider scaling up")
            
        return insights 