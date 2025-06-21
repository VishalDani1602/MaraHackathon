const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Global state
let marketData = {
  energy: [],
  bitcoin: {},
  inference: {},
  locations: []
};

let tradingHistory = [];
let aiAgents = [];
let portfolio = {
  cash: 1000000,
  bitcoin: 0,
  energy: 0,
  compute: 0,
  totalValue: 1000000
};

// Market data simulation
class MarketSimulator {
  constructor() {
    this.locations = [
      { id: 'texas', name: 'Texas', energyPrice: 0.08, demand: 0.7 },
      { id: 'california', name: 'California', energyPrice: 0.15, demand: 0.9 },
      { id: 'newyork', name: 'New York', energyPrice: 0.12, demand: 0.8 },
      { id: 'washington', name: 'Washington', energyPrice: 0.06, demand: 0.6 },
      { id: 'florida', name: 'Florida', energyPrice: 0.10, demand: 0.75 }
    ];
    
    this.bitcoinPrice = 45000;
    this.difficulty = 1.0;
    this.halvingCountdown = 1460; // days until next halving
    
    this.inferencePrices = {
      gpu: { low: 0.5, high: 2.0, current: 1.2 },
      cpu: { low: 0.1, high: 0.5, current: 0.3 },
      specialized: { low: 2.0, high: 8.0, current: 4.5 }
    };
  }

  updateEnergyPrices() {
    this.locations.forEach(location => {
      // Simulate time-based pricing
      const hour = new Date().getHours();
      const basePrice = location.energyPrice;
      
      if (hour >= 6 && hour <= 22) {
        // Peak hours
        location.energyPrice = basePrice * (1.2 + Math.random() * 0.3);
        location.demand = 0.8 + Math.random() * 0.2;
      } else {
        // Off-peak hours
        location.energyPrice = basePrice * (0.7 + Math.random() * 0.2);
        location.demand = 0.4 + Math.random() * 0.3;
      }
    });
  }

  updateBitcoinData() {
    // Simulate BTC price volatility
    const change = (Math.random() - 0.5) * 0.1;
    this.bitcoinPrice *= (1 + change);
    
    // Update difficulty based on network activity
    this.difficulty *= (1 + (Math.random() - 0.5) * 0.05);
    
    // Update halving countdown
    this.halvingCountdown--;
  }

  updateInferencePrices() {
    Object.keys(this.inferencePrices).forEach(type => {
      const base = this.inferencePrices[type];
      const demand = Math.random();
      
      if (demand > 0.7) {
        // High demand
        this.inferencePrices[type].current = base.high * (0.9 + Math.random() * 0.2);
      } else if (demand < 0.3) {
        // Low demand
        this.inferencePrices[type].current = base.low * (0.8 + Math.random() * 0.2);
      } else {
        // Medium demand
        this.inferencePrices[type].current = (base.low + base.high) / 2 * (0.9 + Math.random() * 0.2);
      }
    });
  }

  getMarketData() {
    return {
      energy: this.locations,
      bitcoin: {
        price: this.bitcoinPrice,
        difficulty: this.difficulty,
        halvingCountdown: this.halvingCountdown,
        miningReward: 6.25 / Math.pow(2, Math.floor((210000 - this.halvingCountdown) / 210000))
      },
      inference: this.inferencePrices,
      timestamp: new Date().toISOString()
    };
  }
}

// AI Trading Agents
class TradingAgent {
  constructor(id, strategy) {
    this.id = id;
    this.strategy = strategy;
    this.decisions = [];
    this.performance = 0;
  }

  analyzeMarket(marketData) {
    const analysis = {
      energyArbitrage: this.analyzeEnergyArbitrage(marketData),
      bitcoinMining: this.analyzeBitcoinMining(marketData),
      inferenceTrading: this.analyzeInferenceTrading(marketData),
      batteryStorage: this.analyzeBatteryStorage(marketData)
    };

    return this.makeDecision(analysis, marketData);
  }

  analyzeEnergyArbitrage(marketData) {
    const locations = marketData.energy;
    let bestBuy = null;
    let bestSell = null;
    let maxProfit = 0;

    for (let i = 0; i < locations.length; i++) {
      for (let j = 0; j < locations.length; j++) {
        if (i !== j) {
          const profit = locations[j].energyPrice - locations[i].energyPrice;
          if (profit > maxProfit) {
            maxProfit = profit;
            bestBuy = locations[i];
            bestSell = locations[j];
          }
        }
      }
    }

    return {
      opportunity: maxProfit > 0.02, // 2 cent threshold
      buyLocation: bestBuy,
      sellLocation: bestSell,
      expectedProfit: maxProfit
    };
  }

  analyzeBitcoinMining(marketData) {
    const btc = marketData.bitcoin;
    const energyCost = Math.min(...marketData.energy.map(l => l.energyPrice));
    const miningCost = energyCost * 0.1; // kWh per hash
    const miningReward = btc.miningReward * btc.price;
    
    return {
      profitable: miningReward > miningCost,
      expectedProfit: miningReward - miningCost,
      difficulty: btc.difficulty,
      halvingImpact: btc.halvingCountdown < 365 ? 'High' : 'Low'
    };
  }

  analyzeInferenceTrading(marketData) {
    const inference = marketData.inference;
    const opportunities = [];

    Object.keys(inference).forEach(type => {
      const price = inference[type].current;
      const avgPrice = (inference[type].low + inference[type].high) / 2;
      
      if (price > avgPrice * 1.2) {
        opportunities.push({
          type,
          action: 'sell',
          price,
          premium: (price - avgPrice) / avgPrice
        });
      } else if (price < avgPrice * 0.8) {
        opportunities.push({
          type,
          action: 'buy',
          price,
          discount: (avgPrice - price) / avgPrice
        });
      }
    });

    return {
      opportunities,
      totalOpportunities: opportunities.length
    };
  }

  analyzeBatteryStorage(marketData) {
    const locations = marketData.energy;
    const storageOpportunities = [];

    locations.forEach(location => {
      const hour = new Date().getHours();
      const isPeak = hour >= 6 && hour <= 22;
      
      if (!isPeak && location.energyPrice < 0.08) {
        // Good time to store energy
        storageOpportunities.push({
          location: location.name,
          action: 'store',
          price: location.energyPrice,
          expectedReturn: 0.15 // 15% return during peak
        });
      } else if (isPeak && location.energyPrice > 0.12) {
        // Good time to sell stored energy
        storageOpportunities.push({
          location: location.name,
          action: 'sell',
          price: location.energyPrice,
          expectedReturn: 0.20 // 20% return
        });
      }
    });

    return {
      opportunities: storageOpportunities,
      totalOpportunities: storageOpportunities.length
    };
  }

  makeDecision(analysis, marketData) {
    const decisions = [];
    const budget = portfolio.cash * 0.1; // Use 10% of portfolio per decision

    // Energy arbitrage
    if (analysis.energyArbitrage.opportunity) {
      decisions.push({
        type: 'energy_arbitrage',
        action: 'buy_energy',
        location: analysis.energyArbitrage.buyLocation.id,
        amount: budget / analysis.energyArbitrage.buyLocation.energyPrice,
        expectedProfit: analysis.energyArbitrage.expectedProfit,
        confidence: 0.8
      });
    }

    // Bitcoin mining
    if (analysis.bitcoinMining.profitable) {
      decisions.push({
        type: 'bitcoin_mining',
        action: 'allocate_compute',
        amount: budget * 0.5,
        expectedProfit: analysis.bitcoinMining.expectedProfit,
        confidence: 0.7
      });
    }

    // Inference trading
    analysis.inferenceTrading.opportunities.forEach(opp => {
      if (opp.action === 'buy' && opp.discount > 0.15) {
        decisions.push({
          type: 'inference_trading',
          action: 'buy_compute',
          computeType: opp.type,
          amount: budget * 0.3,
          expectedProfit: opp.discount * 100,
          confidence: 0.6
        });
      }
    });

    // Battery storage
    analysis.batteryStorage.opportunities.forEach(opp => {
      if (opp.action === 'store' && opp.expectedReturn > 0.1) {
        decisions.push({
          type: 'battery_storage',
          action: 'store_energy',
          location: opp.location,
          amount: budget * 0.2,
          expectedProfit: opp.expectedReturn * 100,
          confidence: 0.7
        });
      }
    });

    return decisions;
  }
}

// Initialize market simulator and agents
const marketSimulator = new MarketSimulator();

// Initialize market data immediately
marketData = marketSimulator.getMarketData();

// Create AI agents with different strategies
aiAgents = [
  new TradingAgent('conservative', 'low-risk'),
  new TradingAgent('aggressive', 'high-risk'),
  new TradingAgent('balanced', 'medium-risk')
];

// Update market data every 30 seconds
cron.schedule('*/30 * * * * *', () => {
  marketSimulator.updateEnergyPrices();
  marketSimulator.updateBitcoinData();
  marketSimulator.updateInferencePrices();
  
  marketData = marketSimulator.getMarketData();
  
  // AI agents make decisions
  aiAgents.forEach(agent => {
    const decisions = agent.analyzeMarket(marketData);
    if (decisions.length > 0) {
      executeDecisions(decisions);
    }
  });
  
  // Broadcast updates
  io.emit('market_update', marketData);
  io.emit('portfolio_update', portfolio);
  io.emit('trading_update', tradingHistory.slice(-10));
});

function executeDecisions(decisions) {
  decisions.forEach(decision => {
    const trade = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...decision,
      executed: true
    };
    
    // Simulate trade execution
    switch (decision.type) {
      case 'energy_arbitrage':
        if (portfolio.cash >= decision.amount * marketData.energy.find(l => l.id === decision.location).energyPrice) {
          portfolio.cash -= decision.amount * marketData.energy.find(l => l.id === decision.location).energyPrice;
          portfolio.energy += decision.amount;
        }
        break;
      case 'bitcoin_mining':
        if (portfolio.cash >= decision.amount) {
          portfolio.cash -= decision.amount;
          portfolio.compute += decision.amount;
          // Simulate mining rewards
          const miningReward = decision.amount * 0.001; // 0.1% return
          portfolio.bitcoin += miningReward;
        }
        break;
      case 'inference_trading':
        if (portfolio.cash >= decision.amount) {
          portfolio.cash -= decision.amount;
          portfolio.compute += decision.amount;
        }
        break;
      case 'battery_storage':
        if (portfolio.cash >= decision.amount) {
          portfolio.cash -= decision.amount;
          portfolio.energy += decision.amount;
        }
        break;
    }
    
    tradingHistory.push(trade);
  });
  
  // Update total portfolio value
  portfolio.totalValue = portfolio.cash + 
    (portfolio.bitcoin * marketData.bitcoin.price) + 
    (portfolio.energy * 0.1) + 
    (portfolio.compute * 0.05);
}

// API Routes
app.get('/api/market', (req, res) => {
  res.json(marketData);
});

app.get('/api/portfolio', (req, res) => {
  res.json(portfolio);
});

app.get('/api/trading-history', (req, res) => {
  res.json(tradingHistory);
});

app.get('/api/agents', (req, res) => {
  res.json(aiAgents.map(agent => ({
    id: agent.id,
    strategy: agent.strategy,
    performance: agent.performance,
    recentDecisions: agent.decisions.slice(-5)
  })));
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial data
  socket.emit('market_update', marketData);
  socket.emit('portfolio_update', portfolio);
  socket.emit('trading_update', tradingHistory.slice(-10));
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 