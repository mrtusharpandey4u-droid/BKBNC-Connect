import 'dotenv/config'; // Load environment variables
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import nextjs from '@genkit-ai/next';

// Initialize Genkit with required plugins
export const ai = genkit({
  plugins: [
    googleAI({
      // Optional: Specify API version or other configurations
      // apiVersion: 'v1beta',
    }),
    nextjs(),
  ],
});

console.log('Genkit instance initialized.');
