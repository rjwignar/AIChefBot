// pages/api/generateImageUtils.js
import OpenAI from 'openai';

const openai = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY})

const generateOneRecipeImage = async (recipe) =>{
    try{
        const imagePrompt = `${recipe.name}, prepared using the following ingredients: ${recipe.ingredients}.
        The dish is beautifully plated and presented as though featured on a high-end restaurant menu.`
        const image = await openai.images.generate({
            model: "dall-e-2",
            prompt: imagePrompt,
        });
        
        // give the recipe object a new property, tempImgURL
        // this will be a variation of https://oaidalleapiprodscus.blob.core.windows.net/…ig=abcde
        // openAI hosts these images for only an hour, so this image will be saved to Cloudinary
        recipe.tempImageURL = image.data[0].url;
        
        // return updated recipe object
        return recipe;
    } catch (error) {
        throw new Error(error);
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