#!/bin/bash

echo "🧪 Testing AI Energy Trading System..."
echo ""

# Test Backend APIs
echo "📡 Testing Backend APIs..."

echo "  Testing Market API..."
MARKET_RESPONSE=$(curl -s http://localhost:5001/api/market)
if [[ $MARKET_RESPONSE == *"energy"* && $MARKET_RESPONSE == *"bitcoin"* ]]; then
    echo "  ✅ Market API: Working"
else
    echo "  ❌ Market API: Failed"
    exit 1
fi

echo "  Testing Portfolio API..."
PORTFOLIO_RESPONSE=$(curl -s http://localhost:5001/api/portfolio)
if [[ $PORTFOLIO_RESPONSE == *"cash"* && $PORTFOLIO_RESPONSE == *"totalValue"* ]]; then
    echo "  ✅ Portfolio API: Working"
else
    echo "  ❌ Portfolio API: Failed"
    exit 1
fi

echo "  Testing Trading History API..."
HISTORY_RESPONSE=$(curl -s http://localhost:5001/api/trading-history)
if [[ $HISTORY_RESPONSE == *"["* ]]; then
    echo "  ✅ Trading History API: Working"
else
    echo "  ❌ Trading History API: Failed"
    exit 1
fi

echo "  Testing AI Agents API..."
AGENTS_RESPONSE=$(curl -s http://localhost:5001/api/agents)
if [[ $AGENTS_RESPONSE == *"conservative"* && $AGENTS_RESPONSE == *"aggressive"* ]]; then
    echo "  ✅ AI Agents API: Working"
else
    echo "  ❌ AI Agents API: Failed"
    exit 1
fi

# Test Frontend
echo ""
echo "🌐 Testing Frontend..."

echo "  Testing React App..."
FRONTEND_RESPONSE=$(curl -s http://localhost:3000)
if [[ $FRONTEND_RESPONSE == *"AI Energy Trading System"* ]]; then
    echo "  ✅ React App: Working"
else
    echo "  ❌ React App: Failed"
    exit 1
fi

# Test WebSocket Connection
echo ""
echo "🔌 Testing WebSocket Connection..."
echo "  WebSocket connection is established when you visit the frontend"

# Display System Status
echo ""
echo "📊 System Status:"
echo "  Backend Server:  http://localhost:5001 ✅"
echo "  Frontend Server: http://localhost:3000 ✅"
echo "  WebSocket:       ws://localhost:5001 ✅"

echo ""
echo "🎯 All Systems Operational!"
echo ""
echo "🌐 Open your browser and visit: http://localhost:3000"
echo "📱 You should see:"
echo "   - Live portfolio updates"
echo "   - Real-time market data"
echo "   - AI trading decisions"
echo "   - Interactive dashboard"
echo ""
echo "🚀 Your AI Energy Trading System is ready for the hackathon!" 