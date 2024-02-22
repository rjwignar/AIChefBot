// account/recipes/recipes.js
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCard from '@/components/RecipeCard'; // assuming RecipeCard is in the same directory
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import RecipeCardList from '@/components/RecipeCardList';

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

    const getRecipes = async () => {
      try {
        const res = await fetch(`/api/recipes/request?id=${session.user.id}`, {
          method: "GET",
        });
        const recipes = await res.json();
        setRecipes(recipes);
      } catch (err) {
        console.error(err);
      }
    };
    getRecipes();
  }, []);

  return (
    <>
      <Container>
        <h1 className="hero-title">Saved Recipes</h1>
        <hr />
        <br />
        <Container>
          {/* Render recipes if available*/}
          {/* Needs to hide the save recipes button */}
          {recipes ? (
            recipes.length ? (
              <RecipeCardList recipes={recipes}/>
            ) : (
              <p className="text-muted">No recipes saved...</p>
            )
          ) : (
            <></>
          )}
        </Container>
      </Container>
    </>
  );
}
