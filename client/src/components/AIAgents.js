import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, Zap, Cpu, Target, Activity, BarChart3 } from 'lucide-react';

const AIAgents = ({ agents, tradingHistory }) => {
  const [aiInsights, setAiInsights] = useState(null);
  const [aiPredictions, setAiPredictions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIInsights();
    const interval = setInterval(fetchAIInsights, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      const [insightsRes, predictionsRes] = await Promise.all([
        fetch('/api/ai-insights'),
        fetch('/api/ai-predictions')
      ]);

      if (insightsRes.ok) {
        const insights = await insightsRes.json();
        setAiInsights(insights);
        console.log('AI Insights loaded:', insights);
      }

      if (predictionsRes.ok) {
        const predictions = await predictionsRes.json();
        setAiPredictions(predictions);
        console.log('AI Predictions loaded:', predictions);
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0';
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'bullish' ? <TrendingUp className="w-4 h-4 text-green-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />;
  };

  if (loading) {
    return (
      <div className="glass rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-center py-12">
          <div className="ai-processing p-4 rounded-full">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <span className="ml-4 text-gray-400 text-lg">Initializing AI Models...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Models Overview */}
      <div className="glass rounded-xl p-6 border border-white/10 card-hover">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 ai-gradient rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Trading Agents</h2>
            <p className="text-gray-400">Neural networks powering trading decisions</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-dark rounded-lg p-4 border border-white/5 card-hover">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 crypto-gradient rounded-lg">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white">Price Predictor</span>
            </div>
            <div className="text-xs text-gray-400">LSTM Neural Network</div>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 status-online rounded-full mr-2"></div>
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
          
          <div className="glass-dark rounded-lg p-4 border border-white/5 card-hover">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 energy-gradient rounded-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white">Demand Forecaster</span>
            </div>
            <div className="text-xs text-gray-400">Neural Network</div>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 status-online rounded-full mr-2"></div>
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
          
          <div className="glass-dark rounded-lg p-4 border border-white/5 card-hover">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 ai-gradient rounded-lg">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white">Optimization Engine</span>
            </div>
            <div className="text-xs text-gray-400">Genetic Algorithm</div>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 status-online rounded-full mr-2"></div>
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
          
          <div className="glass-dark rounded-lg p-4 border border-white/5 card-hover">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 crypto-gradient rounded-lg">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white">Sentiment Analyzer</span>
            </div>
            <div className="text-xs text-gray-400">Naive Bayes</div>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 status-online rounded-full mr-2"></div>
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Predictions */}
      {aiPredictions && (
        <div className="glass rounded-xl p-6 border border-white/10 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 crypto-gradient rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Predictions</h3>
              <p className="text-gray-400">Real-time market forecasts</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-dark rounded-lg p-4 border border-white/5 card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">Bitcoin Price</span>
                {getTrendIcon(aiPredictions.bitcoin.trend)}
              </div>
              <div className="text-lg font-bold btc-chart price-ticker">
                ${aiPredictions.bitcoin.nextHour.toFixed(0)}
              </div>
              <div className="text-xs text-gray-400">
                Next Hour • {(aiPredictions.bitcoin.confidence * 100).toFixed(0)}% confidence
              </div>
              <div className={`text-xs font-medium ${aiPredictions.bitcoin.trend === 'bullish' ? 'text-green-400' : 'text-red-400'}`}>
                {aiPredictions.bitcoin.trend.toUpperCase()}
              </div>
            </div>
            
            <div className="glass-dark rounded-lg p-4 border border-white/5 card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">Energy Demand</span>
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-lg font-bold text-yellow-400 price-ticker">
                {aiPredictions.energy.demand || '85'} GW
              </div>
              <div className="text-xs text-gray-400">
                Forecasted • ${aiPredictions.energy.price.toFixed(3)}/kWh
              </div>
              <div className="text-xs text-green-400">
                {(aiPredictions.energy.arbitrageOpportunity * 100).toFixed(1)}% arbitrage opportunity
              </div>
            </div>
            
            <div className="glass-dark rounded-lg p-4 border border-white/5 card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">AI Compute</span>
                <Cpu className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-lg font-bold text-blue-400 price-ticker">
                ${aiPredictions.aiCompute.price}/hr
              </div>
              <div className="text-xs text-gray-400">
                H200 GPU • {aiPredictions.aiCompute.demand}% demand
              </div>
              <div className="text-xs text-yellow-400">
                {aiPredictions.aiCompute.availability}% available
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      {aiInsights && (
        <div className="glass rounded-xl p-6 border border-white/10 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 ai-gradient rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Insights & Recommendations</h3>
              <p className="text-gray-400">Intelligent trading strategies</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-white mb-3">Market Sentiment</h4>
              <div className="glass-dark rounded-lg p-4 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Current Sentiment</span>
                  <span className={`text-sm font-medium ${getSentimentColor(aiInsights.marketSentiment)}`}>
                    {aiInsights.marketSentiment.toUpperCase()}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Based on news and social media analysis
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-white mb-3">Portfolio Strategy</h4>
              <div className="glass-dark rounded-lg p-4 border border-white/5">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Recommended Strategy</span>
                    <span className="text-sm font-medium text-white capitalize">
                      {aiInsights.portfolioOptimization.recommendedStrategy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Risk Level</span>
                    <span className="text-sm font-medium text-yellow-400">
                      {aiInsights.portfolioOptimization.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Expected Annual Return</span>
                    <span className="text-sm font-medium text-green-400">
                      {formatCurrency(aiInsights.portfolioOptimization.expectedReturn)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-md font-medium text-white mb-3">Device Optimization Recommendations</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {aiInsights.deviceOptimization && aiInsights.deviceOptimization.length > 0 ? (
                aiInsights.deviceOptimization.map((device) => (
                  <div key={device.id} className="glass-dark rounded-lg p-3 border border-white/5 card-hover">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">{device.id}</div>
                        <div className="text-xs text-gray-400">
                          Recommendation: {device.recommendation}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-400">
                          {formatCurrency(device.expectedProfit)}/hr
                        </div>
                        <div className="text-xs text-gray-400">
                          {(device.confidence * 100).toFixed(0)}% confidence
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-4">
                  <Activity className="w-6 h-6 mx-auto mb-2" />
                  <p>No device optimization data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fallback if no data */}
      {!aiInsights && !aiPredictions && !loading && (
        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="text-center text-gray-400 py-8">
            <Brain className="w-12 h-12 mx-auto mb-4" />
            <p>AI data not available</p>
            <button 
              onClick={fetchAIInsights}
              className="mt-4 px-4 py-2 ai-gradient text-white rounded-lg hover:opacity-80 transition-opacity"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgents; 