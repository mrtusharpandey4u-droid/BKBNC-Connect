import 'dotenv/config'; // Ensure environment variables are loaded
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

// Import flows to make them available to the dev server if needed for reflection/UI,
// but they are primarily loaded via the main `ai` instance in genkit.ts
import './flows/answer-student-question';

// Configure Genkit for development using the shared `ai` instance is usually preferred.
// However, if specific dev-only configurations are needed, you can define them here.
// This basic setup ensures the dev UI can start. For actual execution, it relies
// on the configuration in `genkit.ts` when flows are called via the application.

console.log("Starting Genkit in development mode...");

// You might configure a separate Genkit instance for dev-specific tasks or tools if necessary
// For example, defining dev-only flows or using different plugins for local testing.
// If not needed, this file can be kept minimal or just ensure environment variables are loaded.

// Example of defining a dev-only flow (if necessary):
/*
const devTestFlow = genkit.defineFlow(
  { name: 'devTestFlow' },
  async () => {
    console.log('Running dev test flow');
    return 'Dev test successful';
  }
);
*/

// Export is needed to treat this as a module
export {};
