import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { 
  TrendingUp, 
  Zap, 
  Cpu, 
  Bitcoin, 
  Activity, 
  Globe,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Bot
} from 'lucide-react';
import MarketOverview from './components/MarketOverview';
import PortfolioCard from './components/PortfolioCard';
import TradingHistory from './components/TradingHistory';
import AIAgents from './components/AIAgents';
import EnergyMap from './components/EnergyMap';
import BitcoinMining from './components/BitcoinMining';
import InferenceMarket from './components/InferenceMarket';

const socket = io('http://localhost:5001');

function App() {
  const [marketData, setMarketData] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [tradingHistory, setTradingHistory] = useState([]);
  const [aiAgents, setAiAgents] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Socket event listeners
    socket.on('market_update', (data) => {
      setMarketData(data);
    });

    socket.on('portfolio_update', (data) => {
      setPortfolio(data);
    });

    socket.on('trading_update', (data) => {
      setTradingHistory(data);
    });

    // Initial data fetch
    fetch('/api/market').then(res => res.json()).then(setMarketData);
    fetch('/api/portfolio').then(res => res.json()).then(setPortfolio);
    fetch('/api/trading-history').then(res => res.json()).then(setTradingHistory);
    fetch('/api/agents').then(res => res.json()).then(setAiAgents);

    return () => {
      socket.off('market_update');
      socket.off('portfolio_update');
      socket.off('trading_update');
    };
  }, []);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'energy', name: 'Energy Map', icon: Globe },
    { id: 'bitcoin', name: 'Bitcoin Mining', icon: Bitcoin },
    { id: 'inference', name: 'Inference Market', icon: Cpu },
    { id: 'agents', name: 'AI Agents', icon: Bot },
    { id: 'history', name: 'Trading History', icon: Clock }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <PortfolioCard portfolio={portfolio} />
              <MarketOverview marketData={marketData} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TradingHistory tradingHistory={tradingHistory} />
              <AIAgents aiAgents={aiAgents} />
            </div>
          </div>
        );
      case 'energy':
        return <EnergyMap marketData={marketData} />;
      case 'bitcoin':
        return <BitcoinMining marketData={marketData} />;
      case 'inference':
        return <InferenceMarket marketData={marketData} />;
      case 'agents':
        return <AIAgents aiAgents={aiAgents} fullView />;
      case 'history':
        return <TradingHistory tradingHistory={tradingHistory} fullView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="glass border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="gradient-primary p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">
                AI Energy Trading System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <Activity className="h-4 w-4" />
                <span>Live Trading</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="glass border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App; 