import React from 'react';
import { TrendingUp, TrendingDown, Zap, Bitcoin, Cpu, Globe } from 'lucide-react';

const MarketOverview = ({ marketData }) => {
  if (!marketData || !marketData.energy || !Array.isArray(marketData.energy)) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const metrics = [
    {
      name: 'Bitcoin Price',
      value: formatCurrency(marketData.bitcoin?.price || 0),
      change: '+2.4%',
      changeType: 'positive',
      icon: Bitcoin,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      name: 'Avg Energy Price',
      value: formatCurrency(
        marketData.energy.length > 0 
          ? marketData.energy.reduce((sum, loc) => sum + loc.energyPrice, 0) / marketData.energy.length
          : 0
      ),
      change: '-1.2%',
      changeType: 'negative',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      name: 'Mining Difficulty',
      value: formatNumber(marketData.bitcoin?.difficulty || 0),
      change: '+0.8%',
      changeType: 'positive',
      icon: Cpu,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      name: 'Halving Countdown',
      value: `${Math.floor((marketData.bitcoin?.halvingCountdown || 0) / 365)} years`,
      change: 'Next: 2024',
      changeType: 'neutral',
      icon: Globe,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const getChangeIcon = (changeType) => {
    if (changeType === 'positive') {
      return <TrendingUp className="h-4 w-4 text-green-400" />;
    } else if (changeType === 'negative') {
      return <TrendingDown className="h-4 w-4 text-red-400" />;
    }
    return null;
  };

  const getChangeColor = (changeType) => {
    if (changeType === 'positive') return 'text-green-400';
    if (changeType === 'negative') return 'text-red-400';
    return 'text-slate-400';
  };

  return (
    <div className="lg:col-span-2">
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Market Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.name} className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-slate-400">{metric.name}</div>
                  <div className="text-lg font-semibold text-white">{metric.value}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    {getChangeIcon(metric.changeType)}
                    <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Energy Prices by Location</h3>
          <div className="space-y-3">
            {marketData.energy?.map((location) => (
              <div key={location.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-white font-medium">{location.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">
                    {formatCurrency(location.energyPrice)}
                  </div>
                  <div className="text-xs text-slate-400">
                    Demand: {(location.demand * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Inference Market</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(marketData.inference || {}).map(([type, data]) => (
              <div key={type} className="text-center">
                <div className="text-sm text-slate-400 capitalize">{type}</div>
                <div className="text-lg font-semibold text-white">
                  {formatCurrency(data.current || 0)}
                </div>
                <div className="text-xs text-slate-400">
                  Range: {formatCurrency(data.low)} - {formatCurrency(data.high)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview; 