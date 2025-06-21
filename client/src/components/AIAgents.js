import React from 'react';
import { Bot, Brain, TrendingUp, Shield, Zap, Target } from 'lucide-react';

const AIAgents = ({ aiAgents, fullView = false }) => {
  if (!aiAgents) return null;

  const agents = [
    {
      id: 'conservative',
      name: 'Conservative Agent',
      strategy: 'low-risk',
      description: 'Focuses on stable, low-risk arbitrage opportunities with high confidence levels.',
      performance: '+12.4%',
      status: 'active',
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      metrics: {
        trades: 45,
        successRate: '94%',
        avgConfidence: '87%'
      }
    },
    {
      id: 'aggressive',
      name: 'Aggressive Agent',
      strategy: 'high-risk',
      description: 'Pursues high-reward opportunities with calculated risk management.',
      performance: '+28.7%',
      status: 'active',
      icon: Zap,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      metrics: {
        trades: 67,
        successRate: '78%',
        avgConfidence: '72%'
      }
    },
    {
      id: 'balanced',
      name: 'Balanced Agent',
      strategy: 'medium-risk',
      description: 'Optimizes for risk-adjusted returns across all market conditions.',
      performance: '+18.9%',
      status: 'active',
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      metrics: {
        trades: 52,
        successRate: '89%',
        avgConfidence: '81%'
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'paused':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>;
      case 'paused':
        return <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>;
      case 'error':
        return <div className="w-2 h-2 bg-red-400 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-slate-400 rounded-full"></div>;
    }
  };

  return (
    <div className={`glass rounded-xl p-6 ${fullView ? '' : 'lg:col-span-1'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">AI Trading Agents</h2>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <Bot className="h-4 w-4" />
          <span>3 Active</span>
        </div>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <div key={agent.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${agent.bgColor}`}>
                  <Icon className={`h-5 w-5 ${agent.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{agent.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(agent.status)}
                      <span className={`text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="text-slate-400">
                        Strategy: <span className="text-white capitalize">{agent.strategy}</span>
                      </span>
                      <span className="text-green-400 font-medium">
                        {agent.performance}
                      </span>
                    </div>
                  </div>

                  {fullView && (
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-700">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{agent.metrics.trades}</div>
                        <div className="text-xs text-slate-400">Trades</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">{agent.metrics.successRate}</div>
                        <div className="text-xs text-slate-400">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">{agent.metrics.avgConfidence}</div>
                        <div className="text-xs text-slate-400">Avg Confidence</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {fullView && (
        <div className="mt-6 pt-6 border-t border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Agent Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total Trades</span>
                <span className="text-white font-medium">164</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Success Rate</span>
                <span className="text-green-400 font-medium">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Avg Confidence</span>
                <span className="text-blue-400 font-medium">80%</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total P&L</span>
                <span className="text-green-400 font-medium">+$156,200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Sharpe Ratio</span>
                <span className="text-white font-medium">2.4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Max Drawdown</span>
                <span className="text-red-400 font-medium">-8.2%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!fullView && (
        <div className="mt-4 text-center">
          <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
            View All Agents
          </button>
        </div>
      )}
    </div>
  );
};

export default AIAgents; 