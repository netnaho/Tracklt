// categorize-transaction.ts
'use server';
/**
 * @fileOverview Provides intelligent category suggestions for transactions based on their description.
 *
 * - categorizeTransaction - A function that suggests expense categories for a given transaction description.
 * - CategorizeTransactionInput - The input type for the categorizeTransaction function.
 * - CategorizeTransactionOutput - The return type for the categorizeTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTransactionInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction to categorize.'),
});
export type CategorizeTransactionInput = z.infer<typeof CategorizeTransactionInputSchema>;

const CategorizeTransactionOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .describe('The suggested category for the transaction based on its description.'),
  confidenceScore: z
    .number()
    .describe('A score between 0 and 1 indicating the confidence level of the suggested category.'),
});
export type CategorizeTransactionOutput = z.infer<typeof CategorizeTransactionOutputSchema>;

export async function categorizeTransaction(
  input: CategorizeTransactionInput
): Promise<CategorizeTransactionOutput> {
  return categorizeTransactionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTransactionPrompt',
  input: {schema: CategorizeTransactionInputSchema},
  output: {schema: CategorizeTransactionOutputSchema},
  prompt: `You are an expert financial advisor specializing in expense categorization.

  Given the following transaction description, suggest the most appropriate expense category.

  Transaction Description: {{{transactionDescription}}}

  Consider common expense categories such as:
  - Groceries
  - Dining
  - Transportation
  - Entertainment
  - Utilities
  - Rent
  - Shopping
  - Travel
  - Healthcare
  - Education
  - Personal Care
  - Miscellaneous

  Provide a confidence score between 0 and 1 for your suggestion.
  `,
});

const categorizeTransactionFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionFlow',
    inputSchema: CategorizeTransactionInputSchema,
    outputSchema: CategorizeTransactionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
