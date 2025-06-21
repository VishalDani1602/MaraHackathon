import React from 'react';
import { Cpu, TrendingUp, TrendingDown, Zap, DollarSign, Activity } from 'lucide-react';

const InferenceMarket = ({ marketData }) => {
  if (!marketData?.inference || typeof marketData.inference !== 'object') return null;

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

  const inference = marketData.inference;
  const computeTypes = [
    {
      name: 'GPU Compute',
      type: 'gpu',
      description: 'High-performance GPU instances for AI training and inference',
      icon: Cpu,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      specs: 'NVIDIA A100, V100, RTX 4090'
    },
    {
      name: 'CPU Compute',
      type: 'cpu',
      description: 'General-purpose CPU instances for light AI workloads',
      icon: Activity,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      specs: 'Intel Xeon, AMD EPYC'
    },
    {
      name: 'Specialized AI',
      type: 'specialized',
      description: 'Dedicated AI accelerators and custom hardware',
      icon: Zap,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      specs: 'TPU, ASIC, Custom AI Chips'
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

  const getPriceStatus = (type) => {
    const data = inference[type];
    const avgPrice = (data.low + data.high) / 2;
    const currentPrice = data.current || avgPrice;
    const change = ((currentPrice - avgPrice) / avgPrice) * 100;
    
    if (change > 20) return { status: 'High', color: 'text-red-400', change: `+${change.toFixed(1)}%` };
    if (change < -20) return { status: 'Low', color: 'text-green-400', change: `${change.toFixed(1)}%` };
    return { status: 'Normal', color: 'text-yellow-400', change: `${change > 0 ? '+' : ''}${change.toFixed(1)}%` };
  };

  const getTradingOpportunities = () => {
    const opportunities = [];
    
    Object.keys(inference).forEach(type => {
      const data = inference[type];
      const avgPrice = (data.low + data.high) / 2;
      const currentPrice = data.current || avgPrice;
      const discount = ((avgPrice - currentPrice) / avgPrice) * 100;
      const premium = ((currentPrice - avgPrice) / avgPrice) * 100;
      
      if (discount > 15) {
        opportunities.push({
          type,
          action: 'buy',
          discount,
          price: currentPrice,
          recommendation: 'Good time to purchase compute'
        });
      } else if (premium > 15) {
        opportunities.push({
          type,
          action: 'sell',
          premium,
          price: currentPrice,
          recommendation: 'Good time to sell compute'
        });
      }
    });
    
    return opportunities.sort((a, b) => Math.max(a.discount || 0, a.premium || 0) - Math.max(b.discount || 0, b.premium || 0));
  };

  const opportunities = getTradingOpportunities();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">AI Inference Market</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Cpu className="h-4 w-4" />
              <span>Compute Pricing</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Market</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg bg-slate-800/50">
            <div className="text-2xl font-bold text-white">
              {formatCurrency(
                Object.values(inference).reduce((sum, data) => sum + (data.current || (data.low + data.high) / 2), 0) / Object.keys(inference).length
              )}
            </div>
            <div className="text-sm text-slate-400">Average Price</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-800/50">
            <div className="text-2xl font-bold text-green-400">
              {opportunities.length}
            </div>
            <div className="text-sm text-slate-400">Trading Opportunities</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-800/50">
            <div className="text-2xl font-bold text-blue-400">
              {formatNumber(opportunities.reduce((sum, opp) => sum + (opp.discount || opp.premium), 0) / Math.max(opportunities.length, 1))}%
            </div>
            <div className="text-sm text-slate-400">Avg Opportunity</div>
          </div>
        </div>
      </div>

      {/* Compute Types */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {computeTypes.map((computeType) => {
          const Icon = computeType.icon;
          const priceStatus = getPriceStatus(computeType.type);
          const data = inference[computeType.type];
          
          return (
            <div key={computeType.type} className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${computeType.bgColor}`}>
                    <Icon className={`h-5 w-5 ${computeType.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{computeType.name}</h3>
                    <div className="text-sm text-slate-400">{computeType.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${priceStatus.color}`}>
                    {formatCurrency(data.current || (data.low + data.high) / 2)}
                  </div>
                  <div className="text-xs text-slate-400">per hour</div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Price Range</span>
                  <span className="text-sm text-white">
                    {formatCurrency(data.low)} - {formatCurrency(data.high)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Market Status</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${priceStatus.color.replace('text-', 'bg-')}`}></div>
                    <span className={`text-sm font-medium ${priceStatus.color}`}>
                      {priceStatus.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Price Change</span>
                  <div className="flex items-center space-x-1">
                    {getChangeIcon(priceStatus.change.includes('+') ? 'positive' : 'negative')}
                    <span className={`text-sm font-medium ${getChangeColor(priceStatus.change.includes('+') ? 'positive' : 'negative')}`}>
                      {priceStatus.change}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <div className="text-sm text-slate-400 mb-2">Hardware Specs</div>
                <div className="text-xs text-white">{computeType.specs}</div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Availability</span>
                  <span className="text-green-400 font-medium">High</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-slate-400">Latency</span>
                  <span className="text-white font-medium">&lt;50ms</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trading Opportunities */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Trading Opportunities</h3>
        
        {opportunities.length > 0 ? (
          <div className="space-y-4">
            {opportunities.map((opp, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${opp.action === 'buy' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {opp.action === 'buy' ? (
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white capitalize">
                      {opp.type} Compute - {opp.action.toUpperCase()}
                    </div>
                    <div className="text-xs text-slate-400">{opp.recommendation}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${opp.action === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                    {opp.action === 'buy' ? `-${opp.discount.toFixed(1)}%` : `+${opp.premium.toFixed(1)}%`}
                  </div>
                  <div className="text-sm text-slate-400">
                    {formatCurrency(opp.price)}/hr
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Cpu className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No significant trading opportunities at the moment</p>
          </div>
        )}
      </div>

      {/* Market Insights */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Market Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Demand Analysis</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">GPU Demand</span>
                <span className="text-sm text-red-400">High</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">CPU Demand</span>
                <span className="text-sm text-yellow-400">Medium</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Specialized Demand</span>
                <span className="text-sm text-green-400">Low</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Usage Patterns</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Peak Hours</span>
                <span className="text-sm text-white">9AM-6PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Off-Peak Discount</span>
                <span className="text-sm text-green-400">15-25%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Reserved Pricing</span>
                <span className="text-sm text-blue-400">30% savings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">AI Trading Recommendations</h3>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white font-medium">GPU Compute Strategy</span>
            </div>
            <p className="text-sm text-slate-300">
              Consider purchasing GPU compute during off-peak hours when prices are 15-25% lower. 
              Current market shows high demand during business hours.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-white font-medium">CPU Optimization</span>
            </div>
            <p className="text-sm text-slate-300">
              CPU compute prices are stable with moderate demand. Consider reserved instances 
              for long-term projects to achieve 30% cost savings.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-white font-medium">Specialized Hardware</span>
            </div>
            <p className="text-sm text-slate-300">
              Specialized AI hardware shows low demand but high prices. Monitor for 
              price drops when new hardware generations are released.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InferenceMarket; 