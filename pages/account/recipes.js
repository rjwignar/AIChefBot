// account/recipes/recipes.js
import { Container, Col, Row, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import RecipeCardList from "@/components/RecipeCardList";

// Page of manage recipes:
export default function recipes() {
  const { data: session, status } = useSession();
  const [recipes, setRecipes] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState(null);

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
    if (!recipes) getRecipes();
  }, []);

  const getRecipes = async () => {
    try {
      const res = await fetch(`/api/recipes/request?id=${session.user.id}`, {
        method: "GET",
      });
      const recipes = await res.json();
      setRecipes(recipes);
      setFilteredRecipes(recipes);
    } catch (err) {
      console.error(err);
    }
  };

  const filterRecipes = (text) => {
    // Replace dashes with spaces, and split search text into array of words
    let searchWords = text.replace(/-/g, " ").toLowerCase().split(" ");
    // If search text exists:
    if (text.length > 0) {
      // Filter the recipes to include those which contain the search text
      // in their name, description or ingredients
      let filtered = recipes.filter((recipe) => {
        // Make a long string out of the recipe's members
        let searchText = [
          recipe.name,
          recipe.description,
          ...recipe.ingredients,
        ].join(" ").toLowerCase();

        // For every word in the search field
        return searchWords.every((word) => {
          // Ensure that the search text includes the word
          return searchText.includes(word);
        });
      });
      setFilteredRecipes(filtered);
    }
    // If search text does not exist, reset rendered recipes to display all.
    else setFilteredRecipes(recipes);
  };

  return (
    <>
      <h1 className="hero-title">Saved Recipes</h1>
      <hr />

      <Container>
        {/* 
          Filter through recipes with text
          Display filter search bar only if user has saved recipes
        */}
        {recipes && (
          <Row className="align-items-center">
            <Form.Control
              id="filter-recipes"
              className="mt-2"
              type="text"
              placeholder="Filter recipes"
              onChange={(e) => filterRecipes(e.target.value)}
            />
          </Row>
        )}
        <br />
        <br />
        {/* Render recipes if available */}
        {/* Needs to hide the save recipes button */}
        {filteredRecipes &&
          (filteredRecipes.length ? (
            <RecipeCardList recipes={filteredRecipes} />
          ) : (
            <p className="text-muted">No recipes saved...</p>
          ))}
      </Container>
    </>
  );
}
