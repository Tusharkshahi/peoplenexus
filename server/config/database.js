const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'peoplenexus_db',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Connection pool settings
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // how long to wait when connecting a new client
};

// Create connection pool
const pool = new Pool(dbConfig);

// Pool event handlers
pool.on('connect', (client) => {
  console.log('📊 New database client connected');
});

pool.on('error', (err, client) => {
  console.error('💥 Unexpected error on idle database client', err);
  process.exit(-1);
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    console.log('✅ Database connected successfully');
    console.log(`🕐 Server time: ${result.rows[0].current_time}`);
    console.log(`🗄️  Database: ${result.rows[0].version}`);
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
};

// Execute query with error handling
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`🔍 Executed query: ${text.slice(0, 50)}... (${duration}ms)`);
    return result;
  } catch (error) {
    console.error('💥 Database query error:', error.message);
    console.error('📝 Query:', text);
    console.error('📋 Parameters:', params);
    throw error;
  }
};

// Transaction helper
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Common database operations
const db = {
  // Basic CRUD operations
  async findAll(table, conditions = '', params = []) {
    const whereClause = conditions ? `WHERE ${conditions}` : '';
    const text = `SELECT * FROM ${table} ${whereClause} ORDER BY created_at DESC`;
    const result = await query(text, params);
    return result.rows;
  },

  async findById(table, id) {
    const text = `SELECT * FROM ${table} WHERE id = $1`;
    const result = await query(text, [id]);
    return result.rows[0];
  },

  async findOne(table, conditions, params = []) {
    const text = `SELECT * FROM ${table} WHERE ${conditions} LIMIT 1`;
    const result = await query(text, params);
    return result.rows[0];
  },

  async create(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    const columns = keys.join(', ');
    
    const text = `
      INSERT INTO ${table} (${columns}) 
      VALUES (${placeholders}) 
      RETURNING *
    `;
    
    const result = await query(text, values);
    return result.rows[0];
  },

  async update(table, id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    
    const text = `
      UPDATE ${table} 
      SET ${setClause}, updated_at = NOW() 
      WHERE id = $1 
      RETURNING *
    `;
    
    const result = await query(text, [id, ...values]);
    return result.rows[0];
  },

  async delete(table, id) {
    const text = `DELETE FROM ${table} WHERE id = $1 RETURNING *`;
    const result = await query(text, [id]);
    return result.rows[0];
  },

  // Pagination helper
  async paginate(table, page = 1, limit = 10, conditions = '', params = []) {
    const offset = (page - 1) * limit;
    const whereClause = conditions ? `WHERE ${conditions}` : '';
    
    // Get total count
    const countQuery = `SELECT COUNT(*) FROM ${table} ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);
    
    // Get paginated data
    const dataQuery = `
      SELECT * FROM ${table} ${whereClause} 
      ORDER BY created_at DESC 
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    const dataResult = await query(dataQuery, [...params, limit, offset]);
    
    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  },

  // Advanced queries
  async search(table, searchColumns, searchTerm, conditions = '', params = []) {
    const searchConditions = searchColumns
      .map(col => `${col} ILIKE $${params.length + 1}`)
      .join(' OR ');
    
    const whereClause = conditions 
      ? `WHERE ${conditions} AND (${searchConditions})`
      : `WHERE ${searchConditions}`;
    
    const text = `SELECT * FROM ${table} ${whereClause} ORDER BY created_at DESC`;
    const result = await query(text, [...params, `%${searchTerm}%`]);
    return result.rows;
  },

  // Raw query execution
  query,
  transaction,
  pool
};

// Initialize database connection
testConnection();

module.exports = db;
