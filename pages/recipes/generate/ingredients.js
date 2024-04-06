import { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Select from "react-dropdown-select";
import { useSession } from "next-auth/react";
import RecipeCardList from "@/components/RecipeCardList";
import LoadingScreen from "@/components/LoadingScreen";

const IngredientsPage = () => {
   const { data: session } = useSession();
   // Check if the generate button is pressed
   const [generatePressed, setGeneratePressed] = useState(false);
   // The recipes that are shown on screen. Get's reset on refresh, user stops generating etc...
   const [recipes, setRecipes] = useState(null);
   // The message history
   const [messageHistory, setMessageHistory] = useState([]);
   // The string format of the ingredients
   const [selectedIngredients, setIngredients] = useState("");
   // Check if the user wants to only use the ingredients list
   const [useIngredientsList, setUseIngredientsList] = useState(false);
   // Use state to hold the prompt
   const [promptIngredientsList, setPromptIngredientsList] = useState(".\nONLY use the ingredients that I listed to generate the recipes. Don't use or add any other ingredients other than the list I mentioned. Recipes should only be created using the listed ingredients.\n");
   
   // Handle whenever an ingredient is entered
   const handleEnteredIngredients = (selectedIngredients) => {
      const ingredients = selectedIngredients.map((ingredients) => ingredients.value).join(", ");
      let prompt = ingredients + promptIngredientsList;
      setIngredients(prompt)
      console.log('Current Selection: ' + prompt);
   }

   const handleStopGenerating = () => {
      console.log("Stopped generating from previous ingredients list");
      console.log("Resetting all values");
      setGeneratePressed(false);
      setRecipes(null);
      setMessageHistory([]);
      setIngredients("");
      setUseIngredientsList(false);
   }

   // Generates the recipes:
   const handleGenerateClick = async () => {
      console.log("Generating Recipes");
      setGeneratePressed(true);
      try {
         // Get selected ingredients in string format
         console.log("Selected Ingredients: ", selectedIngredients);
         console.log("Message History: ", messageHistory);
         /* --- Fetch API to get recipes --- */
         const res = await fetch("/api/generateRecipe", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedIngredients, messageHistory }),
         });
          /* ------------------------------------------------------ */
         /* --- Check if "res" is ok and content type is valid --- */
         if (!res.ok) {
            throw new Error(`Network response was not ok: ${res.statusText}`);
         }
         const contentType = res.headers.get("content-type");
         if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
         }
         /* ------------------------------------------------------ */
         /* --- Get Data From Response --- */
         const data = await res.json();
         console.log("Data was returned: ", data);
         setRecipes(data.recipes);
         setMessageHistory(data.messageHistory);
         /* ------------------------------ */
         /* Updating database stuff: */
         if (session) {
            updateDatabase(data.recipes.length);
         }
         /* ---------------------------- */
      } catch (err) {
         console.log(err);
      }
   }

   const handleGenerateMoreClick = async () => {
      console.log("Generating More Recipes");
      // For display purpose only:
      setRecipes(null);
      // Generating More Logic:
      try {
         console.log(messageHistory);
         const response = await fetch("/api/generateRecipe", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ messageHistory }),
         });
         /* --- Check if "res" is ok and content type is valid --- */
         if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
         }

         const contentType = response.headers.get("content-type");
         if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
         }
         /* ------------------------------------------------------ */
         /* --- Get Data From Response --- */
         const data = await response.json();
         console.log(data);
         console.log("message history", data.messageHistory);
         setRecipes(data.recipes);
         setMessageHistory(data.messageHistory);
         console.log("new message history", messageHistory);
         console.log("recipes below in UI", recipes);
         /* ------------------------------- */
         /* Updating database */
         if (session) {
            updateDatabase(data.recipes.length);
         }
         /* ----------------- */
      } catch (err) {
         console.error(err);
      }
   }

   const updateDatabase = async (recipeCount) => {
      console.log(`Adding ${recipeCount} to recipe count in database...`);
      try {
         // Add number of generated recipes to user's recipeCount
         await fetch("/api/recipes/request", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            userId: session.user.id,
            recipeCount: recipeCount,
            }),
         });
         console.log("Successfully updated recipe count.");
      } catch (err) {
         console.error("Unsuccessful update to database: ", err);
      }
   };

   // Simple toggle switch to include ingredients that aren't listed
   const toggleUseIngredientsList = () => {
      setUseIngredientsList(!useIngredientsList);
      // Add a prompt in the end of selected ingredients depending on the toggle switch
      if (!useIngredientsList) {
         // Generate recipes with ingredients from the list + any ingredients that aren't listed.
         setPromptIngredientsList(".\nUse the ingredients I listed and Add other ingredients that I haven't listed.\n");
      } else {
         // Generate recipes with only the ingredients from the list
         setPromptIngredientsList(".\nONLY use the ingredients that I listed to generate the recipes. Don't use or add any other ingredients other than the list I mentioned. Recipes should only be created using the listed ingredients.\n");
      }
   };

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
               &laquo; Select Ingredients
            </Button>
         }
         <Container className="mt-5">
            <Row className="justify-content-md-center">
               <Col md={12} className="text-center">
                  <h1 className="hero-title">Discover Ingredient-Based Recipes</h1>
                  <p className="text-muted">
                     Generate recipes based on ingredients you have available. 
                     Type any ingredients you have in the box below and we'll 
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
                           Type an ingredient, then press enter.
                        </h5>
                        <Select
                           multi
                           clearable={selectedIngredients.length > 0}
                           create
                           onCreateNew={(item) => console.log(item)}
                           values={[]}
                           separator
                           noDataLabel="Hit 'Enter' to add."
                           dropdownHandle
                           //closeOnSelect
                           closeOnClickInput
                           placeholder="Type any ingredient"
                           onChange={(ingredients) => handleEnteredIngredients(ingredients)}
                           className="p-2"
                        />
                        <div className="d-flex justify-content-center w-100 mt-2">
                           <Form>
                              <Form.Check
                                 type="switch"
                                 id="custom-switch"
                                 label="Include ingredients that aren't listed"
                                 checked={useIngredientsList}
                                 onChange={toggleUseIngredientsList}
                                 className="saved-diet-switch text-muted"
                              />
                           </Form>
                        </div>
                     </Col>
                  </Row>
                  <Row className="justify-content-center mb-5">
                     <Col className="d-flex flex-column align-items-center">
                        <Button
                           className="generate-recipe-btn"
                           variant="success"
                           size="lg"
                           onClick={handleGenerateClick}
                           disabled={selectedIngredients == "" ? true : false}
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