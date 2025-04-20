// src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Backend server URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;