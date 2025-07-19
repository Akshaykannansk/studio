
export interface User {
  id: string;
  username: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  favoriteMovies?: Movie[];
  followersCount?: number;
  followingCount?: number;
}

export type WatchStatus = 'watched' | 'rewatched' | 'want-to-watch';

export interface Movie {
  id: string;
  title: string;
  year?: number;
  posterUrl: string;
  tmdbId?: string;
  genres?: string[];
  director?: string;
  cast?: string[];
  overview?: string;
  userRating?: number; // User's rating for this movie, 0.5 - 5.0
  averageRating?: number; // Average rating from all users
  watchStatus?: WatchStatus;
  isLiked?: boolean; // Whether the current user has liked this movie
  dataAiHint?: string;
}

export interface Review {
  id: string;
  user: User;
  movie: Movie;
  rating: number; // 0.5 - 5.0
  text: string;
  isPublic: boolean;
  createdAt: string;
  likesCount?: number;
}

export interface MovieLogEntry {
  id: string;
  user: User;
  movie: Movie;
  status: 'watched' | 'rewatched' | 'want-to-watch';
  loggedAt: string; 
  rating?: number; // Rating given at the time of logging
  review?: Review; // Optional review linked to this log
}

export interface MovieList {
  id: string;
  name: string;
  description?: string;
  owner: User;
  movies: Movie[];
  isPublic: boolean;
  likesCount?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListComment {
  id: string;
  listId: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface TMDbMovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average?: number;
}
