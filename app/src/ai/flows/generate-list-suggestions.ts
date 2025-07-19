'use server';
/**
 * @fileOverview AI flow for generating movie suggestions for a user's list.
 *
 * - generateListSuggestions - A function that suggests movies to add to a list.
 * - ListSuggestionInput - The input type for the flow.
 * - ListSuggestionOutput - The return type for the flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Movie } from '@/types/filmfriend';

const ListSuggestionInputSchema = z.object({
  listName: z.string().describe('The name of the movie list.'),
  listMovies: z.array(z.object({
    title: z.string(),
    year: z.number().optional(),
  })).describe('The movies currently in the list.'),
  tasteDescription: z.string().describe("A description of the user's general movie taste."),
});
export type ListSuggestionInput = z.infer<typeof ListSuggestionInputSchema>;

const ListSuggestionOutputSchema = z.object({
  suggestions: z.array(z.object({
    title: z.string(),
    year: z.number().optional(),
    reason: z.string(),
  })).describe('An array of movie suggestions.'),
});
export type ListSuggestionOutput = z.infer<typeof ListSuggestionOutputSchema>;


export async function generateListSuggestions(input: ListSuggestionInput): Promise<ListSuggestionOutput> {
  return generateListSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateListSuggestionsPrompt',
  input: { schema: ListSuggestionInputSchema },
  output: { schema: ListSuggestionOutputSchema },
  prompt: `You are a movie recommendation expert. Based on the user's taste, an existing movie list, and its current movies, suggest 5 new movies to add.

User's Taste: {{{tasteDescription}}}

List Name: {{{listName}}}

Current Movies in List:
{{#each listMovies}}
- {{this.title}} ({{this.year}})
{{/each}}

Provide 5 new suggestions that fit the theme of the list and the user's taste. For each suggestion, provide a brief reason why it's a good fit. Do not suggest movies that are already in the list.
`,
});

const generateListSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateListSuggestionsFlow',
    inputSchema: ListSuggestionInputSchema,
    outputSchema: ListSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
