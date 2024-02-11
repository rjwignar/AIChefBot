import OpenAI from 'openai';

// This is how many recipes will be generated at a time
const recipeCount = 3;

const recipeRequirements =
    `Recipes must be returned in a JSON object, where each recipe contains the following properties:
    id (string), name (string), ingredients (string array), ingredientQuantity (string array), steps (string array)
    Each id is a unique, randomized alphanumeric with exactly 10 characters. 
    Do not number the steps, but minimize token usage by giving concise steps.`;

export function generateDietPrompt(selectedDiet){
    return `Generate ${recipeCount} recipes based on the following diet: ${selectedDiet}.\n` + recipeRequirements;
}

export function generateIngredientsPrompt(selectedIngredients){
    return `Generate ${recipeCount} recipes based on the following list of ingredients: ${selectedIngredients}.\n` + recipeRequirements;
}

export function generateSimilarRecipesPrompt(selectedRecipes){
    return `Generate ${recipeCount} recipes that are similar to this list of recipes: ${selectedRecipes}\n` + recipeRequirements;
}

export const repeatPrompt =
`Generate three more unique recipes that satisfy the original requirements defined.
Recipes must be returned in a JSON object with the same properties as before.
Do not number the steps, and be descriptive while minimizing token usage.`;

export async function generateRecipes(prompt, messageHistory) {
    try {
        // Initialize OpenAI object using OPENAI_API_KEY
        const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

        // Append prompt to messageHistory
        // NOTE: The prompt is the message content from user, so we must wrap it in { role: "user", content: prompt}
        messageHistory.push({ role: "user", content: prompt });

        // Send request to OpenAI API
        // response_format of `json_object` guarantees JSON response from OpenAI API.
        // However, you MUST instruct the model to produce JSON (specify JSON in initial prompt)
        // NOTE: response_format property only supported by gpt4-turbo and all gpt-3.5-turbo models starting at gpt-3.5-turbo-1106 and later
        // See https://platform.openai.com/docs/api-reference/chat/create#chat-create-response_format for more information
        const completion = await openai.chat.completions.create({
            response_format: { "type": "json_object" },
            messages: messageHistory,
            model: "gpt-3.5-turbo-1106",
        });

        // Store OpenAI response
        const response = completion.choices[0];

        // Append initial LLM response to messageHistory
        // NOTE: response.message is already in  { role, content } format, so no need to wrap it in JSON
        const llmResponse = response.message;
        messageHistory.push(llmResponse);

        // Extract list of recipes from response
        const recipes = response.message.content;

        // Console Logging
        console.log("Generated Recipes Below", recipes);

        // Return recipes and messageHistory as JSON
        return {recipes, messageHistory};
    } catch (error) {
        throw new Error(error);
    }
};