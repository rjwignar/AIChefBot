// pages/api/generateRecipe.js
import OpenAI from 'openai';

// API calls to /api/generateRecipe
export default async function handler(req, res) {


    const generateRecipesByDiet = async (selectedDiet, messageHistory) =>{
        try {
            const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
            console.log(req.body);
            const prompt =
                `Generate three recipes based on the following diet: ${selectedDiet}.
            Recipes must be returned in a JSON object, where each recipe contains the following properties:
            id (string), name (string), ingredients (string array), ingredientQuantity (string array), steps (string array)
            Each id is a unique, randomized alphanumeric with exactly 10 characters. 
            Do not number the steps, but minimize token usage by giving concise steps.`;
            const completion = await openai.chat.completions.create({
                response_format: { "type": "json_object" },
                messages: [{ role: "user", content: prompt }],
                model: "gpt-3.5-turbo-1106",
            });

            // store response
            const response = completion.choices[0];
            // append initial message prompt to messageHistory
            messageHistory.push({ role: "user", content: prompt});
            // append initial LLM response to messageHistory

            // response.message already in form of { role, content }
            const llmResponse = response.message;
            console.log('llm response', llmResponse);
            messageHistory.push(llmResponse);

            // take recipes only
            const recipes = response.message.content;
            console.log(recipes);
            console.log('Server response:', completion); // Add this line to log the response
            console.log('Message below', completion.choices[0].message);
            console.log(completion.choices[0]);

            console.log("Message History", messageHistory);
            // push recipes and messageHistory
            res.status(200).json({recipes, messageHistory});
        } catch (error) {
            console.error('Error fetching recipes:', error);
            res.status(500).json({ error: 'Error fetching recipes' });
        }
    };

    const generateMoreRecipesByDiet = async (selectedDiet, messageHistory) => {
        try {
            const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
            // console.log(req.body);
            // const { selectedDiet } = req.body;
            console.log("generating more recipes based on diet", selectedDiet);

            const prompt =
                `Generate three more unique recipes that satisfy the original requirements defined.
            Recipes must be returned in a JSON object with the same properties as before.
            Do not number the steps, and be descriptive while minimizing token usage.`;

            // append message prompt to messageHistory
            messageHistory.push({ role: "user", content: prompt });

            // pass messageHistory
            const completion = await openai.chat.completions.create({
                response_format: { "type": "json_object" },
                messages: messageHistory,
                model: "gpt-3.5-turbo-1106",
            });

            // store response
            const response = completion.choices[0];

            // append initial LLM response to messageHistory

            const llmResponse = response.message;
            console.log('llm response', llmResponse);
            messageHistory.push(llmResponse);

            // take recipes only
            const recipes = response.message.content;
            console.log(recipes);
            console.log('Server response:', completion); // Add this line to log the response
            console.log('Message below', completion.choices[0].message);
            console.log(completion.choices[0]);

            console.log("Message History after generating more recipes", messageHistory);
            // push recipes and messageHistory
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