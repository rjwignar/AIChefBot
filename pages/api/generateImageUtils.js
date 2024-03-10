// pages/api/generateImageUtils.js
import OpenAI from 'openai';

const openai = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY})

const generateOneRecipeImage = async (recipe) =>{
    const imagePrompt = `${recipe.name}, prepared using the following ingredients: ${recipe.ingredients}.
    The dish is beautifully plated and presented as though featured on a high-end restaurant menu.`
    const image = await openai.images.generate({
        model: "dall-e-2",
        prompt: imagePrompt,
    });

    // give the recipe object a new property, imageURL
    recipe.imageURL = image.data[0].url;

    // return updated recipe object
    return recipe;
}

export async function generateRecipeImages(recipes){
    try{
        const recipesWithImagesPromise = recipes.map(recipe => generateOneRecipeImage(recipe));
        const recipesWithImages = await Promise.all(recipesWithImagesPromise);

        console.log("array of recipes with images", recipesWithImages);

        return recipesWithImages;
    } catch (error) {
        throw new Error(error);
    }
}