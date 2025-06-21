# MARA Hackathon Optimization System

An intelligent optimization engine that automatically finds the most profitable machine allocation for your mining/data center operations during the MARA Hackathon.

## 🚀 Features

### Core Optimization
- **Linear Programming Engine**: Uses advanced mathematical optimization to find the most profitable allocation
- **Real-time Price Analysis**: Continuously monitors energy, hash, and token prices
- **Power Constraint Management**: Ensures allocations never exceed your site's power capacity
- **Profit Maximization**: Automatically calculates and optimizes for maximum profit

### Smart Features
- **Rebalancing Detection**: Only suggests changes when they provide significant improvements
- **Risk Management**: Configurable risk tolerance and safety thresholds
- **Performance Insights**: Detailed analysis of expected ROI, profit margins, and efficiency
- **Continuous Operation**: Can run continuously with automatic periodic optimization

### User Experience
- **Beautiful CLI Interface**: Color-coded output with tables and clear metrics
- **Interactive Mode**: Choose whether to apply optimizations or review first
- **Comprehensive Logging**: Detailed logs for debugging and performance tracking
- **Flexible Configuration**: Easy to customize optimization parameters

## 📦 Installation

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Verify Installation**:
   ```bash
   python main.py --help
   ```

## 🎯 Quick Start

### First Time Setup
```bash
# Create a new site and start optimizing
python main.py --site-name "MyOptimizedSite"
```

### Using Existing Site
```bash
# Use your existing API key
python main.py --api-key "your-api-key-here"
```

### Continuous Optimization
```bash
# Run continuous optimization (checks every 5 minutes)
python main.py --continuous --auto-apply

# Custom interval (check every 10 minutes)
python main.py --continuous --interval 10 --auto-apply
```

## 📊 How It Works

### 1. Data Collection
The system continuously fetches:
- **Current Prices**: Energy, hash, and token prices (updated every 5 minutes)
- **Inventory**: Available machine types and their specifications
- **Site Status**: Current allocation and performance metrics

### 2. Optimization Algorithm
The core optimization uses **Linear Programming** to solve:

**Objective**: Maximize Total Profit
```
Maximize: Σ(revenue_per_machine × count) - Σ(cost_per_machine × count)
```

**Constraints**:
- Total power usage ≤ Site power capacity
- All machine counts ≥ 0
- Machine counts must be integers

### 3. Decision Making
The system evaluates:
- **Profit Potential**: Expected revenue vs. costs
- **Market Conditions**: Current price trends
- **Efficiency**: Profit per watt of power used
- **Risk**: Stability of current allocation

### 4. Action Execution
- **Rebalancing Threshold**: Only changes allocation if improvement > 5%
- **Safety Checks**: Validates constraints before applying
- **Performance Tracking**: Monitors actual vs. expected results

## 🛠️ Configuration

### Optimization Parameters (`config.py`)
```python
OPTIMIZATION_CONFIG = {
    "max_iterations": 1000,        # Max LP solver iterations
    "tolerance": 1e-6,             # Numerical tolerance
    "time_horizon_minutes": 30,    # Planning horizon
    "rebalance_threshold": 0.05,   # 5% improvement threshold
    "risk_tolerance": 0.1,         # Risk tolerance level
}
```

### Machine Types
The system supports all hackathon machine types:
- **Miners**: Air, Hydro, Immersion cooling
- **Compute**: ASIC and GPU inference units

## 📈 Performance Metrics

The system tracks and optimizes for:

### Financial Metrics
- **Total Revenue**: Sum of all machine revenues
- **Power Costs**: Energy consumption costs
- **Net Profit**: Revenue minus costs
- **Profit Margin**: Profit as percentage of revenue
- **ROI**: Return on investment

### Efficiency Metrics
- **Power Efficiency**: Profit per watt
- **Utilization**: Power usage vs. capacity
- **Machine Efficiency**: Revenue per machine type

## 🔧 Advanced Usage

### Manual Optimization
```bash
# Run single optimization without auto-apply
python main.py --api-key "your-key"
# Review results and choose whether to apply
```

### Custom Site Names
```bash
# Create site with custom name
python main.py --site-name "TeamAlphaOptimizer"
```

### Debug Mode
```bash
# Check logs for detailed information
tail -f mara_optimizer.log
```

## 📋 Command Line Options

| Option | Description | Example |
|--------|-------------|---------|
| `--api-key` | Use existing API key | `--api-key "abc123"` |
| `--site-name` | Create new site with name | `--site-name "MySite"` |
| `--continuous` | Run continuous optimization | `--continuous` |
| `--interval` | Minutes between checks | `--interval 10` |
| `--auto-apply` | Automatically apply optimizations | `--auto-apply` |

## 🎮 Example Session

```
============================================================
MARA HACKATHON OPTIMIZATION SYSTEM
============================================================

Enter site name: OptimizerPro

Creating new site: OptimizerPro
✓ Site created successfully!
API Key: abc12345...
Max Power: 1,000,000 W

Running optimization...

============================================================
CURRENT SITE STATUS
============================================================

Current Machine Allocation:
+------------------+-------+
| Machine Type     | Count |
+------------------+-------+
| immersion_miners | 15    |
| asic_compute     | 8     |
+------------------+-------+

Financial Metrics:
+---------------+-------------+
| Total Revenue | $ 45,234.56 |
| Power Cost    | $ 12,345.67 |
| Net Profit    | $ 32,888.89 |
| Power Used    | 234,567 W   |
+---------------+-------------+

Current Prices:
+-------------+------------------+
| Energy Price| $0.0647/W       |
| Hash Price  | $8.4482/TH      |
| Token Price | $2.9123/token   |
+-------------+------------------+

============================================================
OPTIMIZATION RESULTS
============================================================

Optimal Allocation:
+------------------+----------------+------------+
| Machine Type     | Optimal Count  | Change     |
+------------------+----------------+------------+
| immersion_miners | 18             | (+3)       |
| asic_compute     | 12             | (+4)       |
| gpu_compute      | 5              | (+5)       |
+------------------+----------------+------------+

Expected Performance:
+------------------+-------------+
| Expected Profit  | $ 52,345.67 |
| Profit Margin    | 72.34%      |
| ROI              | 15.67%      |
| Power Used       | 298,456 W   |
+------------------+-------------+

Rebalancing recommended!
Apply optimization? (y/n): y

Applying optimization...
✓ Optimization applied successfully!
```

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check internet connection
   - Verify API endpoint is accessible
   - Ensure API key is valid

2. **Optimization Failures**
   - Check power constraints
   - Verify price data availability
   - Review inventory data

3. **Performance Issues**
   - Adjust optimization parameters
   - Check system resources
   - Review log files

### Log Files
- **Application Log**: `mara_optimizer.log`
- **Error Details**: Check log level in config
- **Performance Data**: Track optimization history

## 🏆 Competition Strategy

### Optimization Tips
1. **Start Early**: Begin optimization as soon as the hackathon starts
2. **Monitor Continuously**: Use continuous mode to catch price changes
3. **Review Insights**: Pay attention to recommendations
4. **Track Performance**: Monitor actual vs. expected results

### Advanced Strategies
1. **Price Prediction**: Analyze historical price trends
2. **Risk Management**: Balance profit vs. stability
3. **Market Timing**: Optimize during favorable price conditions
4. **Resource Allocation**: Focus on highest ROI machines

## 📞 Support

For issues or questions:
- Check the log files for detailed error information
- Review the configuration settings
- Ensure all dependencies are installed correctly

---