import React from 'react';
import { Bitcoin, TrendingUp, TrendingDown, Cpu, Clock, DollarSign, Hash } from 'lucide-react';

const BitcoinMining = ({ marketData }) => {
  if (!marketData?.bitcoin || !marketData?.energy || !Array.isArray(marketData.energy)) return null;

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

  const bitcoin = marketData.bitcoin;
  const daysToHalving = bitcoin.halvingCountdown;
  const yearsToHalving = Math.floor(daysToHalving / 365);
  const monthsToHalving = Math.floor((daysToHalving % 365) / 30);

  const miningMetrics = [
    {
      name: 'Current Price',
      value: formatCurrency(bitcoin.price),
      change: '+2.4%',
      changeType: 'positive',
      icon: Bitcoin,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      name: 'Mining Difficulty',
      value: formatNumber(bitcoin.difficulty),
      change: '+0.8%',
      changeType: 'positive',
      icon: Hash,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      name: 'Block Reward',
      value: `${bitcoin.miningReward} BTC`,
      change: 'Fixed',
      changeType: 'neutral',
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      name: 'Next Halving',
      value: `${yearsToHalving}y ${monthsToHalving}m`,
      change: 'Countdown',
      changeType: 'neutral',
      icon: Clock,
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

  const calculateMiningProfitability = () => {
    const energyCost = Math.min(...marketData.energy.map(l => l.energyPrice));
    const miningCost = energyCost * 0.1; // kWh per hash
    const miningReward = bitcoin.miningReward * bitcoin.price;
    const profitability = miningReward - miningCost;
    
    return {
      profitable: profitability > 0,
      dailyProfit: profitability * 144, // 144 blocks per day
      monthlyProfit: profitability * 144 * 30,
      roi: (profitability / miningCost) * 100
    };
  };

  const profitability = calculateMiningProfitability();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Bitcoin Mining Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Bitcoin className="h-4 w-4" />
              <span>Live Mining Data</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Active Mining</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {miningMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.name} className="p-4 rounded-lg bg-slate-800/50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400">{metric.name}</div>
                    <div className="text-lg font-semibold text-white">{metric.value}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getChangeIcon(metric.changeType)}
                  <span className={`text-xs font-medium ${getChangeColor(metric.changeType)}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profitability Analysis */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Mining Profitability</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-6 rounded-lg bg-slate-800/50">
            <div className={`text-3xl font-bold ${profitability.profitable ? 'text-green-400' : 'text-red-400'}`}>
              {profitability.profitable ? 'Profitable' : 'Unprofitable'}
            </div>
            <div className="text-sm text-slate-400 mt-2">Current Status</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-slate-800/50">
            <div className="text-3xl font-bold text-white">
              {formatCurrency(profitability.dailyProfit)}
            </div>
            <div className="text-sm text-slate-400 mt-2">Daily Profit</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-slate-800/50">
            <div className="text-3xl font-bold text-blue-400">
              {profitability.roi.toFixed(1)}%
            </div>
            <div className="text-sm text-slate-400 mt-2">ROI</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Cost Analysis</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Energy Cost</span>
                <span className="text-white font-medium">
                  {formatCurrency(Math.min(...marketData.energy.map(l => l.energyPrice)))}/kWh
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Mining Cost per Block</span>
                <span className="text-red-400 font-medium">
                  {formatCurrency(Math.min(...marketData.energy.map(l => l.energyPrice)) * 0.1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Block Reward</span>
                <span className="text-green-400 font-medium">
                  {formatCurrency(bitcoin.miningReward * bitcoin.price)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <span className="text-sm text-slate-400">Net Profit per Block</span>
                <span className={`font-medium ${profitability.profitable ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(profitability.dailyProfit / 144)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Projections</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Monthly Profit</span>
                <span className="text-white font-medium">
                  {formatCurrency(profitability.monthlyProfit)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Annual Profit</span>
                <span className="text-white font-medium">
                  {formatCurrency(profitability.monthlyProfit * 12)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Break-even Time</span>
                <span className="text-blue-400 font-medium">~8 months</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <span className="text-sm text-slate-400">Risk Level</span>
                <span className="text-yellow-400 font-medium">Medium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Halving Countdown */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Next Halving Event</h3>
        
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-purple-400 mb-2">
            {daysToHalving} Days
          </div>
          <div className="text-lg text-slate-400">
            Until Bitcoin Block Reward Halves
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-slate-800/50">
            <div className="text-2xl font-bold text-white">{yearsToHalving}</div>
            <div className="text-sm text-slate-400">Years</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-800/50">
            <div className="text-2xl font-bold text-white">{monthsToHalving}</div>
            <div className="text-sm text-slate-400">Months</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-800/50">
            <div className="text-2xl font-bold text-white">{daysToHalving % 30}</div>
            <div className="text-sm text-slate-400">Days</div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <h4 className="text-lg font-medium text-white mb-2">Halving Impact</h4>
          <p className="text-sm text-slate-300">
            The next halving will reduce the block reward from {bitcoin.miningReward} BTC to {bitcoin.miningReward / 2} BTC. 
            This typically leads to increased mining difficulty and potential price appreciation.
          </p>
        </div>
      </div>

      {/* Mining Recommendations */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">AI Mining Recommendations</h3>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white font-medium">Current Strategy</span>
            </div>
            <p className="text-sm text-slate-300">
              Continue mining operations with current energy costs. Profitability remains positive with {profitability.roi.toFixed(1)}% ROI.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-white font-medium">Halving Preparation</span>
            </div>
            <p className="text-sm text-slate-300">
              Consider upgrading mining equipment before the halving event to maintain profitability when rewards are reduced by 50%.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-white font-medium">Energy Optimization</span>
            </div>
            <p className="text-sm text-slate-300">
              Monitor energy prices across locations and consider relocating mining operations to areas with lower energy costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinMining; 