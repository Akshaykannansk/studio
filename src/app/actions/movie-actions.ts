'use server';

import { getOrInsertMovie, setMovieInteraction, addReview } from '@/lib/db/movies';
import type { Movie, WatchStatus } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

// This is a placeholder for the logged-in user.
// In a real app, you would get this from your authentication system.
const MOCK_USER_ID = '1';

/**
 * Server action to "like" a movie.
 */
export async function likeMovieAction(movie: Movie, isLiked: boolean) {
  try {
    await getOrInsertMovie(movie);
    await setMovieInteraction({
      userId: MOCK_USER_ID,
      movieId: movie.id,
      liked: isLiked,
    });
    revalidatePath(`/movies/${movie.id}`);
    return { success: true, message: isLiked ? 'Movie liked' : 'Movie unliked' };
  } catch (error) {
    console.error('Error liking movie:', error);
    return { success: false, message: 'Failed to update like status.' };
  }
}

/**
 * Server action to set the watch status of a movie.
 */
export async function setWatchStatusAction(movie: Movie, status: WatchStatus) {
    try {
        await getOrInsertMovie(movie);
        await setMovieInteraction({
            userId: MOCK_USER_ID,
            movieId: movie.id,
            status: status
        });
        revalidatePath(`/movies/${movie.id}`);
        return { success: true, message: `Status set to ${status}`};
    } catch (error) {
        console.error('Error setting watch status:', error);
        return { success: false, message: 'Failed to set watch status.' };
    }
}


/**
 * Server action to add or update a review for a movie.
 */
export async function submitReviewAction(formData: FormData) {
  try {
    const movieId = formData.get('movieId') as string;
    const movieTitle = formData.get('movieTitle') as string;
    const rating = parseFloat(formData.get('rating') as string);
    const text = formData.get('reviewText') as string;

    if (!movieId || !rating || !text) {
        return { success: false, message: "Missing required fields." };
    }

    // Ensure the movie exists in our DB
    await getOrInsertMovie({ id: movieId, title: movieTitle });

    await addReview({
      userId: MOCK_USER_ID,
      movieId,
      rating,
      text,
      isPublic: formData.get('isPublic') === 'on',
    });

    revalidatePath(`/movies/${movieId}`);
    return { success: true, message: 'Review submitted successfully!' };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, message: 'Failed to submit review.' };
  }
}
