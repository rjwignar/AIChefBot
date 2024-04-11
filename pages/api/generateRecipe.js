// pages/api/generateRecipe.js
import { NextResponse } from 'next/server.js';
import { generateDietPrompt, generateIngredientsPrompt, generateIngredientsWithDietPrompt, generateSimilarRecipesPrompt, generateRecipes, repeatPrompt } from './generateRecipeUtils.js';
import { generatePrompt } from './generateRecipeUtils.js';

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

const handler = async (req, res) => {
    // Assign request body based on serverless vs. Edge runtime
    const requestBody = isEdgeRuntime ? await req.json() : req.body;

    // Inspect Request Body Properties and print to server console
    inspectRequestBody(requestBody);

    isEdgeRuntime ? console.log("Edge runtime detected") : console.log("Serverless runtime detected");

    if (req.method === 'POST') {
        try {
            // Get message history
            const { messageHistory } = requestBody;
            // Generate a prompt
            const prompt = generatePrompt(requestBody);
            console.log("Generate prompt: ", prompt);
            // Generate recipes using prompt and message history
            const response = await generateRecipes(prompt, messageHistory);

            // ???
            if (isEdgeRuntime) {
                return NextResponse.json(response);
            }
            else {
                res.status(200).json(response);
            }            
        } catch (error) {
            // Bad response or error
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