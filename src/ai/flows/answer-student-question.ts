'use server';
/**
 * @fileOverview Flow to answer student questions about B. K. Birla Night College Kalyan.
 *
 * - answerStudentQuestion - A function that takes a student's question and returns an answer.
 * - AnswerStudentQuestionInput - The input type for the answerStudentQuestion function.
 * - AnswerStudentQuestionOutput - The return type for the answerStudentQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define Input Schema
const AnswerStudentQuestionInputSchema = z.object({
  question: z.string().describe('The question asked by the student.'),
});
export type AnswerStudentQuestionInput = z.infer<typeof AnswerStudentQuestionInputSchema>;

// Define Output Schema
const AnswerStudentQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the student question.'),
});
export type AnswerStudentQuestionOutput = z.infer<typeof AnswerStudentQuestionOutputSchema>;

// Define the exported wrapper function
export async function answerStudentQuestion(input: AnswerStudentQuestionInput): Promise<AnswerStudentQuestionOutput> {
  return answerStudentQuestionFlow(input);
}

// Define the prompt
const prompt = ai.definePrompt({
  name: 'answerStudentQuestionPrompt',
  model: 'gemini-1.5-flash-latest', // Specify the model to be used
  input: { schema: AnswerStudentQuestionInputSchema },
  output: { schema: AnswerStudentQuestionOutputSchema },
  prompt: `You are an AI assistant for B. K. Birla Night College Kalyan (BKBNC). Your role is to answer student questions accurately and concisely based on your knowledge about the college.

  Context about B. K. Birla Night College Kalyan:
  - Location: Kalyan, Maharashtra, India.
  - Affiliation: University of Mumbai.
  - Programs: Offers undergraduate programs primarily in Commerce (B.Com), potentially Arts (B.A.). Check official sources for the most current list.
  - Type: Night college, catering often to working students.
  - Known for: Providing educational opportunities for those who cannot attend regular day college.
  - Official Profile Page: https://bkbirlanightcollegekalyan.com/profile.aspx
  - College Code: 840 (This is a common piece of information students might ask for, especially for university forms or applications).

  Instructions:
  1.  Use the provided context and general knowledge about Indian colleges affiliated with the University of Mumbai.
  2.  Answer the student's question directly and clearly.
  3.  If the question is about specific details like exact fees, specific admission dates, or niche course details not generally known, advise the user to check the official college website or contact the administration office for the most accurate and up-to-date information.
  4.  If you don't know the answer or the question is outside the scope of the college, politely state that you don't have the information.
  5.  Maintain a helpful and professional tone.
  6.  If the student asks about the college's official profile, "about us", history, vision, mission, or similar detailed institutional information, direct them to the official college profile page. For example, you can say: "You can find detailed information about the college's profile, history, vision, and mission on their official website: https://bkbirlanightcollegekalyan.com/profile.aspx".
  7.  If the student asks for the "College Code", respond with "The College Code for B. K. Birla Night College Kalyan is 840."

  Student Question: {{{question}}}

  Answer:`,
});

// Define the flow
const answerStudentQuestionFlow = ai.defineFlow(
  {
    name: 'answerStudentQuestionFlow',
    inputSchema: AnswerStudentQuestionInputSchema,
    outputSchema: AnswerStudentQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    // Ensure output is not null or undefined before returning
    if (!output) {
        throw new Error("AI failed to generate an answer.");
    }
    return output;
  }
);


    
