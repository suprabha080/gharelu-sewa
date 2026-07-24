import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool, Client } = pg;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'gharelu_sewa',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

// Ensure database exists
const ensureDatabaseExists = async () => {
  const masterClient = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: 'postgres',
  });
  try {
    await masterClient.connect();
    const res = await masterClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbConfig.database]
    );
    if (res.rows.length === 0) {
      await masterClient.query(`CREATE DATABASE "${dbConfig.database}"`);
      console.log(`✅ Created database "${dbConfig.database}"`);
    }
  } catch (err) {
    console.warn('⚠️ Master DB connection check failed:', err.message);
  } finally {
    await masterClient.end().catch(() => {});
  }
};

await ensureDatabaseExists();

let pool = null;

try {
  pool = new Pool({
    ...dbConfig,
    connectionTimeoutMillis: 3000,
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
