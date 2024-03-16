import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import RecipeCardList from "@/components/RecipeCardList";
import Select from "react-dropdown-select";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/components/LoadingScreen";

// List of all diets
const diets = [
   { value: 1, name: "Vegetarian", displayName: "🌿 Vegetarian" },
   { value: 2, name: "Vegan", displayName: "🌱 Vegan" },
   { value: 3, name: "Pescatarian", displayName: "🐟 Pescatarian" },
   { value: 4, name: "GlutenFree", displayName: "🚫🌾 Gluten Free" },
   { value: 5, name: "Ketogenic", displayName: "🥩 Ketogenic" },
   { value: 6, name: "Paleo", displayName: "🍖 Paleo" },
   { value: 7, name: "LowFODMAP", displayName: "🔍 Low FODMAP" },
   { value: 8, name: "DairyFree", displayName: "🚫🥛 Dairy Free" },
   { value: 9, name: "Halal", displayName: "☪️ Halal" },
   { value: 10, name: "Kosher", displayName: "✡️ Kosher" },
   { value: 11, name: "Whole30", displayName: "📆 Whole30" },
];

const IngredientsAndDietPage = () => {
   const { data: session, status } = useSession();
   // Check if the generate button is pressed
   const [generatePressed, setGeneratePressed] = useState(false);
   // The recipes that are shown on screen. Get's reset on refresh, user stops generating etc...
   const [recipes, setRecipes] = useState(null);
   // The message history
   const [messageHistory, setMessageHistory] = useState([]);

   // For Diets
   // The string format of the selected diet
   const [selectedDiet, setSelectedDiet] = useState("");
   // The diets that the user has saved
   const [savedDiets, setSavedDiets] = useState([]);
   // State to check if user wants to use saved diets from database
   const [useSavedDiets, setUseSavedDiets] = useState(false);
   // Sets the multi-select list
   const [selectList, setSelectList] = useState([]);

   // For Ingredients
   // The string format of the ingredients
   const [selectedIngredients, setIngredients] = useState("");

   // Use effects:
   // Get user on page mount, store dietary restrictions into
   // 'savedDiets' array
   useEffect(() => {
   if (session) {
      // Get the user from database
      const getUser = async () => {
         try {
         const res = await fetch(`/api/user/request?id=${session.user.id}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
            },
         });
         // Get user object from response
         const user = await res.json();
         // Set 'savedDiets' array as user's dietary restrictions array
         setSavedDiets(user.dietaryRestrictions);
         } catch (err) {
         // Set saved diets as empty array if something goes wrong
         console.error(err);
         setSavedDiets([]);
         }
      };
      getUser();
   }
   }, []);

   // Watch the useSaveDiets toggle switch
   useEffect(() => {
   // Check if the user wants to add their saved diets to select list:
   if (useSavedDiets) {
      // Find the diet objects that match the names in userSavedDiets
      const savedDietObjects = diets.filter((diet) =>
         savedDiets.includes(diet.name)
      );
      // Fill the select list with saved diets
      setSelectList(savedDietObjects);
   }
   }, [useSavedDiets]);

   // Functions:
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

   const handleSelectDiet = (selectedDiets) => {
      // Map over the selected diet objects to get their names and join them into a string
      const dietNames = selectedDiets.map((diet) => diet.name).join(", ");
      setSelectedDiet(dietNames);
      // --------------------------------
      // Update the select list
      setSelectList(selectedDiets);
      // ----------------------
      // Check if the names of the selected diets match the userSavedDiets
      const isSelectedDietsMatchSaved =
         selectedDiets.every((selectedDiet) =>
            savedDiets.includes(selectedDiet.name)
         ) && selectedDiets.length === savedDiets.length;

      // If not, turn off the useSavedDiets switch
      if (!isSelectedDietsMatchSaved) {
         setUseSavedDiets(false);
      }
   };

   // Handle whenever an ingredient is entered
   const handleEnteredIngredients = (selectedIngredients) => {
      const ingredients = selectedIngredients.map((ingredients) => ingredients.value).join(", ");
      setIngredients(ingredients);
   }

   const handleStopGenerating = () => {
      console.log("Stopped generating from previous diet list");
      console.log("Resetting all values");
      setGeneratePressed(false);
      setRecipes(null);
      setMessageHistory([]);
      setSelectedDiet("");
      setUseSavedDiets(false);
      setSelectList([]);
      setIngredients("");
   }

   const handleGenerateClick = async () => {
      setGeneratePressed(true);
      console.log("Selected Diet: " + selectedDiet)
      console.log("Selected Ingredients: " + selectedIngredients);
   }

   const handleGenerateMoreClick = async () => {
      setRecipes(null);
   }

   // Simple toggle switch to use saved diets
   const toggleUseSavedDiets = () => {
      setUseSavedDiets(!useSavedDiets);
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
               &laquo; Select Diet and Ingredients
            </Button>
         }
         <Container className="mt-5">
            <Row className="justify-content-md-center">
               <Col md={12} className="text-center">
                  <h1 className="hero-title">Discover Ingredient And Diet Based Recipes</h1>
                  <p className="text-muted">
                     Generate recipes based on a particular diet and ingredients you have available. 
                     Select a diet or dietary restriction, then type ingredients you have and we'll do the rest.
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
                  {!recipes && <LoadingScreen />}
               </Container>
            ) : (
               <Container>
                  <Row className="justify-content-center mb-4">
                     <Col className="flex-column align-items-center" md={6}>
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
                           closeOnSelect
                           closeOnClickInput
                           placeholder="Type any ingredient"
                           onChange={(ingredients) => handleEnteredIngredients(ingredients)}
                           className="p-2"
                        />
                     </Col>
                     <Col className="flex-column align-items-center" md={6}>
                        <h5 className="diet-select-label">
                           Select a diet or dietary restriction.
                        </h5>
                        <Select
                           multi
                           options={diets}
                           labelField="displayName"
                           valueField="value"
                           values={useSavedDiets ? selectList : []}
                           clearable={selectedDiet.length > 0}
                           searchable
                           searchBy="name"
                           dropdownHandle
                           separator
                           closeOnSelect
                           closeOnClickInput
                           placeholder="Search"
                           onChange={(diets) => handleSelectDiet(diets)}
                           className="p-2"
                        />
                     </Col>
                     {status !== "unauthenticated" && (
                           <div className="d-flex justify-content-center w-100 mt-2">
                              <Form>
                                 <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Use Saved Diets"
                                    checked={useSavedDiets}
                                    onChange={toggleUseSavedDiets}
                                    className="saved-diet-switch text-muted"
                                 />
                              </Form>
                           </div>
                        )}
                  </Row>
                  <Row className="justify-content-center mb-5">
                     <Col className="d-flex flex-column align-items-center">
                        <Button
                           className="generate-recipe-btn"
                           variant="success"
                           size="lg"
                           onClick={handleGenerateClick}
                           disabled={(selectedIngredients && selectedDiet) == "" ? true : false}
                        >
                           Generate Recipes
                        </Button>
                     </Col>
                  </Row>
                  {/* Render recipes if available */}
                  {recipes && (
                     <RecipeCardList recipes={recipes}/>
                  )}
               </Container>
            )}
         </Container>
      </>
   )
}

export default IngredientsAndDietPage;