// pages/api/generateRecipe.js
import { generateDietPrompt, generateRecipes, repeatPrompt } from './generateRecipeUtils.js';

// API calls to /api/generateRecipe
export default async function handler(req, res) {

    if (req.method === 'POST') {
        try{

            // User is generating more recipes based on their initial recipe/diet constraints
            if (req.body.messageHistory.length > 0){
                // destructure messageHistory from req.body as it's the only property of req.body
                const {messageHistory} = req.body;
                console.log("here is message history",messageHistory);
                
                // Send repeatPrompt so LLM reuses original initial instructions
                const response = await generateRecipes(repeatPrompt, messageHistory);
                
                // Push recipes and messageHistory in response
                res.status(200).json(response);
            }
            else{
                // User selected a diet and starts generating recipes
                if (req.body.hasOwnProperty('selectedDiet')){
                    console.log("User has started generating recipes by diet!");
                    
                    // destructure selectedDiet and messageHistory properties from req.body
                    const { selectedDiet, messageHistory } = req.body;
                    
                    const response = await generateRecipes(generateDietPrompt(selectedDiet), messageHistory);
                    
                    // Push recipes and messageHistory in response
                    res.status(200).json(response);
                }
                // User selected list of ingredients and starts generating recipes
                else if (req.body.hasOwnProperty('selectedIngredients')){
                    console.log("User has started generating recipes by ingredients!");
                }
                // User selected list of recipes from recipe manager and is generating recipes
                else if (req.body.hasOwnProperty('selectedRecipes')){
                    console.log("User is generating similar recipes from a selection in their recipe management page!");
                }
            }
            
        } catch(error){
            console.error('Error fetching recipes:', error);
            res.status(500).json({ error: error.message });
        }
        // console.log("request body message history length", req.body.messageHistory.length);
        // console.log("request body", req.body);
        // console.log("is there a selectedDiet property", req.body.hasOwnProperty('selectedDiet'));
        // console.log("req body selectedDiet is null?", req.body.selectedDiet == null);
        // const { selectedDiet, messageHistory } = req.body;
        // console.log("type of messageHistory", typeof messageHistory);
        // console.log("Message history length:", messageHistory.length);
        // console.log("Message history", messageHistory);

        // if 
        // if (messageHistory.length === 0) {
        //     generateRecipesByDiet(selectedDiet, messageHistory);
        // }
        // else {
        //     generateMoreRecipesByDiet(selectedDiet, messageHistory);
        // }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}