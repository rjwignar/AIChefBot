import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Select from "react-dropdown-select";
import { useSession } from "next-auth/react";
import RecipeCardList from "@/components/RecipeCardList";
import LoadingScreen from "@/components/LoadingScreen";

const IngredientsPage = () => {
   // Check if the generate button is pressed
   const [generatePressed, setGeneratePressed] = useState(false);
   // The recipes that are shown on screen. Get's reset on refresh, user stops generating etc...
   const [recipes, setRecipes] = useState(null);
   // The message history
   const [messageHistory, setMessageHistory] = useState([]);
   // The string format of the ingredients
   const [ingredients, setIngredients] = useState("");
   
   // Handle whenever an ingredient is entered
   const handleEnteredIngredients = (selectedIngredients) => {
      const ingredients = selectedIngredients.map((ingredients) => ingredients.value).join(", ");
      setIngredients(ingredients);
      console.log(ingredients);
   }

   const handleStopGenerating = () => {
      console.log("Stopped generating from previous ingredients list");
      console.log("Resetting all values");
      setGeneratePressed(false);
      setRecipes(null);
      setMessageHistory([]);
      setIngredients("");
   }

   // Generates the recipes:
   const handleGenerateClick = async () => {
      console.log("Generating Recipes");
      setGeneratePressed(true);
   }

   const handleGenerateMoreClick = async () => {
      console.log("Generating More Recipes");
      setRecipes(null);
   }

   return (
      <>
         {/* Creates the Back Button */}
         {generatePressed &&
            <Button
            onClick={handleStopGenerating}
            className="generate-recipe-btn"
            variant="secondary"
            size="md"
            disabled={!recipes ? true : false}>  
               &laquo; Select Diet
            </Button>
         }
         <Container className="mt-5">
            <Row className="justify-content-md-center">
               <Col md={12} className="text-center">
                  <h1 className="hero-title">Discover Ingredient-Based Recipes</h1>
                  <p className="text-muted">
                     Generate recipes based on ingredients you have available. 
                     Type an ingredient in the box below and we'll 
                     do the rest.
                  </p>
               </Col>
            </Row>
            {generatePressed ? (
               <Container className="mb-4">
                  <Row>
                     <Button
                        onClick={handleGenerateMoreClick}
                        className="generate-recipe-btn"
                        variant="success"
                        size="lg"
                        disabled={!recipes ? true : false}
                     >
                        Generate New Recipes
                     </Button>
                  </Row>
                  {!recipes && <LoadingScreen/>}
               </Container>
            ) : (
               <Container>
                  <Row className="justify-content-center mb-4">
                     <Col className="flex-column align-items-center" md={9}>
                        <h5 className="diet-select-label">
                           Type a ingredient then press enter to add it to the list.
                        </h5>
                        <Select
                           multi
                           clearable={ingredients.length > 0}
                           create
                           onCreateNew={(item) => console.log(item)}
                           values={[]}
                           separator
                           noDataLabel="Add an ingredient"
                           dropdownHandle
                           closeOnSelect
                           closeOnClickInput
                           placeholder="Enter an ingredient"
                           onChange={(ingredients) => handleEnteredIngredients(ingredients)}
                           className="p-2"
                        />
                     </Col>
                  </Row>
                  <Row className="justify-content-center mb-5">
                     <Col className="d-flex flex-column align-items-center">
                        <Button
                           className="generate-recipe-btn"
                           variant="success"
                           size="lg"
                           onClick={handleGenerateClick}
                           disabled={ingredients == "" ? true : false}
                        >
                           Generate Recipes
                        </Button>
                     </Col>
                  </Row>
               </Container>
            )}
            {/* Render recipes if available */}
            {recipes && (
               <RecipeCardList recipes={recipes}/>
            )}
         </Container>
      </>
   )
}

export default IngredientsPage;