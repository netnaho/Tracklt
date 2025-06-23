"use server";

import { categorizeTransaction } from "@/ai/flows/categorize-transaction";
import { z } from "zod";

const SuggestionInput = z.object({
  description: z.string(),
});

export async function getCategorySuggestion(formData: FormData) {
  try {
    const validatedData = SuggestionInput.safeParse({
      description: formData.get("description"),
    });

    if (!validatedData.success) {
      return { error: "Invalid input." };
    }

    if (!validatedData.data.description) {
        return { suggestion: null };
    }

    const result = await categorizeTransaction({
      transactionDescription: validatedData.data.description,
    });
    
    return { suggestion: result.suggestedCategory };
  } catch (e) {
    console.error(e);
    return { error: "Failed to get suggestion." };
  }
}
