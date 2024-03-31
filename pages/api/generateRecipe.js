// pages/api/generateRecipe.js
import { NextRequest, NextResponse } from 'next/server.js';
import { generateDietPrompt, generateIngredientsPrompt,  generateIngredientsWithDietPrompt, generateSimilarRecipesPrompt, generateRecipes, repeatPrompt } from './generateRecipeUtils.js';

export const config = {
    runtime: "edge",
}
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
const regularHandler = async (req, res) => {
    console.log("Using regular serverless runtime!");
    // Inspect Request Body Properties and print to server console
    inspectRequestBody(req.body);
    if (req.method === 'POST') {
        try {
            // User is generating more recipes based on their initial recipe/diet constraints
            if (req.body.messageHistory.length > 0) {

                // destructure messageHistory from req.body as it's the only property of req.body
                const { messageHistory } = req.body;
                console.log("here is message history", messageHistory);

                // We use repeatPrompt to instruct LLM to reuse original instructions from initial request
                // Pass this along with messageHistory to LLM
                const response = await generateRecipes(repeatPrompt, messageHistory);

                // Push recipes and messageHistory in response
                res.status(200).json(response);
            }
            else {
                if(req.body.hasOwnProperty('selectedDiet') && req.body.hasOwnProperty('selectedIngredients')){
                    console.log("User has started generating recipes by ingredients and DIET!!!!!!!!!!!!!!!!");

                    // destructure selectedDiet and messageHistory properties from req.body
                    const { selectedDiet, selectedIngredients, messageHistory } = req.body;

                    // Generate Diet prompt from selectedDiet
                    // Then pass it along with messageHistory to the LLM
                    const response = await generateRecipes(generateIngredientsWithDietPrompt(selectedIngredients, selectedDiet), messageHistory);

                    // Push recipes and messageHistory in response
                    res.status(200).json(response);

                }
                // User selected a diet and starts generating recipes
                else if (req.body.hasOwnProperty('selectedDiet')) {
                    console.log("User has started generating recipes by diet!");

                    // destructure selectedDiet and messageHistory properties from req.body
                    const { selectedDiet, messageHistory } = req.body;

                    // Generate Diet prompt from selectedDiet
                    // Then pass it along with messageHistory to the LLM
                    const response = await generateRecipes(generateDietPrompt(selectedDiet), messageHistory);

                    // Push recipes and messageHistory in response
                    res.status(200).json(response);
                }
                // User selected list of ingredients and starts generating recipes
                else if (req.body.hasOwnProperty('selectedIngredients')) {
                    console.log("User has started generating recipes by ingredients!");

                    // destructure selectedIngredients and messageHistory properties from req.body
                    const { selectedIngredients, messageHistory } = req.body;

                    // Generate Ingredients Prompt from selectedIngredients
                    // Then pass it along with messageHistory to the LLM
                    const response = await generateRecipes(generateIngredientsPrompt(selectedIngredients), messageHistory);

                    // Push recipes and messageHistory in response
                    res.status(200).json(response);
                }

                // User selected list of recipes from recipe manager and is generating recipes
                else if (req.body.hasOwnProperty('selectedRecipes')) {
                    console.log("User is generating similar recipes from a selection in their recipe management page!");

                    // destructure selectedRecipes and messageHistory properties from req.body
                    const {selectedRecipes, messageHistory} = req.body;

                    // Generate Similar Recipes Prompt from selectedRecipes
                    // Then pass it along with messageHistory to the LLM
                    const response = await generateRecipes(generateSimilarRecipesPrompt(selectedRecipes), messageHistory);

                    // Push recipes and messageHistory in response
                    res.status(200).json(response);
                }
            }

        } catch (error) {
            console.error('Error fetching recipes:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

const edgeHandler = async (req, res) =>{
       // Inspect Request Body Properties and print to server console
       console.log("Using Edge functions runtime");
       console.log("is Edge time?",isEdgeRuntime);
       console.log("request", req);
       const request = await req.json();
       console.log("inspect after await", request);
       console.log("message history", request.messageHistory);
       inspectRequestBody(request);
       if (req.method === 'POST') {
           try {
               // User is generating more recipes based on their initial recipe/diet constraints
               if (request.messageHistory.length > 0) {
   
                   // destructure messageHistory from request as it's the only property of request
                   const { messageHistory } = request;
                   console.log("here is message history", messageHistory);
   
                   // We use repeatPrompt to instruct LLM to reuse original instructions from initial request
                   // Pass this along with messageHistory to LLM
                   const response = await generateRecipes(repeatPrompt, messageHistory);
                   console.log("response", response);
                   // Push recipes and messageHistory in response
                   return NextResponse.json(response);
               }
               else {
                   if(request.hasOwnProperty('selectedDiet') && request.hasOwnProperty('selectedIngredients')){
                       console.log("User has started generating recipes by ingredients and DIET!!!!!!!!!!!!!!!!");
   
                       // destructure selectedDiet and messageHistory properties from request
                       const { selectedDiet, selectedIngredients, messageHistory } = request;
   
                       // Generate Diet prompt from selectedDiet
                       // Then pass it along with messageHistory to the LLM
                       const response = await generateRecipes(generateIngredientsWithDietPrompt(selectedIngredients, selectedDiet), messageHistory);
   
                       // Push recipes and messageHistory in response
                       return NextResponse.json(response);
   
                   }
                   // User selected a diet and starts generating recipes
                   else if (request.hasOwnProperty('selectedDiet')) {
                       console.log("User has started generating recipes by diet!");
   
                       // destructure selectedDiet and messageHistory properties from request
                       const { selectedDiet, messageHistory } = request;
   
                       // Generate Diet prompt from selectedDiet
                       // Then pass it along with messageHistory to the LLM
                       const response = await generateRecipes(generateDietPrompt(selectedDiet), messageHistory);
                       console.log("response", response);
                       // Push recipes and messageHistory in response
                        return NextResponse.json(response);
                   }
                   // User selected list of ingredients and starts generating recipes
                   else if (request.hasOwnProperty('selectedIngredients')) {
                       console.log("User has started generating recipes by ingredients!");
   
                       // destructure selectedIngredients and messageHistory properties from request
                       const { selectedIngredients, messageHistory } = request;
   
                       // Generate Ingredients Prompt from selectedIngredients
                       // Then pass it along with messageHistory to the LLM
                       const response = await generateRecipes(generateIngredientsPrompt(selectedIngredients), messageHistory);
   
                       // Push recipes and messageHistory in response
                       return NextResponse.json(response);
                   }
   
                   // User selected list of recipes from recipe manager and is generating recipes
                   else if (request.hasOwnProperty('selectedRecipes')) {
                       console.log("User is generating similar recipes from a selection in their recipe management page!");
   
                       // destructure selectedRecipes and messageHistory properties from request
                       const {selectedRecipes, messageHistory} = request;
   
                       // Generate Similar Recipes Prompt from selectedRecipes
                       // Then pass it along with messageHistory to the LLM
                       const response = await generateRecipes(generateSimilarRecipesPrompt(selectedRecipes), messageHistory);
   
                       // Push recipes and messageHistory in response
                       return NextResponse.json(response);
                   }
                   else {
                       console.log("There's an invalid request!");
                   }
               }
   
           } catch (error) {
               console.error('Error fetching recipes:', error);
               return NextResponse.json({error: error.message}, { status: 500 });
           }
       } else {
           return NextResponse.json({error: `Method ${req.method} Not Allowed`}, { status: 405 })
       } 
}

const oldhandler = isEdgeRuntime ? edgeHandler : regularHandler;

const handler = async (req, res) => {
    console.log("Using updated handler!");
    // Inspect Request Body Properties and print to server console

    // Assign request body based on serverless vs. Edge runtime
    const requestBody = isEdgeRuntime ? await req.json() : req.body;
    inspectRequestBody(requestBody);
    isEdgeRuntime ? console.log("Edge runtime detected") : console.log("Serverless runtime detected");
    if (req.method === 'POST') {
        try {
            // User is generating more recipes based on their initial recipe/diet constraints
            if (requestBody.messageHistory.length > 0) {

                // destructure messageHistory from requestBody as it's the only property of requestBody
                const { messageHistory } = requestBody;
                console.log("here is message history", messageHistory);

                // We use repeatPrompt to instruct LLM to reuse original instructions from initial request
                // Pass this along with messageHistory to LLM
                const response = await generateRecipes(repeatPrompt, messageHistory);

                // Push recipes and messageHistory in response
                if (isEdgeRuntime){
                    return NextResponse.json(response);
                }
                else{
                    res.status(200).json(response);
                }
            }
            else {
                if(requestBody.hasOwnProperty('selectedDiet') && requestBody.hasOwnProperty('selectedIngredients')){
                    console.log("User has started generating recipes by ingredients and DIET!!!!!!!!!!!!!!!!");

                    // destructure selectedDiet and messageHistory properties from requestBody
                    const { selectedDiet, selectedIngredients, messageHistory } = requestBody;

                    // Generate Diet prompt from selectedDiet
                    // Then pass it along with messageHistory to the LLM
                    const response = await generateRecipes(generateIngredientsWithDietPrompt(selectedIngredients, selectedDiet), messageHistory);

                // Push recipes and messageHistory in response
                if (isEdgeRuntime){
                    return NextResponse.json(response);
                }
                else{
                    res.status(200).json(response);
                }

                }
                // User selected a diet and starts generating recipes
                else if (requestBody.hasOwnProperty('selectedDiet')) {
                    console.log("User has started generating recipes by diet!");

                    // destructure selectedDiet and messageHistory properties from requestBody
                    const { selectedDiet, messageHistory } = requestBody;

                    // Generate Diet prompt from selectedDiet
                    // Then pass it along with messageHistory to the LLM
                    const response = await generateRecipes(generateDietPrompt(selectedDiet), messageHistory);

                    // Push recipes and messageHistory in response
                    if (isEdgeRuntime){
                        return NextResponse.json(response);
                    }
                    else{
                        res.status(200).json(response);
                    }
                }
                // User selected list of ingredients and starts generating recipes
                else if (requestBody.hasOwnProperty('selectedIngredients')) {
                    console.log("User has started generating recipes by ingredients!");

                    // destructure selectedIngredients and messageHistory properties from requestBody
                    const { selectedIngredients, messageHistory } = requestBody;

                    // Generate Ingredients Prompt from selectedIngredients
                    // Then pass it along with messageHistory to the LLM
                    const response = await generateRecipes(generateIngredientsPrompt(selectedIngredients), messageHistory);

                    // Push recipes and messageHistory in response
                    if (isEdgeRuntime){
                        return NextResponse.json(response);
                    }
                    else{
                        res.status(200).json(response);
                    }
                }

                // User selected list of recipes from recipe manager and is generating recipes
                else if (requestBody.hasOwnProperty('selectedRecipes')) {
                    console.log("User is generating similar recipes from a selection in their recipe management page!");

                    // destructure selectedRecipes and messageHistory properties from requestBody
                    const {selectedRecipes, messageHistory} = requestBody;

                    // Generate Similar Recipes Prompt from selectedRecipes
                    // Then pass it along with messageHistory to the LLM
                    const response = await generateRecipes(generateSimilarRecipesPrompt(selectedRecipes), messageHistory);

                    // Push recipes and messageHistory in response
                    if (isEdgeRuntime){
                        return NextResponse.json(response);
                    }
                    else{
                        res.status(200).json(response);
                    }
                }
            }

        } catch (error) {
            console.error('Error fetching recipes:', error);
            if (isEdgeRuntime){
                return NextResponse.json({error: error.message}, { status: 500 });
            }
            else{
                res.status(500).json({ error: error.message });
            }    
        }
    } else {
        if (isEdgeRuntime){
            return NextResponse.json({error: `Method ${req.method} Not Allowed`}, { status: 405 })
        }
        else{
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }    
    }
}


export default handler;