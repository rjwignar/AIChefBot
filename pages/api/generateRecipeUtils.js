import OpenAI from 'openai';

export function generateDietPrompt(selectedDiet){
    const dietPrompt =
    `Generate three recipes based on the following diet: ${selectedDiet}.
    Recipes must be returned in a JSON object, where each recipe contains the following properties:
    id (string), name (string), ingredients (string array), ingredientQuantity (string array), steps (string array)
    Each id is a unique, randomized alphanumeric with exactly 10 characters. 
    Do not number the steps, but minimize token usage by giving concise steps.`;

    return dietPrompt;
}

export const repeatPrompt =
`Generate three more unique recipes that satisfy the original requirements defined.
Recipes must be returned in a JSON object with the same properties as before.
Do not number the steps, and be descriptive while minimizing token usage.`;
