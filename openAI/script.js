const OpenAI = require("openai");
const fs = require("fs");
// const fs = require('fs');

const openai = new OpenAI();

async function main() {
  const ingredients = ['flour', 'sugar', 'butter', 'chocolate chips'];
  const prompt = `Generate three recipes using the following ingredients:\n- ${ingredients.join('\n- ')}.
In the JSON object, each recipe must contain the following properties:
name (string), ingredients (string array), ingredientQuantity (string array), steps (string array)
Use as few words as possible in each step, and do not number them.}`;

const completion = await openai.chat.completions.create({
    response_format:{ "type": "json_object" },
    messages: [{ role: "user", content: prompt }],
    // model: "gpt-3.5-turbo", // only gpt-3.5-turbo-1106 and later support response_format property
    model: "gpt-3.5-turbo-1106",
});
// show prompt
console.log(prompt);
// show entire completion.choices
// console.log(completion.choices);

  let response = JSON.stringify(completion.choices[0]);
  fs.writeFileSync('output.json', response);

// Show raw response object
  console.log(response);
  
// Show recipes
  console.log("Here are the recipes");
  const recipes = JSON.parse(response).message.content;
  console.log(recipes);
}

main();

// // sample response object (completion.choices[0]))
  // const response = {
  //   index: 0,
  //   message: {
  //     role: 'assistant',
  //     content: '{\n' +
  //       '  "recipe1": {\n' +
  //       '    "name": "Chocolate Chip Cookies",\n' +
  //       '    "ingredients": ["flour", "sugar", "butter", "chocolate chips"],\n' +
  //       '    "ingredientQuantity": ["2 cups", "1 cup", "1 cup", "1 1/2 cups"],\n' +
  //       '    "steps": ["1. Preheat oven to 350°F.", "2. In a large bowl, cream together butter and sugar.", "3. Mix in flour and chocolate chips.", "4. Form dough into balls and place on baking sheet.", "5. Bake for 10-12 minutes, or until golden brown."]\n' +
  //       '  },\n' +
  //       '  "recipe2": {\n' +
  //       '    "name": "Chocolate Chip Brownies",\n' +
  //       '    "ingredients": ["flour", "sugar", "butter", "chocolate chips"],\n' +
  //       '    "ingredientQuantity": ["1 cup", "2 cups", "1 cup", "1 1/2 cups"],\n' +
  //       '    "steps": ["1. Preheat oven to 350°F.", "2. Melt butter and mix with sugar.", "3. Stir in flour and chocolate chips.", "4. Spread batter in a greased baking dish.", "5. Bake for 25-30 minutes, or until a toothpick comes out clean."]\n' +
  //       '  },\n' +
  //       '  "recipe3": {\n' +
  //       '    "name": "Chocolate Chip Pancakes",\n' +
  //       '    "ingredients": ["flour", "sugar", "butter", "chocolate chips"],\n' +
  //       '    "ingredientQuantity": ["1 1/2 cups", "2 tbsp", "2 tbsp", "1/2 cup"],\n' +
  //       '    "steps": ["1. In a bowl, mix together flour, sugar, and butter.", "2. Stir in chocolate chips.", "3. Pour batter onto a hot griddle.", "4. Cook until bubbles form, then flip and cook until golden brown.", "5. Serve with maple syrup."]\n' +
  //       '\n' +
  //       '  }\n' +
  //       '}'
  //   },
  //   logprobs: null,
  //   finish_reason: 'stop'
  // };