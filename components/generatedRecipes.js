import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import RecipeCards from './recipeCard';
import OpenAI from 'openai';


const GeneratePageContent = ({ selectedDiet }) => {
  const [recipes, setRecipes] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const router = useRouter();

  const handleGenerateClick = async () => {
    try {
      console.log('diet below');
      console.log(selectedDiet);
      console.log(messageHistory);
      const response = await fetch('/api/generateRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedDiet, messageHistory }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Oops, we haven't got JSON!");
      }

      const data = await response.json();
      console.log(data);
      // const {receivedRecipes, updatedMessageHistory} = data;
      setRecipes(data.recipes);
      // setRecipes(receivedRecipes);
      console.log("message history", data.messageHistory);
      setMessageHistory(data.messageHistory);
      console.log("new message history", messageHistory);
      console.log("recipes below in UI", recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleGenerateMoreClick = async () => {
    try {
      // console.log('diet below');
      // console.log(selectedDiet);
      console.log(messageHistory);
      const response = await fetch('/api/generateRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageHistory }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Oops, we haven't got JSON!");
      }

      const data = await response.json();
      console.log(data);
      // const {receivedRecipes, updatedMessageHistory} = data;
      setRecipes(data.recipes);
      // setRecipes(receivedRecipes);
      console.log("message history", data.messageHistory);
      setMessageHistory(data.messageHistory);
      console.log("new message history", messageHistory);
      console.log("recipes below in UI", recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };
  return (
    <div>
      <h1>Generate recipes...</h1>
      <Button variant="success" size="lg" onClick={handleGenerateClick}>
        Generate
      </Button>
      {recipes && <pre>{JSON.stringify(recipes, null, 2)}</pre>}
      {recipes && <div>
        <h1>Recipe Cards</h1>
        <RecipeCards recipes={recipes} />
      </div>}
      {recipes &&
        <Button variant="success" size="lg" onClick={handleGenerateMoreClick}>
          Generate Similar Recipes
        </Button>
      }
    </div>
  );
};

export default GeneratePageContent;