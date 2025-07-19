/**
 * @fileoverview Database service for movie-related operations.
 * - getOrInsertMovie: Ensures a movie exists in the DB before interaction.
 * - setMovieInteraction: Sets like/watch status for a user and movie.
 * - addReview: Adds or updates a movie review.
 */
import { db } from './index';
import type { Movie, Review, UserMovieInteraction, WatchStatus } from './schema';

/**
 * Gets a movie from the database by its ID, or inserts it if it doesn't exist.
 * This ensures that we have a local record of a movie before users interact with it.
 */
export async function getOrInsertMovie(movie: Omit<Movie, 'id'> & { id: string }): Promise<Movie> {
  const { id, title, year, poster_url, overview } = movie;

  const client = await db.connect();
  try {
    let res = await client.query('SELECT * FROM movies WHERE id = $1', [id]);
    
    if (res.rows.length === 0) {
      await client.query(
        'INSERT INTO movies (id, title, year, poster_url, overview) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
        [id, title, year, poster_url, overview]
      );
      res = await client.query('SELECT * FROM movies WHERE id = $1', [id]);
    }
    
    return res.rows[0];
  } finally {
    client.release();
  }
}

/**
 * Sets a user's interaction with a movie (like, watch status).
 */
export async function setMovieInteraction(interaction: {
    userId: string,
    movieId: string,
    liked?: boolean,
    status?: WatchStatus,
}): Promise<UserMovieInteraction> {
    const { userId, movieId, liked, status } = interaction;
    const client = await db.connect();
    try {
        const updates: string[] = [];
        const values: (string | boolean | Date)[] = [];
        let valueCount = 3;

        if (liked !== undefined) {
            updates.push(`liked = $${valueCount++}`);
            values.push(liked);
        }
        if (status) {
            updates.push(`status = $${valueCount++}`);
            values.push(status);
        }
        updates.push(`updated_at = $${valueCount++}`);
        values.push(new Date());

        const query = `
            INSERT INTO user_movie_interactions (user_id, movie_id, liked, status, updated_at)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (user_id, movie_id) DO UPDATE SET
            ${updates.join(', ')}
            RETURNING *;
        `;
        
        // Base values for INSERT
        const baseValues = [userId, movieId, liked, status];

        const res = await client.query(query, [...baseValues.slice(0,2), ...values]);
        
        return res.rows[0];
    } finally {
        client.release();
    }
}

/**
 * Adds or updates a review for a movie by a user.
 */
export async function addReview(review: {
    userId: string,
    movieId: string,
    rating: number,
    text: string,
    isPublic?: boolean
}): Promise<Review> {
    const { userId, movieId, rating, text, isPublic = true } = review;
    const client = await db.connect();
    try {
        const query = `
            INSERT INTO reviews (user_id, movie_id, rating, text, is_public, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            ON CONFLICT (user_id, movie_id) DO UPDATE SET
                rating = EXCLUDED.rating,
                text = EXCLUDED.text,
                is_public = EXCLUDED.is_public,
                updated_at = NOW()
            RETURNING *;
        `;
        const res = await client.query(query, [userId, movieId, rating, text, isPublic]);
        return res.rows[0];
    } finally {
        client.release();
    }
}
