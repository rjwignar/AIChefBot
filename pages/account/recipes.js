// account/recipes/recipes.js
import RecipeList from "@/components/RecipeList";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSession, signIn } from 'next-auth/react';


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
            const res = await fetch(`/api/recipes/request?id=${session.user.id}`, {method: "GET"});
            const recipes = await res.json();
            setRecipes(recipes);
         }
         catch(err) {
            console.error(err);
         }
      }
      getRecipes();
   }, []);

   return (
      <>
         <Container>
            <h1 className="hero-title">Saved Recipes</h1>
            <hr/><br/>
            <Container>
               {/* Render recipes if available*/}
               {/* Needs to hide the save recipes button */}
               {recipes ? ( 
                  recipes.length ? (
                     <RecipeList recipes={recipes}/>
                     ) : (
                     <p className="text-muted">No recipes saved...</p>
                  )
               ) : (
                  <></>
               )}
            </Container>
         </Container>
      </>
   )
}