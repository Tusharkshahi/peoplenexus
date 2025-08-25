// PostgreSQL Connection Test
// This script tests the database connection using the pg library

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
try {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  console.log('✅ Environment variables loaded');
} catch (err) {
  console.log('⚠️  No .env file found, using default values');
}

async function testPostgreSQLConnection() {
  console.log('\n🔍 Testing PostgreSQL Connection...');
  console.log('=====================================');
  
  // Display connection details
  console.log(`📊 Database URL: ${process.env.DATABASE_URL || 'Not configured'}`);
  
  if (!process.env.DATABASE_URL) {
    console.log('❌ No DATABASE_URL found in environment variables');
    console.log('💡 Expected format: postgresql://username:password@localhost:5432/database_name');
    process.exit(1);
  }

  // Parse the DATABASE_URL
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log(`🏠 Host: ${url.hostname}`);
    console.log(`🔌 Port: ${url.port || 5432}`);
    console.log(`👤 Username: ${url.username}`);
    console.log(`🗄️  Database: ${url.pathname.slice(1)}`);
    console.log(`🔒 Password: ${url.password ? '***' : 'Not provided'}\n`);
  } catch (error) {
    console.log('❌ Invalid DATABASE_URL format');
    console.log('💡 Expected format: postgresql://username:password@localhost:5432/database_name');
    process.exit(1);
  }

  // Test 1: Basic Connection
  console.log('🧪 Test 1: Basic Connection');
  console.log('---------------------------');
  
  let pool;
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000, // 5 second timeout
    });

    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL!');
    
    // Release the client back to the pool
    client.release();
    
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code || 'Unknown'}`);
    
    // Common error codes and solutions
    switch (error.code) {
      case 'ECONNREFUSED':
        console.log('\n💡 Possible solutions:');
        console.log('   • Make sure PostgreSQL is running');
        console.log('   • Check if the host and port are correct');
        console.log('   • Verify firewall settings');
        break;
      case 'ENOTFOUND':
        console.log('\n💡 Possible solutions:');
        console.log('   • Check the hostname in your DATABASE_URL');
        console.log('   • Verify network connectivity');
        break;
      case '28P01':
        console.log('\n💡 Possible solutions:');
        console.log('   • Check username and password');
        console.log('   • Verify user permissions');
        break;
      case '3D000':
        console.log('\n💡 Possible solutions:');
        console.log('   • Check if the database exists');
        console.log('   • Create the database if it doesn\'t exist');
        break;
      default:
        console.log('\n💡 General troubleshooting:');
        console.log('   • Verify PostgreSQL is installed and running');
        console.log('   • Check your DATABASE_URL configuration');
        console.log('   • Ensure the user has proper permissions');
    }
    
    if (pool) {
      await pool.end();
    }
    process.exit(1);
  }

  // Test 2: Database Queries
  console.log('\n🧪 Test 2: Database Queries');
  console.log('----------------------------');
  
  try {
    // Test current time query
    const timeResult = await pool.query('SELECT NOW() as current_time');
    console.log(`✅ Current database time: ${timeResult.rows[0].current_time}`);
    
    // Test version query
    const versionResult = await pool.query('SELECT version() as db_version');
    console.log(`✅ PostgreSQL version: ${versionResult.rows[0].db_version.split(' ')[0]} ${versionResult.rows[0].db_version.split(' ')[1]}`);
    
  } catch (error) {
    console.log('❌ Query execution failed:');
    console.log(`   Error: ${error.message}`);
  }

  // Test 3: Check Database Schema
  console.log('\n🧪 Test 3: Database Schema Check');
  console.log('---------------------------------');
  
  try {
    // Check if our tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`✅ Found ${tablesResult.rows.length} tables in the database:`);
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach(row => {
        console.log(`   • ${row.table_name}`);
      });
    } else {
      console.log('   (No tables found - database might be empty)');
    }
    
    // Check for PeopleNexus specific tables
    const expectedTables = [
      'users', 'employees', 'departments', 'positions', 
      'leave_types', 'leave_requests', 'job_postings', 
      'applications', 'payroll_runs', 'payslips', 
      'performance_reviews'
    ];
    
    const existingTables = tablesResult.rows.map(row => row.table_name);
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length === 0) {
      console.log('✅ All PeopleNexus tables are present!');
    } else {
      console.log(`⚠️  Missing PeopleNexus tables: ${missingTables.join(', ')}`);
      console.log('💡 You may need to run the database setup script');
    }
    
  } catch (error) {
    console.log('❌ Schema check failed:');
    console.log(`   Error: ${error.message}`);
  }

  // Test 4: Sample Data Check
  console.log('\n🧪 Test 4: Sample Data Check');
  console.log('-----------------------------');
  
  try {
    // Check users table
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Users table: ${usersResult.rows[0].count} records`);
    
    // Check employees table
    const employeesResult = await pool.query('SELECT COUNT(*) as count FROM employees');
    console.log(`✅ Employees table: ${employeesResult.rows[0].count} records`);
    
    // Check departments table
    const departmentsResult = await pool.query('SELECT COUNT(*) as count FROM departments');
    console.log(`✅ Departments table: ${departmentsResult.rows[0].count} records`);
    
  } catch (error) {
    console.log('⚠️  Sample data check failed (tables might not exist):');
    console.log(`   Error: ${error.message}`);
    console.log('💡 This is normal if you haven\'t run the database setup yet');
  }

  // Close the connection pool
  await pool.end();
  console.log('\n🎉 Database connection test completed!');
  console.log('=====================================');
}

// Run the test
testPostgreSQLConnection().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
