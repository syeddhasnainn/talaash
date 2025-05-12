import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

config({ path: '.env.local' });

// Create a PostgreSQL pool with proper configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 10000, // Maximum time to wait for connection
});

// Connect drizzle to the pool
export const db = drizzle(pool);
