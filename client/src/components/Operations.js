import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, Zap, Cpu, Battery, Clock, Target, Sparkles, AlertTriangle } from 'lucide-react';

const Operations = ({ operations, portfolio, energyContracts, marketData }) => {
  const [activeOperations, setActiveOperations] = useState([]);
  const [showNewOperation, setShowNewOperation] = useState(false);

  useEffect(() => {
    if (operations && operations.length > 0) {
      const newOps = operations.slice(-3); // Show last 3 operations
      setActiveOperations(newOps);
      
      // Show animation for new operations
      if (newOps.length > activeOperations.length) {
        setShowNewOperation(true);
        setTimeout(() => setShowNewOperation(false), 3000);
      }
    }
  }, [operations]);

  // Robust null checks and fallbacks
  if (!operations || !Array.isArray(operations)) {
    return (
      <div className="glass rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Operations Dashboard
        </h2>
        <div className="text-center text-gray-400 py-8">
          <Clock className="w-8 h-8 mx-auto mb-2" />
          <p>No recent operations</p>
        </div>
      </div>
    );
  }
  
  if (!portfolio) {
    return (
      <div className="glass rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Operations Dashboard
        </h2>
        <div className="text-center text-gray-400 py-8">
          <Clock className="w-8 h-8 mx-auto mb-2" />
          <p>Loading portfolio data...</p>
        </div>
      </div>
    );
  }
  
  if (!energyContracts) {
    return (
      <div className="glass rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Operations Dashboard
        </h2>
        <div className="text-center text-gray-400 py-8">
          <Clock className="w-8 h-8 mx-auto mb-2" />
          <p>Loading energy contracts...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0';
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const getOperationIcon = (type) => {
    switch (type) {
      case 'energy_sale': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'battery_arbitrage': return <Battery className="w-4 h-4 text-green-400" />;
      case 'mining_optimization': return <Cpu className="w-4 h-4 text-orange-400" />;
      case 'ai_optimization': return <Activity className="w-4 h-4 text-blue-400" />;
      case 'network_status': return <TrendingUp className="w-4 h-4 text-purple-400" />;
      case 'energy_optimization': return <Zap className="w-4 h-4 text-gray-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'monitoring': return 'text-yellow-400';
      case 'completed': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getBestStrategy = () => {
    const totalRevenue = portfolio.dailyRevenue || 0;
    const totalCost = portfolio.dailyCost || 0;
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;
    
    if (profitMargin > 25) return { strategy: 'Maximize Operations', color: 'text-green-400', icon: TrendingUp };
    if (profitMargin > 15) return { strategy: 'Optimize Efficiency', color: 'text-yellow-400', icon: Activity };
    if (profitMargin > 5) return { strategy: 'Energy Arbitrage', color: 'text-blue-400', icon: Zap };
    return { strategy: 'Cost Reduction', color: 'text-red-400', icon: TrendingDown };
  };

  const bestStrategy = getBestStrategy();
  const StrategyIcon = bestStrategy.icon;

  return (
    <div className="glass rounded-xl p-6 border border-white/10 relative overflow-hidden">
      {/* Live trading indicator */}
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <div className="w-2 h-2 status-online rounded-full"></div>
        <span className="text-xs text-green-400 font-medium animate-pulse">LIVE TRADING</span>
      </div>

      {/* New operation notification */}
      {showNewOperation && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm animate-bounce">
          <Sparkles className="w-4 h-4 inline mr-1" />
          New Trade
        </div>
      )}

      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Operations Dashboard
      </h2>

      {/* Current Strategy */}
      <div className="glass-dark rounded-lg p-4 mb-6 border border-white/5 relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-white">Current Best Strategy</h3>
          <div className={`flex items-center gap-2 ${bestStrategy.color}`}>
            <StrategyIcon className="w-5 h-5" />
            <span className="font-medium">{bestStrategy.strategy}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 price-ticker">
              {formatCurrency(portfolio.dailyRevenue)}
            </div>
            <div className="text-sm text-gray-400">Daily Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 price-ticker">
              {formatCurrency(portfolio.dailyCost)}
            </div>
            <div className="text-sm text-gray-400">Daily Cost</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${portfolio.dailyProfit >= 0 ? 'text-green-400' : 'text-red-400'} price-ticker`}>
              {formatCurrency(portfolio.dailyProfit)}
            </div>
            <div className="text-sm text-gray-400">Daily Profit</div>
          </div>
        </div>

        {/* Strategy indicator */}
        <div className="absolute bottom-2 right-2">
          <Target className="w-4 h-4 text-blue-400 animate-pulse" />
        </div>
      </div>

      {/* Energy Market Status */}
      <div className="glass-dark rounded-lg p-4 mb-6 border border-white/5">
        <h3 className="text-lg font-medium text-white mb-3">Energy Market Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {energyContracts && Object.entries(energyContracts).map(([location, contract]) => {
            // Get actual grid rate from market data
            const gridData = marketData?.energy?.find(e => e.id === location);
            const gridRate = gridData?.currentRate || 0.08; // Fallback if no market data
            const arbitrageOpportunity = gridRate - (contract.contractPrice || 0);
            const isProfitable = arbitrageOpportunity > 0.01;
            
            return (
              <div key={location} className="text-center relative">
                <div className="text-sm font-medium text-white capitalize">{location}</div>
                <div className="text-xs text-gray-400">
                  Contract: ${contract.contractPrice ? contract.contractPrice.toFixed(3) : '0.000'}/kWh
                </div>
                <div className="text-xs text-gray-400">
                  Grid: ${gridRate.toFixed(3)}/kWh
                </div>
                <div className={`text-xs font-medium ${isProfitable ? 'text-green-400' : 'text-gray-400'}`}>
                  {isProfitable ? 'Arbitrage Available' : 'No Opportunity'}
                </div>
                
                {/* Profitability indicator */}
                {isProfitable && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Operations */}
      <div className="glass-dark rounded-lg p-4 border border-white/5">
        <h3 className="text-lg font-medium text-white mb-3">Recent Operations</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {operations && operations.length > 0 ? (
            operations.map((operation, index) => (
              <div key={operation.id || Math.random()} className={`flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg relative transition-all duration-300 ${index === operations.length - 1 ? 'border-l-4 border-green-400' : ''}`}>
                {getOperationIcon(operation.type)}
                <div className="flex-1">
                  <div className="text-sm text-white">{operation.description || 'No description'}</div>
                  <div className="text-xs text-gray-400 capitalize">
                    {(operation.location || 'N/A')} • {operation.timestamp ? new Date(operation.timestamp).toLocaleTimeString() : 'N/A'}
                  </div>
                </div>
                <div className="text-right">
                  {typeof operation.revenue === 'number' && operation.revenue > 0 && (
                    <div className="text-sm text-green-400 font-medium animate-pulse">
                      +{formatCurrency(operation.revenue)}/hr
                    </div>
                  )}
                  <div className={`text-xs font-medium ${getStatusColor(operation.status)}`}>
                    {operation.status || 'unknown'}
                  </div>
                </div>
                
                {/* New operation indicator */}
                {index === operations.length - 1 && showNewOperation && (
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-bounce" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <p>No recent operations</p>
            </div>
          )}
        </div>
      </div>

      {/* Live trading summary */}
      <div className="mt-6 glass-dark rounded-lg p-4 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">Live Trading Summary</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 status-online rounded-full"></div>
            <span className="text-xs text-green-400">Active</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          AI agents continuously optimizing across energy, Bitcoin mining, and AI compute markets
        </div>
      </div>
    </div>
  );
};

export default Operations; 