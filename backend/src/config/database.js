import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

let pool = null;

try {
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'gharelu_sewa',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    connectionTimeoutMillis: 2000,
  });
  
  // Test connection
  pool.on('error', (err) => {
    console.error('⚠️ PostgreSQL connection error:', err.message);
  });
} catch (err) {
  console.error('⚠️ Could not initialize PostgreSQL Pool:', err.message);
}

export const query = async (text, params = []) => {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('⚠️ SQL Query failed on Postgres:', err.message);
    throw err;
  }
};

export const getPool = () => pool;

export default pool;
