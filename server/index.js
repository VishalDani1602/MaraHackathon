const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');

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

// Realistic 2025 Bitcoin price data (current ~$95,000)
let bitcoinPrice = 95000;
let bitcoinPriceHistory = [];

// Generate historical Bitcoin price data (last 30 days)
const generateBitcoinHistory = () => {
  const history = [];
  const basePrice = 95000;
  let currentPrice = basePrice;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Realistic daily volatility (±5%)
    const change = (Math.random() - 0.5) * 0.1;
    currentPrice *= (1 + change);
    currentPrice = Math.max(75000, Math.min(120000, currentPrice)); // Realistic 2025 bounds
    
    history.push({
      price: currentPrice,
      timestamp: date
    });
  }
  
  return history;
};

// Energy contracts with private companies (2025 realistic fixed prices for MARA-scale)
const energyContracts = {
  'texas': { 
    contractPrice: 0.065, 
    company: 'Texas Energy Co', 
    term: '2 years', 
    signedDate: '2024-03-15',
    capacity: 500000, // 500 MW capacity
    monthlyCommitment: 360000000 // 360 GWh/month
  },
  'california': { 
    contractPrice: 0.085, 
    company: 'CalPower Solutions', 
    term: '3 years', 
    signedDate: '2024-06-20',
    capacity: 300000, // 300 MW capacity
    monthlyCommitment: 216000000 // 216 GWh/month
  },
  'newyork': { 
    contractPrice: 0.078, 
    company: 'Empire Energy', 
    term: '2 years', 
    signedDate: '2024-09-10',
    capacity: 250000, // 250 MW capacity
    monthlyCommitment: 180000000 // 180 GWh/month
  },
  'florida': { 
    contractPrice: 0.072, 
    company: 'Sunshine Power', 
    term: '1 year', 
    signedDate: '2024-12-01',
    capacity: 200000, // 200 MW capacity
    monthlyCommitment: 144000000 // 144 GWh/month
  },
  'georgia': { 
    contractPrice: 0.068, 
    company: 'Georgia Power', 
    term: '3 years', 
    signedDate: '2024-11-15',
    capacity: 350000, // 350 MW capacity
    monthlyCommitment: 252000000 // 252 GWh/month
  },
  'tennessee': { 
    contractPrice: 0.062, 
    company: 'TVA Energy', 
    term: '2 years', 
    signedDate: '2024-08-20',
    capacity: 400000, // 400 MW capacity
    monthlyCommitment: 288000000 // 288 GWh/month
  }
};

// Device inventory with MARA-scale 2025 realistic specifications
let devices = [
  // Texas Operations (Largest)
  {
    id: 'btc-texas-1',
    name: 'Bitcoin Mining Farm - Texas A',
    type: 'bitcoin_miner',
    location: 'texas',
    hashRate: 5000, // 5 PH/s
    powerConsumption: 150000, // 150 MW
    efficiency: 15.5, // J/TH
    status: 'active',
    revenue: 0,
    cost: 0,
    profit: 0,
    uptime: 98.5,
    temperature: 72,
    lastUpdate: new Date(),
    purchaseDate: '2024-08-15',
    purchasePrice: 75000000,
    minerCount: 25000 // 25,000 S21 miners
  },
  {
    id: 'btc-texas-2',
    name: 'Bitcoin Mining Farm - Texas B',
    type: 'bitcoin_miner',
    location: 'texas',
    hashRate: 4000, // 4 PH/s
    powerConsumption: 120000, // 120 MW
    efficiency: 15.5, // J/TH
    status: 'active',
    revenue: 0,
    cost: 0,
    profit: 0,
    uptime: 97.2,
    temperature: 75,
    lastUpdate: new Date(),
    purchaseDate: '2024-09-20',
    purchasePrice: 60000000,
    minerCount: 20000 // 20,000 S21 miners
  },
  {
    id: 'ai-texas-1',
    name: 'AI Compute Center - Texas',
    type: 'ai_server',
    location: 'texas',
    gpuCount: 2000, // 2,000 H200 GPUs
    powerConsumption: 800000, // 800 MW
    efficiency: 88.5, // Utilization %
    status: 'active',
    revenue: 0,
    cost: 0,
    profit: 0,
    uptime: 99.1,
    temperature: 68,
    lastUpdate: new Date(),
    purchaseDate: '2024-11-10',
    purchasePrice: 11250000000, // $11.25B
    serverCount: 250 // 250 servers
  },
  {
    id: 'battery-texas-1',
    name: 'Grid Battery Complex - Texas',
    type: 'battery',
    location: 'texas',
    capacity: 100000, // 100 MW
    energyCapacity: 400000, // 400 MWh
    powerConsumption: 0,
    efficiency: 94.2, // Round-trip efficiency
    status: 'standby',
    revenue: 0,
    cost: 0,
    profit: 0,
    uptime: 100,
    temperature: 45,
    lastUpdate: new Date(),
    purchaseDate: '2024-07-15',
    purchasePrice: 170000000000, // $170B
    batteryCount: 20000 // 20,000 battery units
  },

  // California Operations
  {
    id: 'btc-california-1',
    name: 'Bitcoin Mining Farm - California',
    type: 'bitcoin_miner',
    location: 'california',
    hashRate: 3000, // 3 PH/s
    powerConsumption: 90000, // 90 MW
    efficiency: 15.5, // J/TH
    status: 'active',
    revenue: 0,
    cost: 0,
    profit: 0,
    uptime: 96.8,
    temperature: 71,
    lastUpdate: new Date(),
    purchaseDate: '2024-10-05',
    purchasePrice: 45000000,
    minerCount: 15000 // 15,000 S21 miners
  },
  {
    id: 'ai-california-1',
    name: 'AI Compute Center - California',
    type: 'ai_server',
    location: 'california',
    gpuCount: 1500, // 1,500 H200 GPUs
    powerConsumption: 600000, // 600 MW
    efficiency: 85.2, // Utilization %
    status: 'active',
    revenue: 0,
    cost: 0,
    profit: 0,
    uptime: 96.8,
    temperature: 71,
    lastUpdate: new Date(),
    purchaseDate: '2024-10-05',
    purchasePrice: 8437500000, // $8.44B
    serverCount: 188 // 188 servers
  },

  // New York Operations
  {
    id: 'btc-newyork-1',
    name: 'Bitcoin Mining Farm - New York',
    type: 'bitcoin_miner',
    location: 'newyork',
    hashRate: 2500, // 2.5 PH/s
    powerConsumption: 75000, // 75 MW
    efficiency: 15.5, // J/TH
    status: 'active',
    revenue: 0,
    cost: 0,
    profit: 0,
    uptime: 97.5,
    temperature: 70,
    lastUpdate: new Date(),
    purchaseDate: '2024-09-15',
    purchasePrice: 37500000,
    minerCount: 12500 // 12,500 S21 miners
  },
  {
    id: 'ai-newyork-1',
    name: 'AI Compute Center - New York',
    type: 'ai_server',
    location: 'newyork',
    gpuCount: 1200, // 1,200 H200 GPUs
    powerConsumption: 480000, // 480 MW
    efficiency: 87.1, // Utilization %
    status: 'active',
    revenue: 0,
    cost: 0,
    profit: 0,
    uptime: 98.2,
    temperature: 69,
    lastUpdate: new Date(),
    purchaseDate: '2024-11-20',
    purchasePrice: 6750000000, // $6.75B
    serverCount: 150 // 150 servers
  },

  // Florida Operations
  {
    id: 'btc-florida-1',
    name: 'Bitcoin Mining Farm - Florida',
    type: 'bitcoin_miner',
    location: 'florida',
    hashRate: 2000, // 2 PH/s
    powerConsumption: 60000, // 60 MW
    efficiency: 15.5, // J/TH
    status: 'active',
    revenue: 0,
    cost: 0,
    profit: 0,
    uptime: 98.1,
    temperature: 73,
    lastUpdate: new Date(),
    purchaseDate: '2024-08-30',
    purchasePrice: 30000000,
    minerCount: 10000 // 10,000 S21 miners
  },

  // Georgia Operations
  {
    id: 'btc-georgia-1',
    name: 'Bitcoin Mining Farm - Georgia',
    type: 'bitcoin_miner',
    location: 'georgia',
    hashRate: 3500, // 3.5 PH/s
    powerConsumption: 105000, // 105 MW
    efficiency: 15.5, // J/TH
    status: 'active',
    revenue: 0,
    cost: 0,
    profit: 0,
    uptime: 97.8,
    temperature: 74,
    lastUpdate: new Date(),
    purchaseDate: '2024-09-10',
    purchasePrice: 52500000,
    minerCount: 17500 // 17,500 S21 miners
  },
  {
    id: 'ai-georgia-1',
    name: 'AI Compute Center - Georgia',
    type: 'ai_server',
    location: 'georgia',
    gpuCount: 800, // 800 H200 GPUs
    powerConsumption: 320000, // 320 MW
    efficiency: 86.3, // Utilization %
    status: 'active',
    revenue: 0,
    cost: 0,
    profit: 0,
    uptime: 97.9,
    temperature: 70,
    lastUpdate: new Date(),
    purchaseDate: '2024-10-15',
    purchasePrice: 4500000000, // $4.5B
    serverCount: 100 // 100 servers
  },

  // Tennessee Operations
  {
    id: 'btc-tennessee-1',
    name: 'Bitcoin Mining Farm - Tennessee',
    type: 'bitcoin_miner',
    location: 'tennessee',
    hashRate: 4000, // 4 PH/s
    powerConsumption: 120000, // 120 MW
    efficiency: 15.5, // J/TH
    status: 'active',
    revenue: 0,
    cost: 0,
    profit: 0,
    uptime: 98.3,
    temperature: 72,
    lastUpdate: new Date(),
    purchaseDate: '2024-08-25',
    purchasePrice: 60000000,
    minerCount: 20000 // 20,000 S21 miners
  },
  {
    id: 'battery-tennessee-1',
    name: 'Grid Battery Complex - Tennessee',
    type: 'battery',
    location: 'tennessee',
    capacity: 80000, // 80 MW
    energyCapacity: 320000, // 320 MWh
    powerConsumption: 0,
    efficiency: 93.8, // Round-trip efficiency
    status: 'standby',
    revenue: 0,
    cost: 0,
    profit: 0,
    uptime: 100,
    temperature: 42,
    lastUpdate: new Date(),
    purchaseDate: '2024-08-30',
    purchasePrice: 136000000000, // $136B
    batteryCount: 16000 // 16,000 battery units
  }
];

// Market data with 2025 realistic values for MARA-scale
let marketData = {
  bitcoin: {
    price: bitcoinPrice,
    change24h: 2.5,
    volume: 45000000000, // $45B daily volume
    marketCap: 1850000000000, // $1.85T market cap
    difficulty: 850000000000000, // Current network difficulty
    networkHashRate: 850000000000000, // EH/s
    blockReward: 3.125, // Current block reward in BTC
    nextHalving: '2027-04-20', // Next halving date
    blocksUntilHalving: 105000, // Approximate blocks until next halving
    dailyBlocks: 144, // Blocks per day
    dailyReward: 450 // Daily BTC reward (3.125 * 144)
  },
  energy: [
    {
      id: 'texas',
      name: 'Texas (ERCOT)',
      currentRate: 0.082, // $/kWh (2025 rates)
      isPeakHour: false,
      demand: 85, // GW
      supply: 92, // GW
      renewablePercentage: 35,
      gridStability: 95
    },
    {
      id: 'california',
      name: 'California (CAISO)',
      currentRate: 0.112, // $/kWh (2025 rates)
      isPeakHour: true,
      demand: 92, // GW
      supply: 88, // GW
      renewablePercentage: 45,
      gridStability: 88
    },
    {
      id: 'newyork',
      name: 'New York (NYISO)',
      currentRate: 0.095, // $/kWh (2025 rates)
      isPeakHour: false,
      demand: 78, // GW
      supply: 85, // GW
      renewablePercentage: 28,
      gridStability: 92
    },
    {
      id: 'florida',
      name: 'Florida (FPL)',
      currentRate: 0.089, // $/kWh (2025 rates)
      isPeakHour: false,
      demand: 82, // GW
      supply: 90, // GW
      renewablePercentage: 22,
      gridStability: 96
    },
    {
      id: 'georgia',
      name: 'Georgia (Southern Co)',
      currentRate: 0.075, // $/kWh (2025 rates)
      isPeakHour: false,
      demand: 75, // GW
      supply: 82, // GW
      renewablePercentage: 18,
      gridStability: 94
    },
    {
      id: 'tennessee',
      name: 'Tennessee (TVA)',
      currentRate: 0.068, // $/kWh (2025 rates)
      isPeakHour: false,
      demand: 68, // GW
      supply: 75, // GW
      renewablePercentage: 25,
      gridStability: 97
    }
  ],
  aiCompute: {
    h200: { price: 4.2, demand: 98, availability: 15 }, // $/hour per GPU
    h100: { price: 3.1, demand: 95, availability: 25 },
    a100: { price: 2.2, demand: 87, availability: 40 },
    v100: { price: 1.1, demand: 72, availability: 60 }
  }
};

// Portfolio with MARA-scale 2025 values
let portfolio = {
  totalValue: 45000000000, // $45B total portfolio (MARA-scale)
  cash: 2500000000, // $2.5B cash
  bitcoin: 8500, // BTC holdings (6% of daily reward * 365 days * 4 years)
  bitcoinValue: 817500000, // $817.5M in BTC
  energyContracts: 8500000000, // $8.5B contract value
  devices: 35000000000, // $35B device value
  dailyRevenue: 0,
  dailyCost: 0,
  dailyProfit: 0,
  monthlyProfit: 0,
  totalInvested: 38000000000, // $38B total invested
  totalReturn: 18.4, // %
  networkShare: 6.0, // % of total Bitcoin network
  totalHashRate: 51000000000000, // 51 EH/s (6% of 850 EH/s)
  totalPowerConsumption: 2800000, // 2.8 GW total power
  totalGPUs: 5500, // 5,500 H200 GPUs
  totalBatteryCapacity: 180000, // 180 MW battery capacity
  bitcoinHoldings: 8500, // Accumulated Bitcoin holdings
  dailyBTCAccumulation: 0, // Daily Bitcoin accumulation
  totalBTCAccumulated: 8500 // Total Bitcoin accumulated
};

// Operations history
let operations = [];

// Generate some historical operations
const generateHistoricalOperations = () => {
  const historicalOps = [];
  const opTypes = ['energy_sell', 'bitcoin_mine', 'ai_compute', 'battery_arbitrage'];
  const locations = ['texas', 'california', 'newyork', 'florida'];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const opType = opTypes[Math.floor(Math.random() * opTypes.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    let revenue, cost, profit;
    
    switch (opType) {
      case 'energy_sell':
        revenue = 800 + Math.random() * 400;
        cost = 500 + Math.random() * 200;
        profit = revenue - cost;
        break;
      case 'bitcoin_mine':
        revenue = 1200 + Math.random() * 600;
        cost = 800 + Math.random() * 300;
        profit = revenue - cost;
        break;
      case 'ai_compute':
        revenue = 2000 + Math.random() * 1000;
        cost = 1200 + Math.random() * 500;
        profit = revenue - cost;
        break;
      case 'battery_arbitrage':
        revenue = 600 + Math.random() * 300;
        cost = 400 + Math.random() * 200;
        profit = revenue - cost;
        break;
    }
    
    historicalOps.push({
      id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: opType,
      location: location,
      description: `${opType.replace('_', ' ')} operation in ${location}`,
      amount: Math.floor(Math.random() * 1000) + 100,
      revenue: revenue,
      cost: cost,
      profit: profit,
      timestamp: date,
      status: 'completed'
    });
  }
  
  return historicalOps;
};

// Initialize historical data
bitcoinPriceHistory = generateBitcoinHistory();
operations = generateHistoricalOperations();

// Update Bitcoin price from AI prediction
const updateBitcoinPrice = async () => {
  // Use AI to predict price instead of random walk
  const predictedPrice = await predictBitcoinPrice(bitcoinPriceHistory);
  
  // Add some noise to make it realistic
  const noise = (Math.random() - 0.5) * 0.02; // ±1% noise
  bitcoinPrice = predictedPrice * (1 + noise);
  bitcoinPrice = Math.max(75000, Math.min(120000, bitcoinPrice)); // Realistic 2025 bounds
  
  bitcoinPriceHistory.push({
    price: bitcoinPrice,
    timestamp: new Date()
  });
  
  // Keep only last 100 data points
  if (bitcoinPriceHistory.length > 100) {
    bitcoinPriceHistory.shift();
  }
  
  marketData.bitcoin.price = bitcoinPrice;
  marketData.bitcoin.change24h = (Math.random() - 0.5) * 8; // ±4% 24h change
  marketData.bitcoin.volume = 40000000000 + Math.random() * 10000000000; // $40-50B daily
};

// Update energy market data with AI forecasting
const updateEnergyMarket = () => {
  marketData.energy.forEach(location => {
    // Use AI to forecast demand
    const historicalDemand = location.demand;
    const weatherData = { temperature: 70 + Math.random() * 20 }; // Simulated weather
    const forecastedDemand = forecastEnergyDemand(location.id, historicalDemand, weatherData);
    
    // Simulate peak hours (6-9 AM and 6-9 PM)
    const hour = new Date().getHours();
    const isPeak = (hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 21);
    
    location.isPeakHour = isPeak;
    location.demand = forecastedDemand;
    
    if (isPeak) {
      // Peak hour pricing (2025 rates are higher)
      location.currentRate = location.currentRate * (0.98 + Math.random() * 0.25); // 2-27% increase
    } else {
      // Off-peak pricing
      location.currentRate = location.currentRate * (0.85 + Math.random() * 0.20); // 15% decrease to 20% increase
    }
    
    // Keep rates within realistic 2025 bounds
    location.currentRate = Math.max(0.055, Math.min(0.18, location.currentRate));
    
    // Update supply with realistic variations
    location.supply = Math.max(70, Math.min(105, location.supply + (Math.random() - 0.5) * 6));
    
    // Update renewable percentage (trending up in 2025)
    location.renewablePercentage = Math.max(20, Math.min(60, location.renewablePercentage + (Math.random() - 0.5) * 2));
  });
};

// Update AI compute pricing with sentiment analysis
const updateAICompute = () => {
  // Simulate market sentiment data
  const newsData = [
    'ai compute demand surge continues',
    'gpu shortage affects major tech companies',
    'new ai models require more compute power'
  ];
  const socialData = [
    'ai compute prices going up',
    'gpu market tight supply',
    'ai boom driving compute demand'
  ];
  
  const sentiment = analyzeMarketSentiment(newsData, socialData);
  
  // Adjust pricing based on sentiment
  const sentimentMultiplier = sentiment === 'positive' ? 1.1 : sentiment === 'negative' ? 0.9 : 1.0;
  
  // Simulate realistic AI compute demand fluctuations
  const baseDemand = 85; // Base demand percentage
  const fluctuation = Math.random() * 20 - 10; // ±10% fluctuation
  const newDemand = Math.max(70, Math.min(98, baseDemand + fluctuation));
  
  // Update all GPU types with realistic values
  marketData.aiCompute.h200.demand = Math.round(newDemand);
  marketData.aiCompute.h100.demand = Math.round(newDemand - 5);
  marketData.aiCompute.a100.demand = Math.round(newDemand - 10);
  marketData.aiCompute.v100.demand = Math.round(newDemand - 15);
  
  // Update availability based on demand
  marketData.aiCompute.h200.availability = Math.max(5, 100 - newDemand);
  marketData.aiCompute.h100.availability = Math.max(10, 100 - (newDemand - 5));
  marketData.aiCompute.a100.availability = Math.max(20, 100 - (newDemand - 10));
  marketData.aiCompute.v100.availability = Math.max(30, 100 - (newDemand - 15));
  
  // Update prices based on demand and sentiment
  const demandMultiplier = newDemand / 100;
  marketData.aiCompute.h200.price = Math.round((3.5 + demandMultiplier * 2 + (Math.random() - 0.5) * 0.5) * 10) / 10 * sentimentMultiplier;
  marketData.aiCompute.h100.price = Math.round((2.5 + demandMultiplier * 1.5 + (Math.random() - 0.5) * 0.3) * 10) / 10 * sentimentMultiplier;
  marketData.aiCompute.a100.price = Math.round((1.8 + demandMultiplier * 1 + (Math.random() - 0.5) * 0.2) * 10) / 10 * sentimentMultiplier;
  marketData.aiCompute.v100.price = Math.round((0.8 + demandMultiplier * 0.5 + (Math.random() - 0.5) * 0.1) * 10) / 10 * sentimentMultiplier;
};

// Update device performance every 15 seconds with AI optimization
function updateDevicePerformance() {
  // Use AI to optimize device allocation
  const optimizedDevices = optimizeDeviceAllocation(devices, marketData, energyContracts);
  
  optimizedDevices.forEach(device => {
    const contract = energyContracts[device.location];
    const energyRate = contract ? contract.contractPrice : 0.075; // Default rate
    
    if (device.type === 'bitcoin_miner') {
      // Calculate mining revenue (6% of network share)
      const dailyBitcoinReward = 450; // Total daily BTC reward (6.25 BTC per block * 144 blocks per day)
      const networkShare = 0.06; // 6% of network
      const deviceShare = device.hashRate / 51000; // Device's share of our 51 EH/s
      const dailyBTC = dailyBitcoinReward * networkShare * deviceShare;
      const btcPrice = marketData.bitcoin.price;
      
      device.revenue = dailyBTC * btcPrice / 24; // Hourly revenue
      device.cost = (device.powerConsumption * energyRate); // Hourly energy cost (MW * $/kWh = $/hour)
      device.profit = device.revenue - device.cost;
      
      // Apply AI recommendations
      if (device.recommendedStatus) {
        device.aiRecommendation = device.recommendedStatus;
        device.aiExpectedProfit = device.expectedProfit || device.profit;
        device.aiConfidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
      }
      
      // Update uptime and temperature
      device.uptime = Math.max(95, Math.min(99.5, device.uptime + (Math.random() - 0.5) * 0.5));
      device.temperature = Math.max(65, Math.min(80, device.temperature + (Math.random() - 0.5) * 2));
      
    } else if (device.type === 'ai_server') {
      // Calculate AI compute revenue
      const gpuPrice = marketData.aiCompute.h200.price;
      const utilization = device.efficiency / 100;
      const hourlyRevenue = device.gpuCount * gpuPrice * utilization;
      
      device.revenue = hourlyRevenue;
      device.cost = (device.powerConsumption * energyRate); // Hourly energy cost (MW * $/kWh = $/hour)
      device.profit = device.revenue - device.cost;
      
      // Apply AI recommendations
      if (device.recommendedStatus) {
        device.aiRecommendation = device.recommendedStatus;
        device.aiExpectedProfit = device.expectedProfit || device.profit;
        device.aiConfidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
      }
      
      // Update efficiency and temperature
      device.efficiency = Math.max(80, Math.min(95, device.efficiency + (Math.random() - 0.5) * 2));
      device.temperature = Math.max(60, Math.min(75, device.temperature + (Math.random() - 0.5) * 1.5));
      
    } else if (device.type === 'battery') {
      // Battery systems earn from grid arbitrage
      const gridRate = marketData.energy.find(e => e.id === device.location)?.currentRate || 0.08;
      const arbitrageOpportunity = gridRate - energyRate;
      
      if (arbitrageOpportunity > 0.01) { // Only if profitable
        device.revenue = device.capacity * arbitrageOpportunity * 0.5; // 50% utilization
        device.cost = 0; // No additional cost for arbitrage
        device.profit = device.revenue;
        device.status = 'active';
      } else {
        device.revenue = 0;
        device.cost = 0;
        device.profit = 0;
        device.status = 'standby';
      }
      
      // Apply AI recommendations
      if (device.recommendedStatus) {
        device.aiRecommendation = device.recommendedStatus;
        device.aiExpectedProfit = device.expectedProfit || device.profit;
        device.aiConfidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
      }
      
      // Update efficiency
      device.efficiency = Math.max(92, Math.min(96, device.efficiency + (Math.random() - 0.5) * 0.3));
    }
    
    device.lastUpdate = new Date();
  });
}

// Calculate portfolio performance
function updatePortfolio() {
  let totalDailyRevenue = 0;
  let totalDailyCost = 0;
  
  // Calculate revenue and cost from devices only (no double counting)
  devices.forEach(device => {
    totalDailyRevenue += device.revenue * 24; // Convert hourly to daily
    totalDailyCost += device.cost * 24; // Convert hourly to daily
  });
  
  // Add energy arbitrage revenue from batteries
  const batteryRevenue = devices.filter(d => d.type === 'battery' && d.status === 'active')
    .reduce((sum, d) => sum + (d.revenue * 24), 0);
  totalDailyRevenue += batteryRevenue;
  
  // Calculate daily Bitcoin accumulation
  const miningDevices = devices.filter(d => d.type === 'bitcoin_miner');
  const dailyMiningRevenue = miningDevices.reduce((sum, d) => sum + (d.revenue * 24), 0);
  const dailyBTCAccumulation = dailyMiningRevenue / marketData.bitcoin.price;
  
  // Update Bitcoin holdings (accumulate, don't sell)
  portfolio.bitcoinHoldings += dailyBTCAccumulation;
  
  portfolio.dailyRevenue = totalDailyRevenue;
  portfolio.dailyCost = totalDailyCost;
  portfolio.dailyProfit = totalDailyRevenue - totalDailyCost;
  portfolio.monthlyProfit = portfolio.dailyProfit * 30;
  
  // Update total portfolio value
  const deviceValue = devices.reduce((sum, device) => sum + device.purchasePrice, 0);
  const btcValue = portfolio.bitcoinHoldings * marketData.bitcoin.price;
  const contractValue = Object.values(energyContracts).reduce((sum, contract) => 
    sum + (contract.monthlyCommitment * contract.contractPrice * 12), 0);
  
  portfolio.devices = deviceValue;
  portfolio.bitcoinValue = btcValue;
  portfolio.energyContracts = contractValue;
  portfolio.totalValue = portfolio.cash + btcValue + contractValue + deviceValue;
  
  // Calculate total return
  portfolio.totalReturn = ((portfolio.totalValue - portfolio.totalInvested) / portfolio.totalInvested) * 100;
  
  // Add Bitcoin accumulation metrics
  portfolio.dailyBTCAccumulation = dailyBTCAccumulation;
  portfolio.totalBTCAccumulated = portfolio.bitcoinHoldings;
}

// Optimize operations
function optimizeOperations() {
  const operations = [];
  const timestamp = new Date();
  
  // Check each location for optimization opportunities
  Object.keys(energyContracts).forEach(location => {
    const contract = energyContracts[location];
    const gridRate = marketData.energy.find(e => e.id === location)?.currentRate || 0.08;
    const arbitrageOpportunity = gridRate - contract.contractPrice;
    
    // Find devices in this location
    const locationDevices = devices.filter(d => d.location === location);
    const miners = locationDevices.filter(d => d.type === 'bitcoin_miner');
    const aiServers = locationDevices.filter(d => d.type === 'ai_server');
    const batteries = locationDevices.filter(d => d.type === 'battery');
    
    // Calculate total power consumption
    const totalPower = locationDevices.reduce((sum, d) => sum + d.powerConsumption, 0);
    const contractCapacity = contract.capacity;
    const excessPower = contractCapacity - totalPower;
    
    // Strategy 1: Always mine Bitcoin when profitable (accumulate the asset)
    if (miners.length > 0) {
      const btcPrice = marketData.bitcoin.price;
      const miningProfitability = miners.every(miner => miner.profit > 0);
      
      if (miningProfitability) {
        operations.push({
          id: `op-${Date.now()}-${Math.random()}`,
          type: 'mining_optimization',
          location: location,
          description: `Bitcoin mining profitable - accumulating BTC at $${btcPrice.toFixed(0)}`,
          revenue: miners.reduce((sum, m) => sum + m.revenue, 0),
          timestamp: timestamp,
          status: 'active'
        });
      } else {
        // Even if mining is unprofitable, we might still mine for long-term asset accumulation
        // but optimize energy usage
        operations.push({
          id: `op-${Date.now()}-${Math.random()}`,
          type: 'mining_optimization',
          location: location,
          description: `Mining at slight loss - accumulating BTC for long-term value`,
          revenue: miners.reduce((sum, m) => sum + m.revenue, 0),
          timestamp: timestamp,
          status: 'monitoring'
        });
      }
    }
    
    // Strategy 2: Sell excess energy to grid and use proceeds to buy Bitcoin
    if (arbitrageOpportunity > 0.01) { // Significant arbitrage opportunity
      if (excessPower > 0) {
        const energySaleRevenue = excessPower * arbitrageOpportunity * 1000; // $/hour
        const btcToBuy = energySaleRevenue / marketData.bitcoin.price; // BTC we can buy with energy sale proceeds
        
        operations.push({
          id: `op-${Date.now()}-${Math.random()}`,
          type: 'energy_sale',
          location: location,
          description: `Selling ${excessPower.toFixed(0)} MW excess energy to grid at $${gridRate.toFixed(3)}/kWh - can buy ${btcToBuy.toFixed(6)} BTC`,
          revenue: energySaleRevenue,
          timestamp: timestamp,
          status: 'active'
        });
      }
      
      // Optimize battery operations for energy arbitrage
      batteries.forEach(battery => {
        if (battery.status === 'standby') {
          battery.status = 'active';
          const batteryRevenue = battery.capacity * arbitrageOpportunity * 1000;
          const btcToBuy = batteryRevenue / marketData.bitcoin.price;
          
          operations.push({
            id: `op-${Date.now()}-${Math.random()}`,
            type: 'battery_arbitrage',
            location: location,
            description: `Battery arbitrage - selling ${battery.capacity.toFixed(0)} MW to grid, can buy ${btcToBuy.toFixed(6)} BTC`,
            revenue: batteryRevenue,
            timestamp: timestamp,
            status: 'active'
          });
        }
      });
      
    } else if (arbitrageOpportunity < -0.005) { // Grid price lower than contract
      // Reduce energy sales, focus on mining and AI compute
      operations.push({
        id: `op-${Date.now()}-${Math.random()}`,
        type: 'energy_optimization',
        location: location,
        description: `Grid price below contract - focusing on mining and AI compute`,
        revenue: 0,
        timestamp: timestamp,
        status: 'active'
      });
      
      // Put batteries in standby
      batteries.forEach(battery => {
        if (battery.status === 'active') {
          battery.status = 'standby';
        }
      });
    }
    
    // Strategy 3: AI compute optimization (always profitable when demand is high)
    if (aiServers.length > 0) {
      const aiDemand = marketData.aiCompute.h200.demand;
      const aiPrice = marketData.aiCompute.h200.price;
      
      if (aiDemand > 90) { // High demand
        const aiRevenue = aiServers.reduce((sum, server) => {
          const utilization = server.efficiency / 100;
          return sum + (server.gpuCount * aiPrice * utilization);
        }, 0);
        
        operations.push({
          id: `op-${Date.now()}-${Math.random()}`,
          type: 'ai_optimization',
          location: location,
          description: `High AI compute demand (${aiDemand.toFixed(1)}%) - maximizing GPU utilization at $${aiPrice}/hr`,
          revenue: aiRevenue,
          timestamp: timestamp,
          status: 'active'
        });
      }
    }
  });
  
  // Add network-wide operations
  const totalHashRate = devices.filter(d => d.type === 'bitcoin_miner')
    .reduce((sum, d) => sum + d.hashRate, 0);
  const globalHashRate = 850; // 850 EH/s global network
  const totalHashRateEH = totalHashRate / 1000; // Convert PH/s to EH/s
  const networkPercentage = (totalHashRateEH / globalHashRate) * 100;
  
  // Calculate total Bitcoin accumulation
  const totalMiningRevenue = devices.filter(d => d.type === 'bitcoin_miner')
    .reduce((sum, d) => sum + d.revenue, 0) * 24; // Daily mining revenue
  const btcPrice = marketData.bitcoin.price;
  const dailyBTCAccumulation = totalMiningRevenue / btcPrice;
  
  operations.push({
    id: `op-${Date.now()}-${Math.random()}`,
    type: 'network_status',
    location: 'all',
    description: `Network: ${totalHashRate.toFixed(1)} PH/s (${networkPercentage.toFixed(2)}% of global) | Daily BTC accumulation: ${dailyBTCAccumulation.toFixed(4)} BTC`,
    revenue: 0,
    timestamp: timestamp,
    status: 'active'
  });
  
  // Keep only last 20 operations
  if (operations.length > 20) {
    operations.splice(0, operations.length - 20);
  }
  
  return operations;
}

// Update all data every 15 seconds with AI integration
setInterval(async () => {
  try {
    await updateBitcoinPrice(); // Now async
    updateEnergyMarket();
    updateAICompute();
    updateDevicePerformance();
    updatePortfolio();
    
    // Get optimized operations
    const newOperations = optimizeOperations();
    operations.length = 0; // Clear existing operations
    operations.push(...newOperations);
    
    // Emit updated data to connected clients
    io.emit('dataUpdate', {
      portfolio,
      devices,
      marketData,
      operations,
      energyContracts,
      aiModels: {
        sentiment: analyzeMarketSentiment(['market update'], ['trading activity']),
        predictions: {
          bitcoinPrice: await predictBitcoinPrice(bitcoinPriceHistory),
          energyDemand: forecastEnergyDemand('texas', 85, { temperature: 75 })
        }
      }
    });
  } catch (error) {
    console.error('Error in update interval:', error);
  }
}, 15000);

// API Routes
app.get('/api/market-data', (req, res) => {
  res.json(marketData);
});

app.get('/api/portfolio', (req, res) => {
  res.json(portfolio);
});

app.get('/api/devices', (req, res) => {
  res.json(devices);
});

app.get('/api/operations', (req, res) => {
  res.json(operations);
});

app.get('/api/energy-contracts', (req, res) => {
  res.json(energyContracts);
});

// New AI-specific API endpoints
app.get('/api/ai-insights', async (req, res) => {
  try {
    const insights = {
      bitcoinPrediction: await predictBitcoinPrice(bitcoinPriceHistory),
      energyDemandForecast: forecastEnergyDemand('texas', 85, { temperature: 75 }),
      marketSentiment: analyzeMarketSentiment(['market update'], ['trading activity']),
      deviceOptimization: devices.map(device => ({
        id: device.id,
        recommendation: device.aiRecommendation || 'maintain',
        expectedProfit: device.aiExpectedProfit || device.profit || 0,
        confidence: device.aiConfidence || 0.8
      })),
      portfolioOptimization: {
        recommendedStrategy: portfolio.dailyProfit > 1000000 ? 'aggressive' : 'conservative',
        riskLevel: 'medium',
        expectedReturn: portfolio.dailyProfit * 30 * 12 // Annual projection
      }
    };
    res.json(insights);
  } catch (error) {
    console.error('Error getting AI insights:', error);
    // Return fallback data instead of error
    res.json({
      bitcoinPrediction: bitcoinPrice,
      energyDemandForecast: 85,
      marketSentiment: 'neutral',
      deviceOptimization: devices.map(device => ({
        id: device.id,
        recommendation: 'maintain',
        expectedProfit: device.profit || 0,
        confidence: 0.8
      })),
      portfolioOptimization: {
        recommendedStrategy: 'balanced',
        riskLevel: 'medium',
        expectedReturn: portfolio.dailyProfit * 30 * 12
      }
    });
  }
});

app.get('/api/ai-predictions', async (req, res) => {
  try {
    const predictions = {
      bitcoin: {
        nextHour: await predictBitcoinPrice(bitcoinPriceHistory),
        nextDay: await predictBitcoinPrice(bitcoinPriceHistory) * (1 + (Math.random() - 0.5) * 0.1),
        trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
        confidence: Math.random() * 0.3 + 0.7
      },
      energy: {
        demand: forecastEnergyDemand('texas', 85, { temperature: 75 }),
        price: marketData.energy[0].currentRate * (1 + (Math.random() - 0.5) * 0.2),
        arbitrageOpportunity: Math.random() * 0.05
      },
      aiCompute: {
        demand: marketData.aiCompute.h200.demand,
        price: marketData.aiCompute.h200.price,
        availability: marketData.aiCompute.h200.availability
      }
    };
    res.json(predictions);
  } catch (error) {
    console.error('Error getting AI predictions:', error);
    // Return fallback data instead of error
    res.json({
      bitcoin: {
        nextHour: bitcoinPrice,
        nextDay: bitcoinPrice * 1.02,
        trend: 'neutral',
        confidence: 0.7
      },
      energy: {
        demand: 85,
        price: 0.08,
        arbitrageOpportunity: 0.02
      },
      aiCompute: {
        demand: 85,
        price: 4.2,
        availability: 15
      }
    });
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial data
  socket.emit('dataUpdate', {
    marketData,
    portfolio,
    devices,
    operations: operations.slice(0, 10),
    energyContracts
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Custom AI Models and Predictions (Pure JavaScript)
let aiModels = {
  pricePredictor: null,
  demandForecaster: null,
  optimizationEngine: null,
  sentimentAnalyzer: null
};

// Custom Neural Network Implementation
class SimpleNeuralNetwork {
  constructor(inputSize, hiddenSize, outputSize) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;
    
    // Initialize weights randomly
    this.weights1 = this.randomMatrix(inputSize, hiddenSize);
    this.weights2 = this.randomMatrix(hiddenSize, outputSize);
    this.bias1 = this.randomMatrix(1, hiddenSize);
    this.bias2 = this.randomMatrix(1, outputSize);
  }
  
  randomMatrix(rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < cols; j++) {
        matrix[i][j] = Math.random() * 2 - 1; // Random between -1 and 1
      }
    }
    return matrix;
  }
  
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  sigmoidDerivative(x) {
    return x * (1 - x);
  }
  
  forward(input) {
    // Input to hidden layer
    const hidden = this.multiplyMatrix(input, this.weights1);
    const hiddenWithBias = this.addMatrix(hidden, this.bias1);
    const hiddenActivated = hiddenWithBias.map(row => row.map(val => this.sigmoid(val)));
    
    // Hidden to output layer
    const output = this.multiplyMatrix(hiddenActivated, this.weights2);
    const outputWithBias = this.addMatrix(output, this.bias2);
    const outputActivated = outputWithBias.map(row => row.map(val => this.sigmoid(val)));
    
    return { hidden: hiddenActivated, output: outputActivated };
  }
  
  multiplyMatrix(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < b[0].length; j++) {
        result[i][j] = 0;
        for (let k = 0; k < b.length; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  }
  
  addMatrix(a, b) {
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
  }
  
  train(inputs, targets, learningRate = 0.1, epochs = 1000) {
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let i = 0; i < inputs.length; i++) {
        const input = [inputs[i]];
        const target = [targets[i]];
        
        // Forward pass
        const { hidden, output } = this.forward(input);
        
        // Backward pass (simplified)
        const outputError = this.subtractMatrix(target, output);
        const outputDelta = outputError.map(row => row.map(val => val * this.sigmoidDerivative(val)));
        
        // Update weights (simplified gradient descent)
        for (let j = 0; j < this.weights2.length; j++) {
          for (let k = 0; k < this.weights2[j].length; k++) {
            this.weights2[j][k] += learningRate * outputDelta[0][k] * hidden[0][j];
          }
        }
      }
    }
  }
  
  subtractMatrix(a, b) {
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
  }
  
  predict(input) {
    const { output } = this.forward([input]);
    return output[0];
  }
}

// Custom Linear Regression Implementation
class LinearRegression {
  constructor() {
    this.slope = 0;
    this.intercept = 0;
  }
  
  fit(x, y) {
    const n = x.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumXX += x[i] * x[i];
    }
    
    this.slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    this.intercept = (sumY - this.slope * sumX) / n;
  }
  
  predict(x) {
    return this.slope * x + this.intercept;
  }
}

// Initialize AI Models
const initializeAIModels = async () => {
  console.log('Initializing AI models...');
  
  // Bitcoin Price Prediction Model (Linear Regression)
  aiModels.pricePredictor = new LinearRegression();
  
  // Train price predictor with historical data
  if (bitcoinPriceHistory.length > 10) {
    const x = bitcoinPriceHistory.map((_, i) => i);
    const y = bitcoinPriceHistory.map(d => d.price);
    aiModels.pricePredictor.fit(x, y);
  }
  
  // Energy Demand Forecasting Model (Neural Network)
  aiModels.demandForecaster = new SimpleNeuralNetwork(5, 10, 1);
  
  // Train demand forecaster with sample data
  const trainingInputs = [];
  const trainingTargets = [];
  
  for (let i = 0; i < 100; i++) {
    trainingInputs.push([
      (i % 24) / 24, // hour
      (i % 7) / 7,   // day of week
      (i % 12) / 12, // month
      (60 + Math.random() * 40) / 100, // temperature
      (70 + Math.random() * 30) / 100  // historical demand
    ]);
    trainingTargets.push([(70 + Math.random() * 30) / 100]); // demand
  }
  
  aiModels.demandForecaster.train(trainingInputs, trainingTargets, 0.01, 500);
  
  // Optimization Engine (Genetic Algorithm simulation)
  aiModels.optimizationEngine = {
    optimizePortfolio: (devices, marketData, constraints) => {
      // Genetic algorithm for portfolio optimization
      const population = generateInitialPopulation(devices, 50);
      const generations = 100;
      
      for (let gen = 0; gen < generations; gen++) {
        const fitness = population.map(individual => calculateFitness(individual, marketData));
        const selected = selection(population, fitness);
        const newPopulation = crossover(selected);
        population.splice(0, population.length, ...newPopulation);
      }
      
      return getBestSolution(population, marketData);
    }
  };
  
  // Sentiment Analysis (Simple keyword-based)
  aiModels.sentimentAnalyzer = {
    keywords: {
      positive: ['surge', 'up', 'high', 'profit', 'growth', 'bullish', 'strong', 'increase'],
      negative: ['crash', 'down', 'low', 'loss', 'decline', 'bearish', 'weak', 'decrease'],
      neutral: ['stable', 'steady', 'maintain', 'hold', 'flat']
    },
    analyze: (textArray) => {
      const text = textArray.join(' ').toLowerCase();
      let positiveScore = 0;
      let negativeScore = 0;
      let neutralScore = 0;
      
      aiModels.sentimentAnalyzer.keywords.positive.forEach(word => {
        if (text.includes(word)) positiveScore++;
      });
      
      aiModels.sentimentAnalyzer.keywords.negative.forEach(word => {
        if (text.includes(word)) negativeScore++;
      });
      
      aiModels.sentimentAnalyzer.keywords.neutral.forEach(word => {
        if (text.includes(word)) neutralScore++;
      });
      
      if (positiveScore > negativeScore && positiveScore > neutralScore) return 'positive';
      if (negativeScore > positiveScore && negativeScore > neutralScore) return 'negative';
      return 'neutral';
    }
  };
  
  console.log('AI models initialized successfully');
};

// AI Prediction Functions
const predictBitcoinPrice = async (historicalData) => {
  if (!aiModels.pricePredictor) return bitcoinPrice;
  
  try {
    if (historicalData.length < 10) return bitcoinPrice;
    
    // Retrain the model with current data
    const x = historicalData.map((_, i) => i);
    const y = historicalData.map(d => d.price);
    aiModels.pricePredictor.fit(x, y);
    
    // Predict next value
    const nextIndex = x.length;
    const prediction = aiModels.pricePredictor.predict(nextIndex);
    
    return Math.max(75000, Math.min(120000, prediction));
  } catch (error) {
    console.error('Bitcoin price prediction error:', error);
    return bitcoinPrice;
  }
};

const forecastEnergyDemand = (location, historicalDemand, weatherData) => {
  if (!aiModels.demandForecaster) return 85;
  
  try {
    const input = {
      hour: new Date().getHours() / 24,
      dayOfWeek: new Date().getDay() / 7,
      month: new Date().getMonth() / 12,
      temperature: (weatherData?.temperature || 70) / 100,
      historicalDemand: historicalDemand / 100
    };
    
    const output = aiModels.demandForecaster.predict(input);
    return Math.round(output * 100);
  } catch (error) {
    console.error('Energy demand forecasting error:', error);
    return 85;
  }
};

const optimizeDeviceAllocation = (devices, marketData, energyContracts) => {
  if (!aiModels.optimizationEngine) return devices;
  
  try {
    const constraints = {
      maxPower: Object.values(energyContracts).reduce((sum, contract) => sum + contract.capacity, 0),
      minUptime: 0.95,
      maxRisk: 0.1
    };
    
    const optimizedAllocation = aiModels.optimizationEngine.optimizePortfolio(devices, marketData, constraints);
    
    // Apply optimization results if available
    if (optimizedAllocation && Array.isArray(optimizedAllocation)) {
      devices.forEach(device => {
        const optimization = optimizedAllocation.find(opt => opt.deviceId === device.id);
        if (optimization) {
          device.recommendedStatus = optimization.status;
          device.recommendedPower = optimization.powerAllocation;
          device.expectedProfit = optimization.expectedProfit;
        }
      });
    }
    
    return devices;
  } catch (error) {
    console.error('Device optimization error:', error);
    return devices;
  }
};

const analyzeMarketSentiment = (newsData, socialData) => {
  if (!aiModels.sentimentAnalyzer) return 'neutral';
  
  try {
    const combinedText = [...newsData, ...socialData].join(' ');
    const sentiment = aiModels.sentimentAnalyzer.analyze(combinedText.split(' '));
    return sentiment;
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return 'neutral';
  }
};

// Genetic Algorithm Helper Functions
const generateInitialPopulation = (devices, size) => {
  const population = [];
  for (let i = 0; i < size; i++) {
    const individual = devices.map(device => ({
      deviceId: device.id,
      status: Math.random() > 0.5 ? 'active' : 'standby',
      powerAllocation: Math.random() * device.powerConsumption,
      expectedProfit: 0
    }));
    population.push(individual);
  }
  return population;
};

const calculateFitness = (individual, marketData) => {
  let totalProfit = 0;
  let totalRisk = 0;
  
  individual.forEach(gene => {
    if (gene.status === 'active') {
      totalProfit += gene.expectedProfit;
      totalRisk += 0.05; // Base risk per active device
    }
  });
  
  return totalProfit - (totalRisk * 1000); // Risk penalty
};

const selection = (population, fitness) => {
  const sorted = population.map((individual, index) => ({ individual, fitness: fitness[index] }))
    .sort((a, b) => b.fitness - a.fitness);
  
  return sorted.slice(0, Math.floor(population.length / 2))
    .map(item => item.individual);
};

const crossover = (selected) => {
  const newPopulation = [];
  
  for (let i = 0; i < selected.length; i += 2) {
    if (i + 1 < selected.length) {
      const parent1 = selected[i];
      const parent2 = selected[i + 1];
      const crossoverPoint = Math.floor(Math.random() * parent1.length);
      
      const child1 = [...parent1.slice(0, crossoverPoint), ...parent2.slice(crossoverPoint)];
      const child2 = [...parent2.slice(0, crossoverPoint), ...parent1.slice(crossoverPoint)];
      
      newPopulation.push(child1, child2);
    }
  }
  
  return newPopulation;
};

const getBestSolution = (population, marketData) => {
  const fitness = population.map(individual => calculateFitness(individual, marketData));
  const bestIndex = fitness.indexOf(Math.max(...fitness));
  return population[bestIndex];
};

// Initialize AI models on startup
initializeAIModels().then(() => {
  console.log('AI models initialized successfully');
}).catch(error => {
  console.error('Error initializing AI models:', error);
}); 