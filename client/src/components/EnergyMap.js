import React from 'react';
import { MapPin, TrendingUp, TrendingDown, Zap, DollarSign } from 'lucide-react';

const EnergyMap = ({ marketData }) => {
  if (!marketData?.energy || !Array.isArray(marketData.energy) || marketData.energy.length === 0) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(amount);
  };

  const getPriceColor = (price) => {
    if (price < 0.08) return 'text-green-400';
    if (price < 0.12) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDemandColor = (demand) => {
    if (demand < 0.5) return 'text-green-400';
    if (demand < 0.8) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getArbitrageOpportunities = () => {
    const locations = marketData.energy;
    const opportunities = [];

    for (let i = 0; i < locations.length; i++) {
      for (let j = 0; j < locations.length; j++) {
        if (i !== j) {
          const priceDiff = locations[j].energyPrice - locations[i].energyPrice;
          if (priceDiff > 0.02) {
            opportunities.push({
              buy: locations[i],
              sell: locations[j],
              profit: priceDiff,
              profitPercent: (priceDiff / locations[i].energyPrice) * 100
            });
          }
        }
      }
    }

    return opportunities.sort((a, b) => b.profit - a.profit);
  };

  const opportunities = getArbitrageOpportunities();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-white">Energy Market Map</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Zap className="h-4 w-4" />
              <span>Real-time Prices</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Updates</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg bg-slate-800/50">
            <div className="text-2xl font-bold text-white">
              {formatCurrency(
                marketData.energy.reduce((sum, loc) => sum + loc.energyPrice, 0) / marketData.energy.length
              )}
            </div>
            <div className="text-sm text-slate-400">Average Price</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-800/50">
            <div className="text-2xl font-bold text-green-400">
              {opportunities.length}
            </div>
            <div className="text-sm text-slate-400">Arbitrage Opportunities</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-800/50">
            <div className="text-2xl font-bold text-blue-400">
              {formatCurrency(opportunities[0]?.profit || 0)}
            </div>
            <div className="text-sm text-slate-400">Best Opportunity</div>
          </div>
        </div>
      </div>

      {/* Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketData.energy.map((location) => (
          <div key={location.id} className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{location.name}</h3>
                  <div className="text-sm text-slate-400">Energy Market</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getPriceColor(location.energyPrice)}`}>
                  {formatCurrency(location.energyPrice)}
                </div>
                <div className="text-xs text-slate-400">per kWh</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Demand Level</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getDemandColor(location.demand).replace('text-', 'bg-')}`}></div>
                  <span className={`text-sm font-medium ${getDemandColor(location.demand)}`}>
                    {(location.demand * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Price Trend</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">+2.1%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Market Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400">Active</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">24h Volume</span>
                <span className="text-white font-medium">$2.4M</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-slate-400">Peak Hours</span>
                <span className="text-white font-medium">6AM-10PM</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arbitrage Opportunities */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Arbitrage Opportunities</h3>
        
        {opportunities.length > 0 ? (
          <div className="space-y-4">
            {opportunities.slice(0, 5).map((opp, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-sm text-slate-400">Buy</div>
                    <div className="text-white font-medium">{opp.buy.name}</div>
                    <div className="text-xs text-green-400">{formatCurrency(opp.buy.energyPrice)}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-slate-400">→</span>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400">Sell</div>
                    <div className="text-white font-medium">{opp.sell.name}</div>
                    <div className="text-xs text-red-400">{formatCurrency(opp.sell.energyPrice)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">
                    +{formatCurrency(opp.profit)}
                  </div>
                  <div className="text-sm text-slate-400">
                    {opp.profitPercent.toFixed(1)}% profit
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Zap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No arbitrage opportunities at the moment</p>
          </div>
        )}
      </div>

      {/* Market Insights */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Market Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Peak Hours Analysis</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">California</span>
                <span className="text-sm text-red-400">Peak pricing active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Texas</span>
                <span className="text-sm text-green-400">Off-peak pricing</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">New York</span>
                <span className="text-sm text-yellow-400">Moderate demand</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Storage Recommendations</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Best Buy Time</span>
                <span className="text-sm text-green-400">2AM - 6AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Best Sell Time</span>
                <span className="text-sm text-red-400">6PM - 10PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Storage Capacity</span>
                <span className="text-sm text-blue-400">85% utilized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyMap; 