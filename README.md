# AI-Driven Energy Trading System

A comprehensive full-stack application that demonstrates AI-driven arbitrage trading between energy markets, Bitcoin mining, and AI inference compute markets. This system optimizes compute allocation across multiple markets in real-time.

## 🚀 Features

### Core Trading Capabilities
- **Energy Arbitrage**: Real-time analysis of energy prices across different locations
- **Bitcoin Mining**: Profitability analysis with halving countdown and difficulty tracking
- **Inference Market Trading**: AI compute pricing and arbitrage opportunities
- **Battery Storage**: Time-based energy storage optimization

### AI Trading Agents
- **Conservative Agent**: Low-risk, high-confidence trading strategies
- **Aggressive Agent**: High-reward opportunities with calculated risk
- **Balanced Agent**: Risk-adjusted returns across all market conditions

### Real-time Features
- Live market data updates every 30 seconds
- WebSocket connections for real-time dashboard updates
- Portfolio tracking with P&L calculations
- Trading history with confidence scoring

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Market Simulator**: Generates realistic market data with time-based pricing
- **AI Trading Agents**: Multiple agents with different risk profiles
- **WebSocket Server**: Real-time data broadcasting
- **REST API**: Data endpoints for frontend consumption

### Frontend (React)
- **Modern UI**: Dark theme with glass morphism effects
- **Real-time Dashboard**: Live portfolio and market updates
- **Interactive Charts**: Market visualization and trends
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Technology Stack

### Backend
- Node.js with Express
- Socket.io for real-time communication
- Node-cron for scheduled tasks
- UUID for unique identifiers

### Frontend
- React 18 with hooks
- Tailwind CSS for styling
- Lucide React for icons
- Socket.io-client for real-time updates

## 📦 Installation

### Option 1: Quick Start (Recommended)
```bash
# On macOS/Linux
./start.sh

# On Windows
start.bat
```

### Option 2: Manual Installation
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-energy-trading-system
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm start
   # or
   npm run dev
   ```

This will start:
- Backend server on `http://localhost:5001`
- Frontend development server on `http://localhost:3000`

## 🎯 Usage

### Dashboard Overview
The main dashboard provides:
- **Portfolio Value**: Real-time portfolio tracking with asset breakdown
- **Market Overview**: Current prices and trends across all markets
- **Trading History**: Recent AI trading decisions and executions
- **AI Agents**: Status and performance of trading agents

### Market Analysis
- **Energy Map**: Geographic energy price analysis and arbitrage opportunities
- **Bitcoin Mining**: Mining profitability with halving countdown
- **Inference Market**: AI compute pricing and trading opportunities

### Real-time Features
- Live market data updates every 30 seconds
- AI agents automatically make trading decisions
- Portfolio value updates in real-time
- Trading history with execution status

## 🔧 Configuration

### Market Parameters
The system simulates realistic market conditions:
- **Energy Prices**: Vary by location and time (peak/off-peak hours)
- **Bitcoin Price**: Volatile with realistic movements
- **Mining Difficulty**: Updates based on network activity
- **Inference Prices**: Demand-based pricing for different compute types

### AI Agent Settings
- **Conservative**: 10% portfolio allocation per trade, 80%+ confidence threshold
- **Aggressive**: 15% portfolio allocation per trade, 60%+ confidence threshold
- **Balanced**: 12% portfolio allocation per trade, 70%+ confidence threshold

## 📊 Market Simulation

### Energy Markets
- **Locations**: Texas, California, New York, Washington, Florida
- **Pricing**: Time-based with peak/off-peak variations
- **Demand**: Simulated based on time of day and location

### Bitcoin Mining
- **Price Volatility**: Realistic BTC price movements
- **Difficulty**: Network difficulty simulation
- **Halving**: Countdown to next block reward halving
- **Profitability**: Energy cost vs. mining reward analysis

### Inference Markets
- **GPU Compute**: High-performance AI training instances
- **CPU Compute**: General-purpose compute resources
- **Specialized AI**: Custom hardware and accelerators

## 🎨 UI Components

### Design System
- **Dark Theme**: Professional dark interface
- **Glass Morphism**: Modern glass-like card effects
- **Color Coding**: Green (profit), Red (loss), Blue (neutral)
- **Animations**: Smooth transitions and loading states

### Responsive Layout
- **Desktop**: Full dashboard with all components visible
- **Tablet**: Optimized grid layouts
- **Mobile**: Stacked layout for smaller screens

## 🔮 Future Enhancements

### Potential Integrations
- **Real Market Data**: Connect to actual energy and crypto APIs
- **Machine Learning**: Enhanced prediction models
- **Risk Management**: Advanced portfolio optimization
- **Multi-Exchange**: Support for multiple trading venues

### Advanced Features
- **Backtesting**: Historical strategy performance analysis
- **Portfolio Optimization**: Modern portfolio theory implementation
- **Risk Metrics**: Sharpe ratio, VaR, and other risk measures
- **API Integration**: Real-time data from external sources

## 🤝 Contributing

This is a hackathon project demonstrating AI-driven trading concepts. Feel free to:
- Add new trading strategies
- Improve the UI/UX
- Add more market types
- Enhance the AI algorithms

## 📝 License

MIT License - feel free to use this code for your own projects and hackathons!

## 🎯 Hackathon Focus

This project demonstrates:
- **Multi-market arbitrage**: Energy, crypto, and compute markets
- **AI-driven decision making**: Multiple agents with different strategies
- **Real-time optimization**: Live market analysis and trading
- **Modern full-stack development**: React + Node.js with WebSockets
- **Professional UI/UX**: Production-ready interface design

Perfect for hackathons focusing on:
- AI/ML applications
- Financial technology
- Energy trading
- Real-time systems
- Full-stack development 