import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, Zap, Cpu, Activity, Target, Sparkles } from 'lucide-react';

const PortfolioCard = ({ portfolio }) => {
  const [showSparkles, setShowSparkles] = useState(false);
  const [lastProfit, setLastProfit] = useState(0);

  useEffect(() => {
    if (portfolio && portfolio.dailyProfit > lastProfit) {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 2000);
    }
    if (portfolio) {
      setLastProfit(portfolio.dailyProfit);
    }
  }, [portfolio?.dailyProfit, lastProfit]);

  if (!portfolio) {
    return (
      <div className="glass rounded-xl p-6 border border-white/10 card-hover">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
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

  const formatBitcoin = (btc) => {
    if (typeof btc !== 'number' || isNaN(btc)) return '0 BTC';
    return `${btc.toFixed(2)} BTC`;
  };

  const getProfitColor = (profit) => {
    return profit >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getProfitIcon = (profit) => {
    return profit >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getProfitAnimation = (profit) => {
    return profit >= 0 ? 'animate-bounce' : 'animate-pulse';
  };

  return (
    <div className="glass rounded-xl p-6 border border-white/10 card-hover relative overflow-hidden">
      {/* Sparkles effect for profit increases */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles className="absolute top-4 right-4 w-6 h-6 text-yellow-400 animate-ping" />
          <Sparkles className="absolute top-8 right-8 w-4 h-4 text-orange-400 animate-ping" style={{animationDelay: '0.5s'}} />
          <Sparkles className="absolute top-12 right-12 w-5 h-5 text-green-400 animate-ping" style={{animationDelay: '1s'}} />
        </div>
      )}

      {/* Live trading indicator */}
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <div className="w-2 h-2 status-online rounded-full"></div>
        <span className="text-xs text-green-400 font-medium animate-pulse">LIVE TRADING</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 crypto-gradient rounded-lg">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Portfolio Overview</h2>
            <p className="text-gray-400">Real-time financial performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 status-online rounded-full"></div>
          <span className="text-sm text-green-400 font-medium">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Value */}
        <div className="glass-dark rounded-lg p-4 border border-white/5 card-hover relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 crypto-gradient rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className={`flex items-center space-x-1 ${getProfitColor(portfolio.dailyProfit)}`}>
              {getProfitIcon(portfolio.dailyProfit)}
              <span className={`text-sm font-medium ${getProfitAnimation(portfolio.dailyProfit)}`}>
                {portfolio.dailyProfit >= 0 ? '+' : ''}{formatCurrency(portfolio.dailyProfit)}
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white price-ticker">
            {formatCurrency(portfolio.totalValue)}
          </div>
          <div className="text-sm text-gray-400">Total Portfolio Value</div>
          
          {/* Animated border for profit */}
          {portfolio.dailyProfit > 0 && (
            <div className="absolute inset-0 rounded-lg border-2 border-green-400 opacity-50 animate-pulse"></div>
          )}
        </div>

        {/* Bitcoin Holdings */}
        <div className="glass-dark rounded-lg p-4 border border-white/5 card-hover relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 crypto-gradient rounded-lg">
              <Bitcoin className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm text-yellow-400 font-medium">
              ${portfolio.bitcoinPrice?.toFixed(0) || '0'}
            </div>
          </div>
          <div className="text-2xl font-bold btc-chart price-ticker">
            {formatBitcoin(portfolio.bitcoinHoldings)}
          </div>
          <div className="text-sm text-gray-400">Bitcoin Holdings</div>
          
          {/* Bitcoin accumulation indicator */}
          {portfolio.dailyBTCAccumulation > 0 && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
              +{portfolio.dailyBTCAccumulation.toFixed(4)}
            </div>
          )}
        </div>

        {/* Daily Revenue */}
        <div className="glass-dark rounded-lg p-4 border border-white/5 card-hover relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 energy-gradient rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm text-green-400 font-medium">
              +{formatCurrency(portfolio.dailyRevenue)}
            </div>
          </div>
          <div className="text-2xl font-bold text-green-400 price-ticker">
            {formatCurrency(portfolio.dailyRevenue)}
          </div>
          <div className="text-sm text-gray-400">Daily Revenue</div>
          
          {/* Energy flow animation */}
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-b-lg energy-flow"></div>
        </div>

        {/* Daily Cost */}
        <div className="glass-dark rounded-lg p-4 border border-white/5 card-hover relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 ai-gradient rounded-lg">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm text-red-400 font-medium">
              -{formatCurrency(portfolio.dailyCost)}
            </div>
          </div>
          <div className="text-2xl font-bold text-red-400 price-ticker">
            {formatCurrency(portfolio.dailyCost)}
          </div>
          <div className="text-sm text-gray-400">Daily Operating Cost</div>
          
          {/* Cost warning indicator */}
          {portfolio.dailyCost > portfolio.dailyRevenue && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              High Cost
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-dark rounded-lg p-4 border border-white/5 relative">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Profit Margin</span>
          </div>
          <div className="text-lg font-bold text-green-400">
            {portfolio.dailyRevenue > 0 ? ((portfolio.dailyProfit / portfolio.dailyRevenue) * 100).toFixed(1) : '0'}%
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div 
              className="energy-meter h-1 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, (portfolio.dailyProfit / portfolio.dailyRevenue) * 100))}%` }}
            ></div>
          </div>
        </div>
        
        <div className="glass-dark rounded-lg p-4 border border-white/5 relative">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-white">ROI (Daily)</span>
          </div>
          <div className="text-lg font-bold text-orange-400">
            {portfolio.totalValue > 0 ? ((portfolio.dailyProfit / portfolio.totalValue) * 100).toFixed(2) : '0'}%
          </div>
          
          {/* ROI indicator */}
          {portfolio.dailyProfit > 0 && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          )}
        </div>
        
        <div className="glass-dark rounded-lg p-4 border border-white/5 relative">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Energy Efficiency</span>
          </div>
          <div className="text-lg font-bold text-yellow-400">
            {portfolio.dailyRevenue > 0 ? ((portfolio.dailyProfit / portfolio.dailyCost) * 100).toFixed(1) : '0'}%
          </div>
          
          {/* Efficiency indicator */}
          <div className="absolute bottom-2 right-2">
            <Target className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Energy Flow Indicator */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white">Energy Flow Status</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 status-online rounded-full"></div>
            <span className="text-xs text-green-400">Optimal</span>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 relative">
          <div 
            className="energy-meter h-2 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(100, (portfolio.dailyProfit / portfolio.dailyRevenue) * 100)}%` }}
          ></div>
          
          {/* Flow particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{left: '10%'}}></div>
            <div className="w-1 h-1 bg-orange-400 rounded-full animate-ping" style={{left: '30%', animationDelay: '0.5s'}}></div>
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" style={{left: '60%', animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard; 