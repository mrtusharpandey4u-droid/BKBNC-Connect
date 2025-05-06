import 'dotenv/config'; // Load environment variables
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
// Removed: import { defineNextjsPlugin } from '@genkit-ai/next'; - Causes error

// Initialize Genkit with required plugins
export const ai = genkit({
  plugins: [
    googleAI({
      // Optional: Specify API version or other configurations
      // apiVersion: 'v1beta',
    }),
    // Removed: await defineNextjsPlugin({...}) - Caused error
    // Add other plugins here (e.g., for Firebase, specific tools, etc.)
  ],
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info', // More logs in dev
  enableTracingAndMetrics: true, // Enable tracing (useful for debugging)
});

console.log('Genkit instance initialized.');
