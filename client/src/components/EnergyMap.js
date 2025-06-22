import React from 'react';
import { MapPin, Zap, TrendingUp, Building2 } from 'lucide-react';

const EnergyMap = ({ energyData }) => {
  if (!energyData || !Array.isArray(energyData) || energyData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Energy Market</h2>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-yellow-400" />
        <h2 className="text-xl font-semibold text-white">Energy Market</h2>
      </div>
      
      <div className="space-y-4">
        {energyData.map((location) => {
          const profitMargin = location.spotPrice - location.contractPrice;
          const profitPercent = (profitMargin / location.contractPrice) * 100;
          const isProfitable = profitMargin > 0.02; // 2 cent minimum profit
          
          return (
            <div key={location.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <h3 className="font-medium text-white">{location.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{location.company}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-gray-600 rounded p-3">
                  <div className="text-xs text-gray-400 mb-1">Contract Price</div>
                  <div className="text-lg font-semibold text-green-400">
                    ${location.contractPrice.toFixed(3)}/kWh
                  </div>
                  <div className="text-xs text-gray-400">
                    {location.contractVolume.toLocaleString()} kWh/month
                  </div>
                </div>
                
                <div className="bg-gray-600 rounded p-3">
                  <div className="text-xs text-gray-400 mb-1">Spot Price</div>
                  <div className="text-lg font-semibold text-orange-400">
                    ${location.spotPrice.toFixed(3)}/kWh
                  </div>
                  <div className="text-xs text-gray-400">
                    Current market rate
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${location.demand > 0.8 ? 'bg-red-400' : location.demand > 0.6 ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                  <span className="text-sm text-gray-300">
                    Demand: {(location.demand * 100).toFixed(0)}%
                  </span>
                </div>
                
                {isProfitable && (
                  <div className="flex items-center gap-2 bg-green-900/30 border border-green-500/30 rounded px-3 py-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">
                      +{profitPercent.toFixed(1)}% profit
                    </span>
                  </div>
                )}
              </div>
              
              {isProfitable && (
                <div className="mt-3 p-3 bg-green-900/20 border border-green-500/30 rounded">
                  <div className="text-sm text-green-400 font-medium mb-1">
                    💡 Energy Selling Opportunity
                  </div>
                  <div className="text-xs text-gray-300">
                    Sell energy at spot price (${location.spotPrice.toFixed(3)}) 
                    vs contract price (${location.contractPrice.toFixed(3)})
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded">
        <div className="text-sm text-blue-400 font-medium mb-2">
          📋 Energy Strategy Summary
        </div>
        <div className="text-xs text-gray-300 space-y-1">
          <div>• Fixed contracts provide stable energy costs</div>
          <div>• Spot market opportunities for additional revenue</div>
          <div>• Sell energy when mining/inference aren't profitable</div>
          <div>• Battery storage for peak/off-peak arbitrage</div>
        </div>
      </div>
    </div>
  );
};

export default EnergyMap; 