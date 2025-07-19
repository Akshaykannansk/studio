'use server';

// This file is being deactivated.
// In a real application, the logic here would be handled by API calls
// to a dedicated backend service (e.g., a FastAPI server).
// The components have been updated to reflect this, and this file's
// content is cleared to avoid confusion.

import type { WatchStatus } from '@/types/filmfriend';

const MOCK_USER_ID = '1';

/**
 * DEACTIVATED: This action would be replaced by a `POST /api/movies/like` call to your backend.
 */
export async function likeMovieAction(movieId: string, isLiked: boolean) {
  console.log(`[SIMULATION] User ${MOCK_USER_ID} ${isLiked ? 'liked' : 'unliked'} movie ${movieId}. This would be a backend API call.`);
  // In a real app:
  // await fetch('YOUR_FASTAPI_URL/movies/like', { 
  //   method: 'POST', 
  //   body: JSON.stringify({ userId: MOCK_USER_ID, movieId, isLiked }),
  //   headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ...' }
  // });
  return { success: true };
}

/**
 * DEACTIVATED: This action would be replaced by a `POST /api/movies/status` call to your backend.
 */
export async function setWatchStatusAction(movieId: string, status: WatchStatus | undefined) {
    console.log(`[SIMULATION] User ${MOCK_USER_ID} set watch status for movie ${movieId} to: ${status}. This would be a backend API call.`);
    // In a real app:
    // await fetch('YOUR_FASTAPI_URL/movies/status', { 
    //   method: 'POST', 
    //   body: JSON.stringify({ userId: MOCK_USER_ID, movieId, status }),
    //   headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ...' }
    // });
    return { success: true };
}
