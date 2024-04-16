// pages/api/generateRecipe.js
import { NextResponse } from 'next/server.js';
import { generateDietPrompt, generateIngredientsPrompt, generateIngredientsWithDietPrompt, generateSimilarRecipesPrompt, generateRecipes, repeatPrompt } from './generateRecipeUtils.js';

// Use Edge runtime when deployed on Vercel instead of serverless runtime to avoid 10-second timeout limit when generating recipes
export const config = {
    runtime: "edge",
}

// Check if using Edge runtime
const isEdgeRuntime = (typeof EdgeRuntime === 'string');

// Do not remove this function or more it to another file
// If you don't want this to appear in your console just comment the function call at the beginning of the handler
function inspectRequestBody(requestBody) {
    console.log("---------------------------------------------------");
    console.log("Inspecting Request Body");
    console.log("---------------------------------------------------");
    console.log("Entire Request Body", requestBody);
    console.log("List of Request Body properties", Object.getOwnPropertyNames(requestBody));
    console.log("Message History within Request Body", requestBody.messageHistory);
    console.log("Message History Length", requestBody.messageHistory.length);
    console.log("---------------------------------------------------");
    console.log("Inspection complete");
    console.log("---------------------------------------------------");
}

// SPRINT 3 TODO: INTEGRATE WITH RECIPE MANAGEMENT FRONTEND BY ADDING API CALL TO APPROPRIATE BUTTON ONCLICK
// API calls to /api/generateRecipe
const handler = async (req, res) => {
    // Assign request body based on serverless vs. Edge runtime
    const requestBody = isEdgeRuntime ? await req.json() : req.body;

    // Inspect Request Body Properties and print to server console
    inspectRequestBody(requestBody);

    isEdgeRuntime ? console.log("Edge runtime detected") : console.log("Serverless runtime detected");
    if (req.method === 'POST') {
        let response;
        try {
            // User is generating more recipes based on their initial recipe/diet constraints
            if (requestBody.messageHistory.length > 0) {

                // destructure messageHistory from requestBody as it's the only property of requestBody
                const { messageHistory } = requestBody;
                console.log("here is message history", messageHistory);

                // We use repeatPrompt to instruct LLM to reuse original instructions from initial request
                // Pass this along with messageHistory to LLM
                response = await generateRecipes(repeatPrompt, messageHistory);
            }
            else {
                if (requestBody.hasOwnProperty('selectedDiet') && requestBody.hasOwnProperty('selectedIngredients')) {
                    console.log("User has started generating recipes by ingredients and DIET!!!!!!!!!!!!!!!!");

                    // destructure selectedDiet and messageHistory properties from requestBody
                    const { selectedDiet, selectedIngredients, limitIngredients, messageHistory } = requestBody;

                    // Generate Diet prompt from selectedDiet
                    // Then pass it along with messageHistory to the LLM
                    response = await generateRecipes(generateIngredientsWithDietPrompt(selectedIngredients, selectedDiet, limitIngredients), messageHistory);
                }
                // User selected a diet and starts generating recipes
                else if (requestBody.hasOwnProperty('selectedDiet')) {
                    console.log("User has started generating recipes by diet!");

                    // destructure selectedDiet and messageHistory properties from requestBody
                    const { selectedDiet, messageHistory } = requestBody;

                    // Generate Diet prompt from selectedDiet
                    // Then pass it along with messageHistory to the LLM
                    response = await generateRecipes(generateDietPrompt(selectedDiet), messageHistory);
                }
                // User selected list of ingredients and starts generating recipes
                else if (requestBody.hasOwnProperty('selectedIngredients')) {
                    console.log("User has started generating recipes by ingredients!");

                    // destructure selectedIngredients and messageHistory properties from requestBody
                    const { selectedIngredients, limitIngredients, messageHistory } = requestBody;

                    // Generate Ingredients Prompt from selectedIngredients
                    // Then pass it along with messageHistory to the LLM
                    response = await generateRecipes(generateIngredientsPrompt(selectedIngredients, limitIngredients), messageHistory);
                }
                // User selected list of recipes from recipe manager and is generating recipes
                else if (requestBody.hasOwnProperty('selectedRecipes')) {
                    console.log("User is generating similar recipes from a selection in their recipe management page!");

                    // destructure selectedRecipes and messageHistory properties from requestBody
                    const { selectedRecipes, messageHistory } = requestBody;

                    // Generate Similar Recipes Prompt from selectedRecipes
                    // Then pass it along with messageHistory to the LLM
                    response = await generateRecipes(generateSimilarRecipesPrompt(selectedRecipes), messageHistory);
                }
            }
            // Push recipes and messageHistory in response
            if (isEdgeRuntime) {
                return NextResponse.json(response);
            }
            else {
                res.status(200).json(response);
            }

        } catch (error) {
            console.error('Error fetching recipes:', error);
            if (isEdgeRuntime) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            else {
                res.status(500).json({ error: error.message });
            }
        }
    } else {
        if (isEdgeRuntime) {
            return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 })
        }
        else {
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    }
}

export default handler;