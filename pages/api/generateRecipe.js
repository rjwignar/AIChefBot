// pages/api/generateRecipe.js
import OpenAI from 'openai';

// API calls to /api/generateRecipe
export default async function handler(req, res) {


    const generateRecipesByDiet = async (selectedDiet, messageHistory) =>{
        try {
            // Initialize OpenAI object using OPENAI_API_KEY
            const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

            // Create prompt
            const prompt =
                `Generate three recipes based on the following diet: ${selectedDiet}.
            Recipes must be returned in a JSON object, where each recipe contains the following properties:
            id (string), name (string), ingredients (string array), ingredientQuantity (string array), steps (string array)
            Each id is a unique, randomized alphanumeric with exactly 10 characters. 
            Do not number the steps, but minimize token usage by giving concise steps.`;

            // Send request to OpenAI API
            // response_format of `json_object` guarantees JSON response from OpenAI API.
            // However, you MUST instruct the model to produce JSON (specify JSON in initial prompt)
            // NOTE: response_format property only supported by gpt4-turbo and all gpt-3.5-turbo models starting at gpt-3.5-turbo-1106 and later
            // See https://platform.openai.com/docs/api-reference/chat/create#chat-create-response_format for more information
            const completion = await openai.chat.completions.create({
                response_format: { "type": "json_object" },
                messages: [{ role: "user", content: prompt }],
                model: "gpt-3.5-turbo-1106",
            });

            // Store OpenAI response
            const response = completion.choices[0];

            // Append initial message prompt to messageHistory
            // NOTE: The prompt is the message content from user, so we must wrap it in { role: "user", content: prompt}
            messageHistory.push({ role: "user", content: prompt});

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
            res.status(200).json({recipes, messageHistory});
        } catch (error) {
            console.error('Error fetching recipes:', error);
            res.status(500).json({ error: 'Error fetching recipes' });
        }
    };

    const generateMoreRecipesByDiet = async (selectedDiet, messageHistory) => {
        try {
            // Initialize OpenAI object using OPENAI_API_KEY
            const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

            // Create prompt
            const prompt =
                `Generate three more unique recipes that satisfy the original requirements defined.
            Recipes must be returned in a JSON object with the same properties as before.
            Do not number the steps, and be descriptive while minimizing token usage.`;

            // Append initial message prompt to messageHistory
            // NOTE: The prompt is the message content from user, so we must wrap it in { role: "user", content: prompt}
            messageHistory.push({ role: "user", content: prompt });

            // Send request to OpenAI API with message history
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

            // Append LLM response to messageHistory
            // NOTE: response.message is already in  { role, content } format, so no need to wrap it in JSON
            const llmResponse = response.message;
            messageHistory.push(llmResponse);
            
            // Extract list of recipes from response
            const recipes = response.message.content;
            
            // Console Logging
            console.log('llm response', llmResponse);
            console.log(recipes);
            console.log('Server response:', completion); // Add this line to log the response
            console.log('Message below', completion.choices[0].message);
            console.log(completion.choices[0]);
            console.log("Message History after generating more recipes", messageHistory);

            // Push recipes and messageHistory in response
            res.status(200).json({recipes, messageHistory});
        } catch (error) {
            console.error('Error fetching recipes:', error);
            res.status(500).json({ error: 'Error fetching recipes' });
        }
    };
    if (req.method === 'POST') {
        const { selectedDiet, messageHistory } = req.body;
        console.log("type of messageHistory", typeof messageHistory);
        console.log("Message history length:", messageHistory.length);
        console.log("Message history", messageHistory);
        
        if (messageHistory.length === 0) {
            generateRecipesByDiet(selectedDiet, messageHistory);
        }
        else {
            generateMoreRecipesByDiet(selectedDiet, messageHistory);
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}