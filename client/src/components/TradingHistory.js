import React from 'react';
import { Clock, TrendingUp, TrendingDown, Zap, Bitcoin, Cpu, Battery } from 'lucide-react';

const TradingHistory = ({ tradingHistory, fullView = false }) => {
  if (!tradingHistory) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getTradeIcon = (type) => {
    switch (type) {
      case 'energy_arbitrage':
        return <Zap className="h-4 w-4 text-yellow-400" />;
      case 'bitcoin_mining':
        return <Bitcoin className="h-4 w-4 text-orange-400" />;
      case 'inference_trading':
        return <Cpu className="h-4 w-4 text-blue-400" />;
      case 'battery_storage':
        return <Battery className="h-4 w-4 text-green-400" />;
      default:
        return <TrendingUp className="h-4 w-4 text-slate-400" />;
    }
  };

  const getTradeColor = (type) => {
    switch (type) {
      case 'energy_arbitrage':
        return 'text-yellow-400';
      case 'bitcoin_mining':
        return 'text-orange-400';
      case 'inference_trading':
        return 'text-blue-400';
      case 'battery_storage':
        return 'text-green-400';
      default:
        return 'text-slate-400';
    }
  };

  const getTradeDescription = (trade) => {
    switch (trade.type) {
      case 'energy_arbitrage':
        return `Buy energy in ${trade.location} for arbitrage`;
      case 'bitcoin_mining':
        return `Allocate ${formatCurrency(trade.amount)} for mining`;
      case 'inference_trading':
        return `Buy ${trade.computeType} compute at discount`;
      case 'battery_storage':
        return `Store energy in ${trade.location}`;
      default:
        return trade.action;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const displayHistory = fullView ? tradingHistory : tradingHistory.slice(-5);

  return (
    <div className={`glass rounded-xl p-6 ${fullView ? '' : 'lg:col-span-1'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Trading History</h2>
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
                    Amount: {formatCurrency(trade.amount)}
                  </span>
                  {trade.expectedProfit && (
                    <span className="text-green-400">
                      Expected: +{trade.expectedProfit.toFixed(1)}%
                    </span>
                  )}
                </div>
                {trade.confidence && (
                  <div className={`text-xs font-medium ${getConfidenceColor(trade.confidence)}`}>
                    {(trade.confidence * 100).toFixed(0)}% confidence
                  </div>
                )}
              </div>
              {trade.executed && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-green-400">Executed</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!fullView && tradingHistory.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
            View All Trades
          </button>
        </div>
      )}

      {fullView && (
        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {tradingHistory.length}
              </div>
              <div className="text-sm text-slate-400">Total Trades</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {tradingHistory.filter(t => t.executed).length}
              </div>
              <div className="text-sm text-slate-400">Executed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {tradingHistory.filter(t => t.confidence >= 0.8).length}
              </div>
              <div className="text-sm text-slate-400">High Confidence</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingHistory; 