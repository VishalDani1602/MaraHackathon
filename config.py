"""
Configuration settings for the MARA Hackathon optimization system.
"""

# API Configuration
API_BASE_URL = "https://mara-hackathon-api.onrender.com"
API_ENDPOINTS = {
    "sites": "/sites",
    "prices": "/prices",
    "inventory": "/inventory",
    "machines": "/machines"
}

# Optimization Parameters
OPTIMIZATION_CONFIG = {
    "max_iterations": 1000,
    "tolerance": 1e-6,
    "time_horizon_minutes": 30,  # How far ahead to optimize
    "rebalance_threshold": 0.05,  # 5% change triggers rebalancing
    "risk_tolerance": 0.1,  # Risk tolerance for optimization
}

# Machine Types and their characteristics
MACHINE_TYPES = {
    "air_miners": {"type": "miner", "cooling": "air"},
    "hydro_miners": {"type": "miner", "cooling": "hydro"},
    "immersion_miners": {"type": "miner", "cooling": "immersion"},
    "asic_compute": {"type": "compute", "hardware": "asic"},
    "gpu_compute": {"type": "compute", "hardware": "gpu"}
}

# Logging Configuration
LOG_LEVEL = "INFO"
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# Performance Tracking
PERFORMANCE_METRICS = [
    "total_revenue",
    "total_power_cost", 
    "net_profit",
    "profit_margin",
    "roi",
    "power_efficiency"
] 