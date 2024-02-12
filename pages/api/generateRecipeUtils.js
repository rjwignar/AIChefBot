import OpenAI from 'openai';

// This is how many recipes will be generated at a time. This may change once the generated recipes view is finalized
const recipeCount = 3;

// This is how we enforce the JSON response structure
const recipeJSONStructure = 
`{
    "recipes": = [
        {},
        {},
        {},
    ]
}
Where each recipe object must be an element of the "recipes" array.`;

// These are the JSON object requirements. Do NOT change these unless consulting Roy first.
// These have already been thoroughly tested
const recipeRequirements =
`Recipes must be returned in a JSON object, where each recipe is comma-separated.
The JSON object must always match this format:\n
${recipeJSONStructure}
Each recipe object must contain the following properties:
name (string),
description (string),
ingredients (string array),
steps (string array).
The description must be a short description of the recipe.
Each ingredient must include the ingredient's name, quantity, and if applicable, how it should be prepared (e.g, chopped, diced)
Each step must be comma-separated. Do not number the steps.
When applicable, include durations in a step (e.g. boil for 10 minutes).`;

export function generateDietPrompt(selectedDiet) {
    return `Generate ${recipeCount} recipes based on the following diet: ${selectedDiet}.\n` +
        recipeRequirements;
}

export function generateIngredientsPrompt(selectedIngredients) {
    return `Generate ${recipeCount} recipes based on the following list of ingredients: ${selectedIngredients}.\n` +
        recipeRequirements;
}

// Because selectedRecipes can contain an assortment of random recipes, we're not exactly sure what recipes will be produced with this current prompt
// In Sprint 3, we will have to experiment with this prompt.
// As well, we may want to generate a different number of recipes than we would if we were generating from strictly ingredients or diet
export function generateSimilarRecipesPrompt(selectedRecipes) {
    return `Generate ${recipeCount} recipes that are similar to this list of recipes: ${selectedRecipes}\n` +
        recipeRequirements;
}

export const repeatPrompt =
`Generate ${recipeCount} more unique recipes that satisfy the original requirements defined.
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

        // Append LLM response to messageHistory
        // NOTE: response.message is already in  { role, content } format, so no need to wrap it in JSON
        const llmResponse = response.message;
        messageHistory.push(llmResponse);

        // Parse response message content into JSON
        const messageContent = JSON.parse(response.message.content);

        // Extract recipe list from JSON
        const recipes = messageContent.recipes;

        // Console Logging
        console.log("Generated Recipes Below", recipes);

        // Return recipes and messageHistory as JSON response
        return { recipes, messageHistory };
    } catch (error) {
        throw new Error(error);
    }
};