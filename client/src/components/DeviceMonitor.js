import React from 'react';
import { Activity, Cpu, Zap, Battery, TrendingUp, TrendingDown } from 'lucide-react';

const DeviceMonitor = ({ devices }) => {
  const formatPower = (power) => {
    if (power >= 1000000) return `${(power / 1000000).toFixed(1)} GW`;
    if (power >= 1000) return `${(power / 1000).toFixed(1)} MW`;
    return `${power.toFixed(0)} kW`;
  };

  const formatHashRate = (hashRate) => {
    if (hashRate >= 1000) return `${(hashRate / 1000).toFixed(1)} PH/s`;
    return `${hashRate.toFixed(0)} TH/s`;
  };

  const formatRevenue = (revenue) => {
    if (revenue >= 1000000) return `$${(revenue / 1000000).toFixed(1)}M`;
    if (revenue >= 1000) return `$${(revenue / 1000).toFixed(1)}K`;
    return `$${revenue.toFixed(0)}`;
  };

  const formatCost = (cost) => {
    if (cost >= 1000000) return `$${(cost / 1000000).toFixed(1)}M`;
    if (cost >= 1000) return `$${(cost / 1000).toFixed(1)}K`;
    return `$${cost.toFixed(0)}`;
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'bitcoin_miner': return <Cpu className="w-5 h-5" />;
      case 'ai_server': return <Activity className="w-5 h-5" />;
      case 'battery': return <Battery className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'standby': return 'text-yellow-400';
      case 'maintenance': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getProfitIndicator = (profit) => {
    if (profit > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (profit < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return null;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Device Monitor
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {devices.map((device) => (
          <div key={device.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getDeviceIcon(device.type)}
                <span className="text-white font-medium text-sm">{device.name}</span>
              </div>
              <span className={`text-xs font-medium ${getStatusColor(device.status)}`}>
                {device.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-white capitalize">{device.location}</span>
              </div>
              
              {device.type === 'bitcoin_miner' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hash Rate:</span>
                    <span className="text-white">{formatHashRate(device.hashRate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Miners:</span>
                    <span className="text-white">{device.minerCount?.toLocaleString() || 'N/A'}</span>
                  </div>
                </>
              )}
              
              {device.type === 'ai_server' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">GPUs:</span>
                    <span className="text-white">{device.gpuCount?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Servers:</span>
                    <span className="text-white">{device.serverCount?.toLocaleString() || 'N/A'}</span>
                  </div>
                </>
              )}
              
              {device.type === 'battery' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Capacity:</span>
                    <span className="text-white">{formatPower(device.capacity)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Energy:</span>
                    <span className="text-white">{device.energyCapacity?.toLocaleString() || 'N/A'} MWh</span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-400">Power:</span>
                <span className="text-white">{formatPower(device.powerConsumption)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Efficiency:</span>
                <span className="text-white">{device.efficiency?.toFixed(1) || 'N/A'}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Uptime:</span>
                <span className="text-white">{device.uptime?.toFixed(1) || 'N/A'}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Temp:</span>
                <span className="text-white">{device.temperature?.toFixed(0) || 'N/A'}°F</span>
              </div>
              
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Revenue:</span>
                  <span className="text-green-400 font-medium">{formatRevenue(device.revenue)}/hr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Cost:</span>
                  <span className="text-red-400 font-medium">{formatCost(device.cost)}/hr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Profit:</span>
                  <div className="flex items-center gap-1">
                    <span className={`font-medium ${device.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatRevenue(device.profit)}/hr
                    </span>
                    {getProfitIndicator(device.profit)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceMonitor; 