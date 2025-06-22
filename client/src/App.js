import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Zap, 
  Cpu, 
  History, 
  Users, 
  Settings,
  Brain,
  Bitcoin,
  Activity,
  Play,
  Pause
} from 'lucide-react';
import PortfolioCard from './components/PortfolioCard';
import MarketOverview from './components/MarketOverview';
import TradingHistory from './components/TradingHistory';
import DeviceMonitor from './components/DeviceMonitor';
import Operations from './components/Operations';
import AIAgents from './components/AIAgents';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [marketData, setMarketData] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [operations, setOperations] = useState([]);
  const [devices, setDevices] = useState([]);
  const [energyContracts, setEnergyContracts] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [demoSpeed, setDemoSpeed] = useState(1);
  const [showStartupAnimation, setShowStartupAnimation] = useState(true);

  useEffect(() => {
    // Dramatic startup animation
    const timer = setTimeout(() => {
      setShowStartupAnimation(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch initial data
    fetchData();
    
    // Set up polling every 15 seconds (or faster in demo mode)
    const interval = setInterval(fetchData, isDemoMode ? 5000 : 15000);
    
    return () => clearInterval(interval);
  }, [isDemoMode]);

  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      const [marketRes, portfolioRes, operationsRes, devicesRes, contractsRes] = await Promise.all([
        fetch('/api/market-data'),
        fetch('/api/portfolio'),
        fetch('/api/operations'),
        fetch('/api/devices'),
        fetch('/api/energy-contracts')
      ]);

      console.log('API responses:', {
        market: marketRes.status,
        portfolio: portfolioRes.status,
        operations: operationsRes.status,
        devices: devicesRes.status,
        contracts: contractsRes.status
      });

      if (marketRes.ok) {
        const marketData = await marketRes.json();
        setMarketData(marketData);
        console.log('Market data set:', !!marketData);
      }
      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json();
        setPortfolio(portfolioData);
        console.log('Portfolio data set:', !!portfolioData);
      }
      if (operationsRes.ok) {
        const operationsData = await operationsRes.json();
        setOperations(operationsData);
        console.log('Operations data set:', operationsData.length);
      }
      if (devicesRes.ok) {
        const devicesData = await devicesRes.json();
        setDevices(devicesData);
        console.log('Devices data set:', devicesData.length);
      }
      if (contractsRes.ok) {
        const contractsData = await contractsRes.json();
        setEnergyContracts(contractsData);
        console.log('Contracts data set:', Object.keys(contractsData).length);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Users, gradient: 'crypto-gradient' },
    { id: 'devices', name: 'Device Monitor', icon: Cpu, gradient: 'energy-gradient' },
    { id: 'operations', name: 'Operations', icon: TrendingUp, gradient: 'ai-gradient' },
    { id: 'history', name: 'Operation History', icon: History, gradient: 'crypto-gradient' },
    { id: 'agents', name: 'AI Agents', icon: Brain, gradient: 'ai-gradient' }
  ];

  const renderContent = () => {
    console.log('renderContent called with activeTab:', activeTab);
    console.log('Current data state:', { marketData, portfolio, operations, devices, energyContracts });
    
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <PortfolioCard portfolio={portfolio} />
            <MarketOverview marketData={marketData} />
          </div>
        );
      case 'devices':
        return <DeviceMonitor devices={devices} />;
      case 'operations':
        console.log('Rendering Operations component with props:', { marketData, energyContracts, operations });
        return <Operations marketData={marketData} energyContracts={energyContracts} operations={operations} portfolio={portfolio} />;
      case 'history':
        return <TradingHistory tradingHistory={operations} fullView />;
      case 'agents':
        return <AIAgents />;
      default:
        return null;
    }
  };

  // Dramatic startup animation
  if (showStartupAnimation) {
    return (
      <div className="min-h-screen neural-bg flex items-center justify-center">
        <div className="text-center">
          <div className="ai-processing p-8 rounded-full mb-8 mx-auto w-32 h-32 flex items-center justify-center">
            <Brain className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-400 via-blue-500 to-green-400 bg-clip-text text-transparent mb-4">
            AI ENERGY TRADING
          </h1>
          <p className="text-2xl text-gray-300 mb-8">Revolutionary Multi-Market Arbitrage System</p>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4 text-lg text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 status-online rounded-full"></div>
                <span>Initializing Neural Networks</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 text-lg text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 status-online rounded-full"></div>
                <span>Connecting to Energy Markets</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 text-lg text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 status-online rounded-full"></div>
                <span>Optimizing Bitcoin Mining</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 text-lg text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 status-online rounded-full"></div>
                <span>Launching AI Trading Agents</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen neural-bg">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full float opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-orange-400 rounded-full float opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-green-400 rounded-full float opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-purple-400 rounded-full float opacity-30" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Header */}
      <header className="glass-dark border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="relative">
                <Zap className="h-10 w-10 text-orange-400 mr-3 pulse-glow" />
                <div className="absolute -top-1 -right-1 w-3 h-3 status-online rounded-full"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-blue-500 to-green-400 bg-clip-text text-transparent">
                  AI Energy Trading System
                </h1>
                <p className="text-sm text-gray-400 mt-1">Powered by Neural Networks & Blockchain</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 status-online rounded-full"></div>
                  <span className="text-sm text-green-400 font-medium">Live Trading</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bitcoin className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400 font-medium">BTC Mining</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-400 font-medium">AI Compute</span>
                </div>
              </div>
              
              {/* Demo Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsDemoMode(!isDemoMode)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    isDemoMode 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {isDemoMode ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <span className="text-xs text-gray-400">Demo Mode</span>
              </div>
              
              <Settings className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="glass-dark border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 py-4 px-6 rounded-lg font-medium text-sm transition-all duration-300 card-hover ${
                  activeTab === tab.id
                    ? 'glass text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:glass'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTab === tab.id ? tab.gradient : 'bg-gray-700/50'}`}>
                  <tab.icon className="h-5 w-5" />
                </div>
                <span>{tab.name}</span>
                {activeTab === tab.id && (
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-blue-500 rounded-full pulse-glow"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="energy-flow h-1 w-full mb-8 rounded-full opacity-30"></div>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="glass-dark border-t border-white/10 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-400">System Status: Operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 status-online rounded-full"></div>
                <span className="text-sm text-gray-400">Real-time Updates</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 AI Energy Trading Platform | Powered by Advanced Neural Networks
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 