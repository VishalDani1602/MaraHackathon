import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Bitcoin, Zap, Cpu } from 'lucide-react';

const PortfolioCard = ({ portfolio }) => {
  if (!portfolio) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const assets = [
    {
      name: 'Cash',
      value: portfolio.cash,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      name: 'Bitcoin',
      value: portfolio.bitcoin * (portfolio.bitcoinPrice || 45000),
      icon: Bitcoin,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      subtitle: `${formatNumber(portfolio.bitcoin)} BTC`
    },
    {
      name: 'Energy',
      value: portfolio.energy * 0.1,
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      subtitle: `${formatNumber(portfolio.energy)} kWh`
    },
    {
      name: 'Compute',
      value: portfolio.compute * 0.05,
      icon: Cpu,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      subtitle: `${formatNumber(portfolio.compute)} units`
    }
  ];

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Portfolio Value</h2>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-400" />
          <span className="text-green-400 text-sm font-medium">+2.4%</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="text-3xl font-bold text-white mb-1">
          {formatCurrency(portfolio.totalValue)}
        </div>
        <div className="text-sm text-slate-400">
          Total portfolio value
        </div>
      </div>

      <div className="space-y-4">
        {assets.map((asset) => {
          const Icon = asset.icon;
          return (
            <div key={asset.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${asset.bgColor}`}>
                  <Icon className={`h-4 w-4 ${asset.color}`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{asset.name}</div>
                  {asset.subtitle && (
                    <div className="text-xs text-slate-400">{asset.subtitle}</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  {formatCurrency(asset.value)}
                </div>
                <div className="text-xs text-slate-400">
                  {((asset.value / portfolio.totalValue) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Daily P&L</span>
          <span className="text-green-400 font-medium">+$24,500</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-slate-400">Monthly P&L</span>
          <span className="text-green-400 font-medium">+$156,200</span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard; 