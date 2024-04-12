import { generateRecipeImages } from "../../generateImageUtils";

// handler for all relevant requests to /api/images/openai/request
async function handler(req, res) {
    switch (req.method) {
        // POST
        case "POST": {
            try {
                // view recipes
                const recipes = req.body.recipes;
                console.log("recipes to be processed", recipes);

                // Use an OpenAI DALL-E model to generate an appropriate image and add an imageURL property to each recipe
                const recipesWithImages = await generateRecipeImages(recipes);

                // Console Logging
                console.log("Generated Recipes Below with ImageURLS", recipesWithImages);

                res.status(200).json(recipesWithImages);
                // return {recipesWithImages};
            } catch (err) {
                res.status(500).json({ message: "Failed to generate recipe image(s).", "Error: ": err });
            }
        }
    }
}

export default handler;
