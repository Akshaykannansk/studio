// src/ai/flows/generate-list-suggestions.ts
'use server';

/**
 * @fileOverview Generates movie suggestions for a given list using AI.
 *
 * - generateListSuggestions - A function that generates movie suggestions for a given list.
 * - GenerateListSuggestionsInput - The input type for the generateListSuggestions function.
 * - GenerateListSuggestionsOutput - The return type for the generateListSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateListSuggestionsInputSchema = z.object({
  listName: z.string().describe('The name of the movie list.'),
  movieTitles: z.array(z.string()).describe('The titles of the movies currently in the list.'),
  userTaste: z.string().describe('The user preference for movies to tailor recommendation.'),
});
export type GenerateListSuggestionsInput = z.infer<typeof GenerateListSuggestionsInputSchema>;

const GenerateListSuggestionsOutputSchema = z.object({
  suggestedMovies: z.array(z.string()).describe('A list of suggested movie titles to add to the list.'),
});
export type GenerateListSuggestionsOutput = z.infer<typeof GenerateListSuggestionsOutputSchema>;

export async function generateListSuggestions(input: GenerateListSuggestionsInput): Promise<GenerateListSuggestionsOutput> {
  return generateListSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateListSuggestionsPrompt',
  input: {schema: GenerateListSuggestionsInputSchema},
  output: {schema: GenerateListSuggestionsOutputSchema},
  prompt: `You are a movie expert. Given the name of a movie list and the movies currently in it, suggest other movies that would be a good fit for the list, based on user preference.

List Name: {{{listName}}}
Existing Movies: {{#each movieTitles}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
User Taste: {{{userTaste}}}

Suggest movies similar to the movies in the existing list. Return ONLY movie titles in the suggestedMovies array.
`,
});

const generateListSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateListSuggestionsFlow',
    inputSchema: GenerateListSuggestionsInputSchema,
    outputSchema: GenerateListSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
