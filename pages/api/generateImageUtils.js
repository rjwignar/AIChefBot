// pages/api/generateImageUtils.js
import OpenAI from 'openai';


const generateOneRecipeImage = async (recipe) =>{
    try{
        const openai = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY});
        const imagePrompt = `${recipe.name}, prepared using the following ingredients: ${recipe.ingredients}.
        The dish is beautifully plated and presented as though featured on a high-end restaurant menu.`
        const image = await openai.images.generate({
            model: "dall-e-2",
            prompt: imagePrompt,
        });
        
        // give the recipe object a new property, tempImageURL
        // this will be a variation of https://oaidalleapiprodscus.blob.core.windows.net/…ig=abcde
        // openAI hosts these images for only an hour, so this image must be saved to an image storage service Cloudinary before the URL expires
        recipe.tempImageURL = image.data[0].url;
        
        // return updated recipe object
        return recipe;
    } catch (error) {
        // Sometimes the DALL-E model will return "400 Bad Request" if the prompt violates their strict content policy
        // If this happens, we don't want to throw the error as it will suspend the app in the recipe generation animation
        // We just want to log the error and return unmodified recipe with no generated image
        // When displaying this recipe, the recipe card will instead have the placeholder image
        console.error(error);
        return recipe;
    }
}

export async function generateRecipeImages(recipes){
    try{
        // make parallel calls to generateOneRecipeImage to add an AI-generate image to each recipe
        const recipesWithImagesPromise = recipes.map(recipe => generateOneRecipeImage(recipe));
        const recipesWithImages = await Promise.all(recipesWithImagesPromise);

        console.log("array of recipes with images", recipesWithImages);

        // return array of recipes, now with an AI-generated image
        return recipesWithImages;
    } catch (error) {
        throw new Error(error);
    }
}

export async function requestImageGeneration(recipes) {
    // if there is an AI-generated image, use it (tempImageURL)
    // otherwise, use placeholder image
    console.log("recipes to be sent", recipes);
    const res = await fetch(`/api/images/openai/request`, {
       method: "POST",
       headers: {
          "Content-Type": "application/json",
       },
       body: JSON.stringify({recipes: recipes}),
    });
    if (!res.ok) {
        throw new Error(`Network response was not ok: ${res.statusText}`);
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
    const recipesWithImage = await res.json();

    console.log("extracted data", recipesWithImage);
    return recipesWithImage;
 }