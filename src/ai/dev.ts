import { config } from 'dotenv';
config();

import '@/ai/flows/review-summarizer.ts';
import '@/ai/flows/generate-list-suggestions.ts';
import '@/ai/flows/recommendation-engine.ts';
