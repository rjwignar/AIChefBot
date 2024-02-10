// pages/api/generateRecipe.js
import OpenAI from 'openai';

// API calls to /api/generateRecipe
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
            console.log(req.body);
            const { selectedDiet } = req.body;

            const prompt = 
            `Generate three recipes based on the following diet: ${selectedDiet}.
            Recipes must be returned in a JSON object, where each recipe contains the following properties:
            id (random 10-character alphanumeric string),name (string), ingredients (string array), ingredientQuantity (string array), steps (string array)
            Do not number the steps, and be descriptive while minimizing token usage.`;
            const completion = await openai.chat.completions.create({
                response_format: { "type": "json_object" },
                messages: [{ role: "user", content: prompt }],
                model: "gpt-3.5-turbo-1106",
            });
            console.log('Server response:', completion); // Add this line to log the response
            console.log(completion.choices[0]);
            res.status(200).json(completion.choices[0]);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            res.status(500).json({ error: 'Error fetching recipes' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}