import React from 'react';
import { Clock, TrendingUp, TrendingDown, Zap, Bitcoin, Cpu, Battery } from 'lucide-react';

const TradingHistory = ({ tradingHistory, fullView = false }) => {
  if (!tradingHistory || !Array.isArray(tradingHistory)) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTradeIcon = (type) => {
    switch (type) {
      case 'energy_sell':
        return <Zap className="h-4 w-4 text-yellow-400" />;
      case 'bitcoin_mine':
        return <Bitcoin className="h-4 w-4 text-orange-400" />;
      case 'ai_compute':
        return <Cpu className="h-4 w-4 text-blue-400" />;
      case 'battery_arbitrage':
        return <Battery className="h-4 w-4 text-green-400" />;
      default:
        return <TrendingUp className="h-4 w-4 text-slate-400" />;
    }
  };

  const getTradeColor = (type) => {
    switch (type) {
      case 'energy_sell':
        return 'text-yellow-400';
      case 'bitcoin_mine':
        return 'text-orange-400';
      case 'ai_compute':
        return 'text-blue-400';
      case 'battery_arbitrage':
        return 'text-green-400';
      default:
        return 'text-slate-400';
    }
  };

  const getTradeDescription = (trade) => {
    return trade.description || `${trade.type.replace('_', ' ')} operation`;
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'text-green-400';
    if (status === 'active') return 'text-blue-400';
    return 'text-yellow-400';
  };

  const displayHistory = fullView ? tradingHistory : tradingHistory.slice(-10);

  return (
    <div className={`glass rounded-xl p-6 ${fullView ? '' : 'lg:col-span-1'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Operation History</h2>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <Clock className="h-4 w-4" />
          <span>Live Updates</span>
        </div>
      </div>

      <div className="space-y-4">
        {displayHistory.map((trade) => (
          <div key={trade.id} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-800/50">
            <div className="flex-shrink-0 mt-1">
              {getTradeIcon(trade.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white">
                  {getTradeDescription(trade)}
                </div>
                <div className="text-xs text-slate-400">
                  {formatTime(trade.timestamp)}
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center space-x-4 text-xs">
                  <span className="text-slate-400">
                    Location: {trade.location?.toUpperCase()}
                  </span>
                  {trade.amount && (
                    <span className="text-slate-400">
                      Amount: {trade.amount.toLocaleString()} {
                        trade.type === 'bitcoin_mine' ? 'TH/s' : 
                        trade.type === 'ai_compute' ? 'GPUs' : 
                        trade.type === 'battery_arbitrage' ? 'kW' : 'kWh'
                      }
                    </span>
                  )}
                </div>
                <div className={`text-xs font-medium ${getStatusColor(trade.status)}`}>
                  {trade.status}
                </div>
              </div>
              {trade.revenue && trade.cost && (
                <div className="flex items-center space-x-4 mt-2 text-xs">
                  <span className="text-green-400">
                    Revenue: {formatCurrency(trade.revenue)}
                  </span>
                  <span className="text-red-400">
                    Cost: {formatCurrency(trade.cost)}
                  </span>
                  <span className={`font-medium ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    Profit: {formatCurrency(trade.profit)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!fullView && tradingHistory.length > 10 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
            View All Operations
          </button>
        </div>
      )}

      {fullView && (
        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {tradingHistory.length}
              </div>
              <div className="text-sm text-slate-400">Total Operations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {tradingHistory.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-sm text-slate-400">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {tradingHistory.filter(t => t.status === 'active').length}
              </div>
              <div className="text-sm text-slate-400">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {formatCurrency(tradingHistory.reduce((sum, t) => sum + (t.profit || 0), 0))}
              </div>
              <div className="text-sm text-slate-400">Total Profit</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingHistory; 