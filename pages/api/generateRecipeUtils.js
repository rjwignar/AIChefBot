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

export function generateIngredientsPrompt(selectedIngredients, limitIngredients) {
    return `Generate ${recipeCount} recipes based on the following list of ingredients. 
        (Ignore any invalid ingredients or ingredients that doesn't make sense): ${selectedIngredients}.\n ${limitIngredients ? 
        `ONLY use the ingredients that I listed to generate the recipes. Don't use or add any other ingredients other than the 
        list I mentioned. Recipes should only be created using the listed ingredients.\n` : `Use the ingredients I listed and Add other ingredients that I haven't listed.\n`
        }` + recipeRequirements + 
        `If there is any invalid ingredients or ingredients that doesn't make sense (i.e. any electronic or unwanted objects, any empty string, words, etc...) then 
        ignore it and generate random recipes unless if there is any valid ingredients then use that to generate recipes instead of the invalid ingredients`;
}

export function generateIngredientsWithDietPrompt(selectedIngredients, selectedDiet, limitIngredients) {
    return `Generate ${recipeCount} recipes based on the following list of ingredients, enuring they align with the selected diet preference (${selectedDiet}).
        (Ignore any invalid ingredients or combinations that don't match the specified diet): ${selectedIngredients}.\n ${limitIngredients ? 
        `ONLY use the ingredients that I listed to generate the recipes. Don't use or add any other ingredients other than the 
        list I mentioned. Recipes should only be created using the listed ingredients.\n` : `Use the ingredients I listed and Add other ingredients that I haven't listed.\n`
        }` + recipeRequirements + 
        `If there are any ingredients that conflict with the selected diet (${selectedDiet}), such as meat products in a vegetarian or pescatarian
        diet, ensure that the generated recipes do not include those ingredients. Instead, substitute them with suitable alternatives that adhere 
        to the chosen dietary restrictions.`;
}

// Because selectedRecipes can contain an assortment of random recipes, we're not exactly sure what recipes will be produced with this current prompt
// In Sprint 3, we will have to experiment with this prompt.
// As well, we may want to generate a different number of recipes than we would if we were generating from strictly ingredients or diet
export function generateSimilarRecipesPrompt(selectedRecipes) {
    const selectedRecipesString = JSON.stringify({recipes: selectedRecipes}, null, 2);
    return `Generate ${recipeCount} recipes that are similar to this list of recipes: ${selectedRecipesString}\n` + 
            `Make sure that the recipes that are generated have some of the same ingredients in the new recipes.\n` +
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
        let recipes = messageContent.recipes;

        // Console Logging
        console.log("Generated Recipes Below", recipes);

        // Return recipes and messageHistory as JSON response
        return { recipes, messageHistory };
    } catch (error) {
        throw new Error(error);
    }
};