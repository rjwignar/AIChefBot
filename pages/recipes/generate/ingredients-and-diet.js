import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import RecipeCardList from "@/components/RecipeCardList";
import Select from "react-dropdown-select";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/components/LoadingScreen";
import { setCache, getCache } from "@/pages/api/sessionStorage";
import { requestImageGeneration } from "@/pages/api/generateImageUtils";

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
  // Holds how much ingredients is in the list
  const [ingredientsList, setIngredientsList] = useState([]);
  // Check if the user wants to only use the ingredients list
  const [limitIngredients, setLimitIngredients] = useState(false);
  // Sets image awaiting state
  const [awaitingImages, setAwaitingImages] = useState(false); 
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

    if (session) {
      /*
      Check cache
        - Destructure relevant JSON data
        - Set application state
      */
      let { 
        recipes, 
        messageHistory,
        selectedDiet,
        selectedIngredients
      } = getCache();
      
      if (recipes && messageHistory && selectedIngredients == true && selectedDiet == true) {
        setRecipes(recipes);
        setSelectedDiet(selectedDiet);
        setIngredients(selectedIngredients);
        setMessageHistory(messageHistory);
        setGeneratePressed(true);
      }
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
    const ingredients = selectedIngredients
      .map((ingredients) => ingredients.value)
      .join(", ");
    setIngredientsList(selectedIngredients);
    setIngredients(ingredients);
  };

  const handleStopGenerating = () => {
    console.log("Stopped generating from previous diet list and ingredients");
    console.log("Resetting all values");
    setGeneratePressed(false);
    setRecipes(null);
    setMessageHistory([]);
    setSelectedDiet("");
    setUseSavedDiets(false);
    setSelectList([]);
    setIngredients("");
    setLimitIngredients(false);
    setIngredientsList([]);
    sessionStorage.clear();
  };

  const handleGenerateClick = async () => {
    setGeneratePressed(true);
    if (messageHistory.length > 0) {
      setRecipes(null);
    }
    try {
      console.log("Fetching recipes from API by ingredient and diet...");
      setAwaitingImages(false);
      /* --- Fetch API to get recipes ---  */
      const res = await fetch("/api/generateRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedDiet, selectedIngredients, limitIngredients, messageHistory }),
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

      // If image generation turned on, set awaitingImages to True
      setAwaitingImages(true);

      // Generate Recipe Images and update data.recipes with images for caching purposes
      data.recipes = await requestImageGeneration(data.recipes);
      console.log("recipes with images in UI", data.recipes);

      // Set recipes to updated recipes with images
      setRecipes(data.recipes);
      setMessageHistory(data.messageHistory);

      // Clear old, set new cached data
      sessionStorage.clear();
      data.selectedDiet = selectedDiet;
      data.selectedIngredients = selectedIngredients;
      setCache(data);
      /* ------------------------------ */
      /* Updating database stuff: */
      if (session) {
        updateDatabase(data.recipes.length);
      }
      /* ---------------------------- */
    } catch (error) {
      console.error(error);
    }
  };

  // Simple toggle switch to use saved diets
  const toggleUseSavedDiets = () => {
    setUseSavedDiets(!useSavedDiets);
  };

  // Simple toggle switch to include ingredients that aren't listed
  const toggleUseIngredientsList = () => {
    setLimitIngredients(!limitIngredients);
  };

  return (
    <>
      {/* Creates the Back Button */}
      {generatePressed && (
        <Button
          onClick={handleStopGenerating}
          className="generate-recipe-btn"
          variant="secondary"
          size="md"
          disabled={!recipes ? true : false}
        >
          &laquo; Select Diet and Ingredients
        </Button>
      )}
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md={12} className="text-center">
            <h1 className="hero-title">
              Discover Ingredient And Diet Based Recipes
            </h1>
            <p className="text-muted">
              Generate recipes based on a particular diet and ingredients you
              have available. Select a diet or dietary restriction, then type
              ingredients you have and we'll do the rest.
            </p>
          </Col>
        </Row>
        {generatePressed ? (
          <Container className="mb-4">
            <Row>
              <Button
                onClick={handleGenerateClick}
                className="generate-recipe-btn"
                variant="success"
                size="lg"
                disabled={!recipes ? true : false}
              >
                Generate New Recipes
              </Button>
            </Row>
            {!recipes && <LoadingScreen awaitingImages={awaitingImages}/>}
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
                  //closeOnSelect
                  closeOnClickInput
                  placeholder="Type any ingredient"
                  onChange={(ingredients) =>
                    handleEnteredIngredients(ingredients)
                  }
                  className="p-2"
                />
                <div className="d-flex justify-content-center w-100 mt-2">
                  <Form>
                    <Form.Check
                        type="switch"
                        id="ingredients-switch"
                        label="Limit unlisted ingredients (Need +5 Ingredients)"
                        checked={limitIngredients}
                        disabled={ingredientsList.length < 5}
                        onChange={toggleUseIngredientsList}
                        className="saved-diet-switch text-muted"
                    />
                  </Form>
                </div>
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
                {status !== "unauthenticated" && (
                  <div className="d-flex justify-content-center w-100 mt-2">
                    <Form>
                      <Form.Check
                        type="switch"
                        id="diets-switch"
                        label="Use Saved Diets"
                        checked={useSavedDiets}
                        onChange={toggleUseSavedDiets}
                        className="saved-diet-switch text-muted"
                      />
                    </Form>
                  </div>
                )}
              </Col>
            </Row>
            <Row className="justify-content-center mb-5">
              <Col className="d-flex flex-column align-items-center">
                <Button
                  className="generate-recipe-btn"
                  variant="success"
                  size="lg"
                  onClick={handleGenerateClick}
                  disabled={
                    (selectedIngredients && selectedDiet) == "" ? true : false
                  }
                >
                  Generate Recipes
                </Button>
              </Col>
            </Row>
          </Container>
        )}
        {/* Render recipes if available */}
        {recipes && <RecipeCardList recipes={recipes} />}
      </Container>
    </>
  );
};

export default IngredientsAndDietPage;
