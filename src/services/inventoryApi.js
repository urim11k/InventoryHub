// Frontend API Service (src/services/inventoryApi.js)
import axios from 'axios';

class InventoryApiService {
    constructor() {
        this.client = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // Response interceptor for consistent error handling
        this.client.interceptors.response.use(
            response => this.transformResponse(response),
            error => this.handleError(error)
        );
    }

    // Transform response to standardized format
    transformResponse(response) {
        return {
            data: response.data.data,
            metadata: response.data.metadata,
            status: response.status
        };
    }

    // Centralized error handling
    handleError(error) {
        const errorResponse = {
            message: error.response?.data?.message || 'An unexpected error occurred',
            code: error.response?.status || 500,
            details: error.response?.data?.details || {}
        };
        
        // Log error for monitoring
        console.error('[API Error]', errorResponse);
        
        return Promise.reject(errorResponse);
    }

    // API methods with request debouncing and caching
    async getInventoryItems(params) {
        const cacheKey = `inventory-${JSON.stringify(params)}`;
        const cachedData = localStorage.getItem(cacheKey);
        
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        
        const response = await this.client.get('/inventory', { params });
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
        return response.data;
    }
}