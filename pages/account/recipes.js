// account/recipes/recipes.js
import RecipeList from "@/components/RecipeList";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSession, signIn } from 'next-auth/react';

// Simulate 6 recipes saved by user
const temp = [
   {
      name: 'Vegan Lentil Stew',
      description: 'A hearty and nutritious stew made with lentils, veggies, and flavorful herbs.',
      ingredients: [
         '1 cup of dried green lentils, rinsed',
         '1 onion, diced',
         '2 carrots, chopped',
         '3 garlic cloves, minced',
         '4 cups vegetable broth',
         '1 teaspoon dried thyme',
         '1 teaspoon smoked paprika',
         'Salt and pepper to taste'
      ],
      steps: [
         'In a large pot, sauté the onion and garlic in a bit of vegetable broth until softened.',
         'Add the carrots, lentils, thyme, paprika, and vegetable broth to the pot.',
         'Bring to a boil, then reduce heat and simmer for 30 minutes, or until the lentils are tender.',
         'Season with salt and pepper, and serve hot.'
      ]
   },
   {
      name: 'Vegan Roasted Veggie Quinoa Bowl',
      description: 'A colorful and satisfying bowl filled with roasted vegetables and protein-packed quinoa.',
      ingredients: [
         '1 cup quinoa, rinsed',
         '1 red bell pepper, sliced',
         '1 zucchini, sliced',
         '1 yellow squash, sliced',
         '1 small eggplant, diced',
         '3 tablespoons olive oil',
         '1 teaspoon dried oregano',
         '1 teaspoon garlic powder',
         'Salt and pepper to taste'
      ],
      steps: [
         'Preheat the oven to 400°F (200°C).',
         'Toss the sliced vegetables with olive oil, oregano, garlic powder, salt, and pepper.',
         'Spread the vegetables in a single layer on a baking sheet and roast for 25-30 minutes, or until tender and slightly caramelized.',
         'While the vegetables are roasting, cook the quinoa according to package instructions.',
         'Divide the cooked quinoa and roasted vegetables into bowls, and serve hot.'
      ]
   },
   {
      name: 'Vegan Chickpea Salad Sandwich',
      description: 'A satisfying and flavorful sandwich filling made with mashed chickpeas and fresh herbs.',
      ingredients: [
         '1 can chickpeas, drained and rinsed',
         '2 stalks celery, finely diced',
         '1/4 cup red onion, finely chopped',
         '1/4 cup vegan mayonnaise',
         '1 tablespoon Dijon mustard',
         '1 tablespoon fresh dill, chopped',
         'Salt and pepper to taste',
         'Bread or rolls for serving'
      ],
      steps: [
         'In a large bowl, mash the chickpeas with a fork or potato masher.',
         'Add the celery, red onion, vegan mayonnaise, mustard, and dill to the bowl, and mix until well combined.',
         'Season with salt and pepper to taste.',
         'Spread the chickpea salad onto bread or rolls to make sandwiches, and enjoy.'
      ]
   },
   {
      name: 'Vegan Lentil Stew',
      description: 'A hearty and nutritious stew made with lentils, veggies, and flavorful herbs.',
      ingredients: [
         '1 cup of dried green lentils, rinsed',
         '1 onion, diced',
         '2 carrots, chopped',
         '3 garlic cloves, minced',
         '4 cups vegetable broth',
         '1 teaspoon dried thyme',
         '1 teaspoon smoked paprika',
         'Salt and pepper to taste'
      ],
      steps: [
         'In a large pot, sauté the onion and garlic in a bit of vegetable broth until softened.',
         'Add the carrots, lentils, thyme, paprika, and vegetable broth to the pot.',
         'Bring to a boil, then reduce heat and simmer for 30 minutes, or until the lentils are tender.',
         'Season with salt and pepper, and serve hot.'
      ]
   },
   {
      name: 'Vegan Roasted Veggie Quinoa Bowl',
      description: 'A colorful and satisfying bowl filled with roasted vegetables and protein-packed quinoa.',
      ingredients: [
         '1 cup quinoa, rinsed',
         '1 red bell pepper, sliced',
         '1 zucchini, sliced',
         '1 yellow squash, sliced',
         '1 small eggplant, diced',
         '3 tablespoons olive oil',
         '1 teaspoon dried oregano',
         '1 teaspoon garlic powder',
         'Salt and pepper to taste'
      ],
      steps: [
         'Preheat the oven to 400°F (200°C).',
         'Toss the sliced vegetables with olive oil, oregano, garlic powder, salt, and pepper.',
         'Spread the vegetables in a single layer on a baking sheet and roast for 25-30 minutes, or until tender and slightly caramelized.',
         'While the vegetables are roasting, cook the quinoa according to package instructions.',
         'Divide the cooked quinoa and roasted vegetables into bowls, and serve hot.'
      ]
   },
   {
      name: 'Vegan Chickpea Salad Sandwich',
      description: 'A satisfying and flavorful sandwich filling made with mashed chickpeas and fresh herbs.',
      ingredients: [
         '1 can chickpeas, drained and rinsed',
         '2 stalks celery, finely diced',
         '1/4 cup red onion, finely chopped',
         '1/4 cup vegan mayonnaise',
         '1 tablespoon Dijon mustard',
         '1 tablespoon fresh dill, chopped',
         'Salt and pepper to taste',
         'Bread or rolls for serving'
      ],
      steps: [
         'In a large bowl, mash the chickpeas with a fork or potato masher.',
         'Add the celery, red onion, vegan mayonnaise, mustard, and dill to the bowl, and mix until well combined.',
         'Season with salt and pepper to taste.',
         'Spread the chickpea salad onto bread or rolls to make sandwiches, and enjoy.'
      ]
   }
]

// Page of manage recipes:
export default function recipes() {
   const { data: session, status } = useSession();
   const [recipes, setRecipes] = useState(null);

   useEffect(() => {
      const authenticate = async () => {
         // Putting it in a try catch to handle errors gracefully.
         try {
            if (status === "unauthenticated") {
            await signIn("cognito");
            }
         } catch (error) {
            console.error(error);
         }
      };
      
      authenticate();

      // Setting recipes
      setRecipes(temp);
   }, []);

   return (
      <>
         <Container>
            <h1 className="hero-title">Saved Recipes</h1>
            <Container>
               {/* Render recipes if available*/}
               {recipes ? (
                  <RecipeList recipes={recipes} isSavedRecipe={true}/>
               ) : (
                  <p className="text-muted">No recipes saved...</p>
               )}
            </Container>
         </Container>
      </>
   )
}