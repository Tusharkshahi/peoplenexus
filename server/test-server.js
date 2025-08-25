const http = require('http');
const url = require('url');

console.log('🔍 Testing PeopleNexus HRMS Backend Server...\n');

// Test configuration
const SERVER_HOST = 'localhost';
const SERVER_PORT = 5001;
const BASE_URL = `http://${SERVER_HOST}:${SERVER_PORT}`;

// Test endpoints
const testEndpoints = [
  { path: '/health', method: 'GET', description: 'Health Check' },
  { path: '/', method: 'GET', description: 'API Info' },
  { 
    path: '/api/auth/login', 
    method: 'POST', 
    description: 'Login Test',
    data: JSON.stringify({
      email: 'admin@peoplenexus.com',
      password: 'password123'
    })
  }
];

// Make HTTP request
function makeRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const urlParts = url.parse(`${BASE_URL}${endpoint.path}`);
    
    const options = {
      hostname: urlParts.hostname,
      port: urlParts.port,
      path: urlParts.path,
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (endpoint.data) {
      options.headers['Content-Length'] = Buffer.byteLength(endpoint.data);
    }

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (endpoint.data) {
      req.write(endpoint.data);
    }

    req.end();
  });
}

// Run tests
async function runTests() {
  console.log(`🎯 Testing server at ${BASE_URL}\n`);

  for (const endpoint of testEndpoints) {
    try {
      console.log(`📡 Testing ${endpoint.description}...`);
      console.log(`   ${endpoint.method} ${endpoint.path}`);
      
      const response = await makeRequest(endpoint);
      
      if (response.status >= 200 && response.status < 300) {
        console.log(`   ✅ Status: ${response.status} - SUCCESS`);
        if (typeof response.data === 'object') {
          console.log(`   📄 Response: ${JSON.stringify(response.data, null, 2).substring(0, 200)}...`);
        } else {
          console.log(`   📄 Response: ${response.data.substring(0, 200)}...`);
        }
      } else {
        console.log(`   ❌ Status: ${response.status} - ERROR`);
        console.log(`   📄 Response: ${JSON.stringify(response.data, null, 2)}`);
      }
      
    } catch (error) {
      console.log(`   💥 ERROR: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.log(`   💡 Server might not be running on ${BASE_URL}`);
      }
    }
    
    console.log('');
  }

  console.log('🏁 Testing completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Ensure PostgreSQL is running');
  console.log('2. Create database: CREATE DATABASE peoplenexus_db;');
  console.log('3. Run schema: psql -U postgres -d peoplenexus_db -f database-setup.sql');
  console.log('4. Run sample data: psql -U postgres -d peoplenexus_db -f sample-data.sql');
  console.log('5. Start server: node server.js');
  console.log('6. Test frontend connection from http://localhost:3000');
}

// Check if server is running first
console.log('🔍 Checking if server is running...');
makeRequest({ path: '/health', method: 'GET' })
  .then(() => {
    console.log('✅ Server is responding, running full tests...\n');
    runTests();
  })
  .catch((error) => {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running');
      console.log(`💡 Please start the server first: node server.js`);
      console.log(`📍 Expected server address: ${BASE_URL}`);
    } else {
      console.log('❌ Connection error:', error.message);
    }
    console.log('\n📋 To start the server:');
    console.log('1. cd server');
    console.log('2. Make sure PostgreSQL is running');
    console.log('3. Create database and run schema');
    console.log('4. node server.js');
  });
