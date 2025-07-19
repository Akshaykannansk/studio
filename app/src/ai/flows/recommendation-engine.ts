'use server';
/**
 * @fileOverview A recommendation engine that suggests movies and similar users.
 *
 * - getRecommendations - A function that handles the recommendation process.
 * - RecommendationInput - The input type for the getRecommendations function.
 * - RecommendationOutput - The return type for the getRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const UserProfileSchema = z.object({
  watchedMovies: z.array(z.object({ title: z.string(), year: z.number().optional() })).describe('Movies the user has watched.'),
  likedMovies: z.array(z.object({ title: z.string(), year: z.number().optional() })).describe('Movies the user has liked.'),
  movieLists: z.array(z.object({ name: z.string(), movies: z.array(z.object({ title: z.string() })) })).describe('Movie lists created by the user.'),
  tasteDescription: z.string().describe("A brief summary of the user's movie preferences."),
});

export const RecommendationInputSchema = z.object({
  recommendationType: z.enum(['WATCH_NEXT', 'SIMILAR_USERS']),
  userProfile: UserProfileSchema,
});
export type RecommendationInput = z.infer<typeof RecommendationInputSchema>;

export const RecommendationOutputSchema = z.object({
  watchNext: z.array(z.object({
    title: z.string(),
    year: z.number().optional(),
    reason: z.string(),
  })).optional().describe('A list of movies the user might want to watch next.'),
  similarUsers: z.array(z.object({
    username: z.string(),
    reason: z.string(),
  })).optional().describe('A list of users with similar taste.'),
});
export type RecommendationOutput = z.infer<typeof RecommendationOutputSchema>;

export async function getRecommendations(input: RecommendationInput): Promise<RecommendationOutput> {
  return recommendationFlow(input);
}

const prompt = ai.definePrompt({
    name: 'recommendationPrompt',
    input: { schema: RecommendationInputSchema },
    output: { schema: RecommendationOutputSchema },
    prompt: `You are a sophisticated movie recommendation engine.
Given the user's profile, generate recommendations based on the requested type.

User Profile:
- Taste: {{{userProfile.tasteDescription}}}
- Watched Movies: {{#each userProfile.watchedMovies}}{{this.title}}, {{/each}}
- Liked Movies: {{#each userProfile.likedMovies}}{{this.title}}, {{/each}}
- Lists: {{#each userProfile.movieLists}}{{this.name}}, {{/each}}

Recommendation Type: {{{recommendationType}}}

{{#if (eq recommendationType "WATCH_NEXT")}}
Generate a list of 5 movies for the "What to Watch Next" section. For each movie, provide a short, compelling reason why the user would like it.
{{/if}}

{{#if (eq recommendationType "SIMILAR_USERS")}}
Generate a list of 3 fictional usernames for "Film Friends" who have similar tastes. For each user, provide a brief, insightful reason explaining the similarity.
{{/if}}
`,
});

const recommendationFlow = ai.defineFlow(
  {
    name: 'recommendationFlow',
    inputSchema: RecommendationInputSchema,
    outputSchema: RecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
