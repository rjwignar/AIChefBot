import { generateRecipeImages } from "../../generateImageUtils";
import { NextResponse } from 'next/server.js';
// Use Edge runtime when deployed on Vercel instead of serverless runtime to avoid 10-second timeout limit when generating recipes
export const config = {
    runtime: "edge",
}

// Check if using Edge runtime
const isEdgeRuntime = (typeof EdgeRuntime === 'string');

isEdgeRuntime ? console.log("Edge runtime detected") : console.log("Serverless runtime detected");
// handler for all relevant requests to /api/images/openai/request
async function handler(req, res) {
    // Assign request body based on serverless vs. Edge runtime
    const requestBody = isEdgeRuntime ? await req.json() : req.body;

    switch (req.method) {
        // POST
        case "POST": {
            try {
                // view recipes
                const recipes = requestBody.recipes;
                console.log("recipes to be processed", recipes);

                // Use an OpenAI DALL-E model to generate an appropriate image and add an imageURL property to each recipe
                const recipesWithImages = await generateRecipeImages(recipes);

                // Console Logging
                console.log("Generated Recipes Below with ImageURLS", recipesWithImages);
                
                // Push recipes with new 'tempImageURL' property in response
                if (isEdgeRuntime) {
                    return NextResponse.json(recipesWithImages);
                }
                else {
                    res.status(200).json(recipesWithImages);
                }
                // return {recipesWithImages};
            } catch (err) {
                console.error({ message: "Failed to generate recipe image(s).", "Error: ": err });
                if (isEdgeRuntime) {
                    return NextResponse.json({ error: error.message }, { status: 500 });
                }
                else {
                    res.status(500).json({ error: error.message });
                }
            }
        }
    }
}

export default handler;
