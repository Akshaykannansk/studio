/**
 * @fileoverview Database initialization script.
 * This script connects to the PostgreSQL database and creates the necessary tables
 * if they don't already exist. Run this with `npm run db:init`.
 */
import { db } from './index';

async function createTables() {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100),
        avatar_url VARCHAR(255),
        bio TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Movies Table (to store basic movie info we've seen)
    await client.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id VARCHAR(255) PRIMARY KEY, -- Corresponds to TMDB ID
        title VARCHAR(255) NOT NULL,
        year INT,
        poster_url VARCHAR(255),
        overview TEXT
      );
    `);

    // User Movie Interactions (Likes, Watch Status)
    await client.query(`
      CREATE TYPE watch_status AS ENUM ('watched', 'want_to_watch', 'rewatched');
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_movie_interactions (
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        movie_id VARCHAR(255) REFERENCES movies(id) ON DELETE CASCADE,
        liked BOOLEAN DEFAULT FALSE,
        status watch_status,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (user_id, movie_id)
      );
    `);

    // Reviews Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        movie_id VARCHAR(255) REFERENCES movies(id) ON DELETE CASCADE,
        rating DECIMAL(2, 1) CHECK (rating >= 0.5 AND rating <= 5.0),
        text TEXT,
        is_public BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, movie_id)
      );
    `);

    // Movie Lists Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS movie_lists (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        is_public BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    
    // List Items Table (many-to-many relationship between lists and movies)
    await client.query(`
      CREATE TABLE IF NOT EXISTS list_items (
        list_id INTEGER REFERENCES movie_lists(id) ON DELETE CASCADE,
        movie_id VARCHAR(255) REFERENCES movies(id) ON DELETE CASCADE,
        added_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (list_id, movie_id)
      );
    `);

    await client.query('COMMIT');
    console.log('Tables created successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating tables:', error);
  } finally {
    client.release();
  }
}

async function main() {
  await createTables();
  await db.end();
}

main().catch((err) => {
  console.error('An error occurred during DB initialization:', err);
  process.exit(1);
});
