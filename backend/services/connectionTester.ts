import axios from 'axios';

// The base URL for the backend API
const BASE_URL = 'http://localhost:5001';

// Test the connection to the backend server and MongoDB
export const testBackendConnection = async (): Promise<{ 
  success: boolean; 
  message: string; 
  details?: any 
}> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/status`, {
      timeout: 5000 // 5 second timeout
    });
    
    return {
      success: true,
      message: "Successfully connected to backend server",
      details: response.data
    };
  } catch (error: any) {
    console.error("Backend connection test failed:", error);
    
    // Provide helpful error information
    if (!error.response) {
      return {
        success: false,
        message: "Could not connect to backend server. Check if it's running and accessible.",
        details: { errorType: 'CONNECTION_ERROR', errorMessage: error.message }
      };
    }
    
    return {
      success: false,
      message: `Backend server responded with an error (${error.response.status}): ${error.response.statusText}`,
      details: { 
        errorType: 'API_ERROR', 
        statusCode: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      }
    };
  }
};

// Helper function to clear local storage values related to API and offline mode
export const resetConnectionSettings = (): void => {
  localStorage.removeItem('bypassAPI');
  console.log("Reset connection settings to force online mode");
};

// Function to restart the application's connection handling
export const restartConnection = async (): Promise<boolean> => {
  resetConnectionSettings();
  const result = await testBackendConnection();
  return result.success;
};

// Function to help diagnose MongoDB connection issues
export const diagnoseConnectionIssues = async (): Promise<string[]> => {
  const issues: string[] = [];
  
  try {
    // Test 1: Check if backend server is reachable
    const serverTest = await axios.get(`${BASE_URL}/api/status`, { timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    
    if (!serverTest) {
      issues.push("Backend server not running or not accessible at " + BASE_URL);
      issues.push("Possible fixes: Start your backend server with 'npm start' in the backend directory");
      return issues;
    }
    
    // Test 2: Check if MongoDB is properly configured
    const dbTest = await axios.get(`${BASE_URL}/api/scores/health`, { timeout: 3000 })
      .then(response => response.data.mongodb === 'connected')
      .catch(() => false);
    
    if (!dbTest) {
      issues.push("MongoDB connection issue detected");
      issues.push("Possible fixes: Check MongoDB connection string in backend config");
    }
    
    // If no issues found but we're still having problems
    if (issues.length === 0) {
      issues.push("Backend appears to be running correctly, but connection issues persist");
      issues.push("Check browser console for more detailed error messages");
    }
    
    return issues;
  } catch (error) {
    issues.push("Error running connection diagnostics");
    return issues;
  }
}; 