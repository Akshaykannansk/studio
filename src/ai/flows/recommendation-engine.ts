// src/ai/flows/recommendation-engine.ts
'use server';
/**
 * @fileOverview A comprehensive recommendation engine for movies and users.
 *
 * - getRecommendations - A function that handles various recommendation tasks.
 * - RecommendationInput - The input type for the getRecommendations function.
 * - RecommendationOutput - The return type for the getRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MovieSchema = z.object({
  title: z.string(),
  year: z.number().optional(),
  genres: z.array(z.string()).optional(),
});

const UserProfileSchema = z.object({
  watchedMovies: z.array(MovieSchema).describe("Movies the user has watched."),
  likedMovies: z.array(MovieSchema).describe("Movies the user has explicitly liked."),
  movieLists: z.array(z.object({
    name: z.string(),
    movies: z.array(MovieSchema),
  })).describe("User's created movie lists."),
  tasteDescription: z.string().describe("A short description of the user's taste in movies."),
});

export const RecommendationInputSchema = z.object({
  userProfile: UserProfileSchema,
  recommendationType: z.enum(['LIST_SUGGESTIONS', 'WATCH_NEXT', 'SIMILAR_USERS']),
  // Context for specific recommendation types
  context: z.object({
    listName: z.string().optional().describe("The name of the list to get suggestions for. Required for 'LIST_SUGGESTIONS' type."),
    listMovies: z.array(MovieSchema).optional().describe("The movies currently in the list. Required for 'LIST_SUGGESTIONS' type."),
  }).optional(),
});
export type RecommendationInput = z.infer<typeof RecommendationInputSchema>;

export const RecommendationOutputSchema = z.object({
  suggestedMovies: z.array(z.string()).optional().describe("A list of suggested movie titles."),
  similarUsers: z.array(z.object({
    username: z.string(),
    reason: z.string(),
  })).optional().describe("A list of users with similar taste and why they are a match."),
});
export type RecommendationOutput = z.infer<typeof RecommendationOutputSchema>;


export async function getRecommendations(input: RecommendationInput): Promise<RecommendationOutput> {
  return recommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendationPrompt',
  input: {schema: RecommendationInputSchema},
  output: {schema: RecommendationOutputSchema},
  prompt: `You are a world-class movie recommendation engine named FilmFriend AI.
Your goal is to provide personalized and insightful recommendations based on a user's profile.

User Profile:
- Taste: {{{userProfile.tasteDescription}}}
- Watched Movies: {{#each userProfile.watchedMovies}}{{this.title}}{{#unless @last}}, {{/unless}}{{/each}}
- Liked Movies: {{#each userProfile.likedMovies}}{{this.title}}{{#unless @last}}, {{/unless}}{{/each}}

You will perform one of the following tasks based on the 'recommendationType'.

{{#if (eq recommendationType "LIST_SUGGESTIONS")}}
Task: Suggest movies to add to a specific list.
List Name: {{{context.listName}}}
Movies already in the list: {{#each context.listMovies}}{{this.title}}{{#unless @last}}, {{/unless}}{{/each}}

Based on the movies already in the list and the user's general taste, suggest 3-5 new movies that would be a perfect fit.
The suggestions should be complementary and enhance the theme of the list.
Return ONLY the movie titles in the 'suggestedMovies' array.
{{/if}}

{{#if (eq recommendationType "WATCH_NEXT")}}
Task: Recommend movies for the user to watch next.

Based on the user's entire profile (watched, liked, lists), suggest 5 movies they would likely enjoy.
Provide a diverse set of recommendations that touch upon different aspects of their taste.
Do not suggest movies that are already in their watched or liked history.
Return ONLY the movie titles in the 'suggestedMovies' array.
{{/if}}

{{#if (eq recommendationType "SIMILAR_USERS")}}
Task: Find other users with similar tastes.

Analyze the user's profile and invent 3 fictional user profiles who would be great "film friends" for this user.
For each fictional user, provide a creative username and a short, compelling reason explaining why their tastes align.
Example reason: "Like you, @classic_connoisseur appreciates timeless black-and-white cinema but also shares your love for modern sci-fi epics."
Return the users in the 'similarUsers' array.
{{/if}}
`,
});

const recommendationFlow = ai.defineFlow(
  {
    name: 'recommendationFlow',
    inputSchema: RecommendationInputSchema,
    outputSchema: RecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
