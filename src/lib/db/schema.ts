import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string().optional().nullable(),
  avatar_url: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});
export type User = z.infer<typeof UserSchema>;

export const MovieSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.number().optional().nullable(),
  poster_url: z.string().optional().nullable(),
  overview: z.string().optional().nullable(),
});
export type Movie = z.infer<typeof MovieSchema>;

export const WatchStatusSchema = z.enum(['watched', 'want_to_watch', 'rewatched']);
export type WatchStatus = z.infer<typeof WatchStatusSchema>;

export const UserMovieInteractionSchema = z.object({
    user_id: z.string(),
    movie_id: z.string(),
    liked: z.boolean().optional().nullable(),
    status: WatchStatusSchema.optional().nullable(),
});
export type UserMovieInteraction = z.infer<typeof UserMovieInteractionSchema>;

export const ReviewSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  movie_id: z.string(),
  rating: z.number().min(0.5).max(5.0).optional().nullable(),
  text: z.string().optional().nullable(),
  is_public: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});
export type Review = z.infer<typeof ReviewSchema>;
