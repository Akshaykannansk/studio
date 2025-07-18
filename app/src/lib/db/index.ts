/**
 * @fileoverview Database client setup.
 * Initializes a PostgreSQL client pool for the application.
 */
import { Pool } from 'pg';
import 'dotenv/config'

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL environment variable is not set");
  throw new Error('DATABASE_URL environment variable is not set');
}

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

db.on('connect', () => {
  console.log('Successfully connected to the PostgreSQL database.');
});

db.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});
