'use server';

import type { WatchStatus } from '@/lib/db/schema';

// This is a placeholder for the logged-in user.
// In a real app, you would get this from your authentication system.
const MOCK_USER_ID = '1';

/**
 * Server action to "like" a movie.
 * DEACTIVATED: This is where you would call your FastAPI backend.
 */
export async function likeMovieAction(movieId: string, isLiked: boolean) {
  console.log(`[ACTION] User ${MOCK_USER_ID} would like movie ${movieId} (isLiked: ${isLiked})`);
  // Example API call:
  // await fetch('YOUR_FASTAPI_URL/movies/like', { 
  //   method: 'POST', 
  //   body: JSON.stringify({ userId: MOCK_USER_ID, movieId, isLiked }) 
  // });
  return { success: true, message: isLiked ? 'Movie liked' : 'Movie unliked' };
}

/**
 * Server action to set the watch status of a movie.
 * DEACTIVATED: This is where you would call your FastAPI backend.
 */
export async function setWatchStatusAction(movieId: string, status: WatchStatus | undefined) {
    console.log(`[ACTION] User ${MOCK_USER_ID} would set watch status for movie ${movieId} to: ${status}`);
    // Example API call:
    // await fetch('YOUR_FASTAPI_URL/movies/status', { 
    //   method: 'POST', 
    //   body: JSON.stringify({ userId: MOCK_USER_ID, movieId, status }) 
    // });
    return { success: true, message: `Status set to ${status}`};
}


/**
 * Server action to add or update a review for a movie.
 * DEACTIVATED: This is where you would call your FastAPI backend.
 */
export async function submitReviewAction(prevState: any, formData: FormData) {
    const reviewData = {
      userId: MOCK_USER_ID,
      movieId: formData.get('movieId') as string,
      movieTitle: formData.get('movieTitle') as string,
      rating: parseFloat(formData.get('rating') as string),
      text: formData.get('reviewText') as string,
      isPublic: formData.get('isPublic') === 'on',
    }
    
    console.log(`[ACTION] User ${MOCK_USER_ID} would submit a review:`, reviewData);
     // Example API call:
    // await fetch('YOUR_FASTAPI_URL/movies/review', { 
    //   method: 'POST', 
    //   body: JSON.stringify(reviewData)
    // });

    if (!reviewData.movieId || !reviewData.rating || !reviewData.text) {
        return { success: false, message: "Missing required fields." };
    }

    return { success: true, message: 'Review submitted successfully! (Simulated)' };
}
