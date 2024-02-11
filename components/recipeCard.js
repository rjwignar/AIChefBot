import React from 'react';
import { Card } from 'react-bootstrap';

const RecipeCards = ({ recipes }) => {
    console.log(recipes);
    console.log(recipes.recipes);
    console.log(recipes.recipes);
    const parsedRecipes = JSON.parse(recipes);
    const recipeList = parsedRecipes && parsedRecipes.recipes; // Access the recipes array
    console.log(typeof recipeList);
    console.log("RecipeList in UI", recipeList);
  return (
    <div>
      {recipeList && recipeList.map(recipe => (
        <Card key={recipe.id} className="mb-4">
          <Card.Body>
            <Card.Title>{recipe.name}</Card.Title>
            <Card.Text>
              <h5>Ingredients:</h5>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h5>Steps:</h5>
              <ol>
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default RecipeCards;