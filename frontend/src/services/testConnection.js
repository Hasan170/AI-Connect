const axios = require('axios');

// Tests MongoDB connection and returns results
async function testMongoDBConnection() {
  console.log('Testing MongoDB connection...');
  try {
    const response = await axios.get('http://localhost:5001/api/scores/health');
    console.log('Response:', response.data);
    
    if (response.data.mongodb === 'connected') {
      console.log('✅ MongoDB connection is working!');
      return true;
    } else {
      console.log('❌ MongoDB is not connected. Status:', response.data.readyState);
      return false;
    }
  } catch (error) {
    console.error('❌ Error connecting to backend server:', error.message);
    return false;
  }
}

// Tests backend API connection
async function testBackendAPI() {
  console.log('Testing backend API connection...');
  try {
    const response = await axios.get('http://localhost:5001/api/status');
    console.log('✅ Backend API is running:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Error connecting to backend API:', error.message);
    return false;
  }
}

// Run both tests
async function runTests() {
  console.log('----- CONNECTION TEST UTILITY -----');
  const apiRunning = await testBackendAPI();
  
  if (apiRunning) {
    await testMongoDBConnection();
  }
  
  console.log('----- TEST COMPLETE -----');
}

// Run the tests when script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testMongoDBConnection, testBackendAPI, runTests }; 