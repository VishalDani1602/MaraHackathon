"""
API Client for MARA Hackathon API
Handles all communication with the hackathon API endpoints.
"""

import requests
import logging
from typing import Dict, List, Optional, Any
from config import API_BASE_URL, API_ENDPOINTS

logger = logging.getLogger(__name__)

class MaraAPIClient:
    """Client for interacting with the MARA Hackathon API."""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self.base_url = API_BASE_URL
        self.session = requests.Session()
        
        if api_key:
            self.session.headers.update({"X-Api-Key": api_key})
    
    def create_site(self, name: str) -> Dict[str, Any]:
        """Create a new mining site."""
        url = f"{self.base_url}{API_ENDPOINTS['sites']}"
        data = {"name": name}
        
        try:
            response = self.session.post(url, json=data)
            response.raise_for_status()
            result = response.json()
            
            # Update session with new API key
            if result and "api_key" in result:
                self.api_key = result["api_key"]
                self.session.headers.update({"X-Api-Key": self.api_key})
            
            logger.info(f"Created site: {name} with API key: {self.api_key[:8] if self.api_key else 'None'}...")
            return result
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create site: {e}")
            raise
    
    def get_prices(self) -> List[Dict[str, Any]]:
        """Get current historical pricing data."""
        url = f"{self.base_url}{API_ENDPOINTS['prices']}"
        
        try:
            response = self.session.get(url)
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get prices: {e}")
            raise
    
    def get_inventory(self) -> Dict[str, Any]:
        """Get available inventory."""
        url = f"{self.base_url}{API_ENDPOINTS['inventory']}"
        
        try:
            response = self.session.get(url)
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get inventory: {e}")
            raise
    
    def get_machines(self) -> Dict[str, Any]:
        """Get current machine allocation and status."""
        if not self.api_key:
            raise ValueError("API key required to get machines")
            
        url = f"{self.base_url}{API_ENDPOINTS['machines']}"
        
        try:
            response = self.session.get(url)
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get machines: {e}")
            raise
    
    def update_machines(self, allocation: Dict[str, int]) -> Dict[str, Any]:
        """Update machine allocation."""
        if not self.api_key:
            raise ValueError("API key required to update machines")
            
        url = f"{self.base_url}{API_ENDPOINTS['machines']}"
        
        try:
            response = self.session.put(url, json=allocation)
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to update machines: {e}")
            raise
    
    def get_site_info(self) -> Dict[str, Any]:
        """Get information about the current site."""
        if not self.api_key:
            raise ValueError("API key required to get site info")
            
        url = f"{self.base_url}{API_ENDPOINTS['sites']}"
        
        try:
            response = self.session.get(url)
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get site info: {e}")
            raise 