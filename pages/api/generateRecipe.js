// pages/api/generateRecipe.js
import OpenAI from 'openai';
import { generateDietPrompt, repeatPrompt } from './generateRecipeUtils.js';
// API calls to /api/generateRecipe
export default async function handler(req, res) {

    const generateRecipes = async (prompt, messageHistory) => {
        try {
            // Initialize OpenAI object using OPENAI_API_KEY
            const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });


            // Append initial message prompt to messageHistory
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

            // Append initial LLM response to messageHistory
            // NOTE: response.message is already in  { role, content } format, so no need to wrap it in JSON
            const llmResponse = response.message;
            messageHistory.push(llmResponse);


            // Extract list of recipes from response
            const recipes = response.message.content;

            // Console Logging
            console.log(recipes);
            console.log('Server response:', completion); // Add this line to log the response
            console.log('Message below', completion.choices[0].message);
            console.log(completion.choices[0]);
            console.log('llm response', llmResponse);
            console.log("Message History", messageHistory);

            // Push recipes and messageHistory in response
            res.status(200).json({ recipes, messageHistory });
        } catch (error) {
            console.error('Error fetching recipes:', error);
            res.status(500).json({ error: 'Error fetching recipes' });
        }
    };

    if (req.method === 'POST') {
        // User is generating more recipes based on their initial recipe/diet constraints
        if (req.body.messageHistory.length > 0){
            // destructure messageHistory from req.body as it's the only property of req.body
            const {messageHistory} = req.body;
            console.log("here is message history",messageHistory);

            // Send repeatPrompt so LLM reuses original initial instructions
            generateRecipes(repeatPrompt, messageHistory);
        }
        else{
            // User selected a diet and starts generating recipes
            if (req.body.hasOwnProperty('selectedDiet')){
                console.log("User has started generating recipes by diet!");

                // destructure selectedDiet and messageHistory properties from req.body
                const { selectedDiet, messageHistory } = req.body;

                generateRecipes(generateDietPrompt(selectedDiet), messageHistory);
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