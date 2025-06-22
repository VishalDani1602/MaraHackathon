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
      change: `${marketData.bitcoin?.change24h >= 0 ? '+' : ''}${(marketData.bitcoin?.change24h || 0).toFixed(1)}%`,
      changeType: (marketData.bitcoin?.change24h || 0) >= 0 ? 'positive' : 'negative',
      icon: Bitcoin,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      name: 'Avg Energy Price',
      value: formatCurrency(
        marketData.energy.length > 0 
          ? marketData.energy.reduce((sum, loc) => sum + (loc.currentRate || 0), 0) / marketData.energy.length
          : 0
      ),
      change: 'Grid rates',
      changeType: 'neutral',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      name: 'Network Hash Rate',
      value: `${(marketData.bitcoin?.networkHashRate / 1000000000000000).toFixed(1)} EH/s`,
      change: 'Current',
      changeType: 'neutral',
      icon: Cpu,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      name: 'Daily Volume',
      value: formatCurrency(marketData.bitcoin?.volume || 0),
      change: '24h',
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
                  <div className={`w-3 h-3 rounded-full ${location.isPeakHour ? 'bg-red-400' : 'bg-green-400'}`}></div>
                  <span className="text-white font-medium">{location.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">
                    ${location.currentRate?.toFixed(3)}/kWh
                  </div>
                  <div className="text-xs text-slate-400">
                    {location.isPeakHour ? 'PEAK' : 'OFF-PEAK'} • {location.demand} GW demand
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">AI Compute Market</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(marketData.aiCompute || {}).map(([type, data]) => (
              <div key={type} className="text-center">
                <div className="text-sm text-slate-400 capitalize">{type.toUpperCase()}</div>
                <div className="text-lg font-semibold text-white">
                  ${data.price?.toFixed(1)}/hr
                </div>
                <div className="text-xs text-slate-400">
                  {data.demand}% demand • {data.availability}% available
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