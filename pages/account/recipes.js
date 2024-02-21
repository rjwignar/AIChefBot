// account/recipes/recipes.js
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCard from '@/components/RecipeCard'; // assuming RecipeCard is in the same directory
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

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

  // callback from RecipeCard, recipe is deleted from database, then:
  // filter out the deleted recipe, rerender the recipes array
  const handleOnDelete = (recipe) => {
      setRecipes(recipes.filter((e) => e._id != recipe._id));
  }

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
              <Container className="animate__animated animate__fadeInUp">
                <Row>
                  {recipes &&
                    recipes.map((recipe, index) => (
                      <Col key={index} sm={12} md={6} lg={4} className="mb-4">
                        <RecipeCard recipe={recipe} onDelete={handleOnDelete}/>
                      </Col>
                    ))}
                </Row>
              </Container>
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
