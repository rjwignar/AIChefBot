import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import RecipeList from "@/components/RecipeList";
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

const DietPage = () => {
  const { data: session, status } = useSession();

  const [generatePressed, setGeneratePressed] = useState(false);

  // The diets that the user has saved
  const [savedDiets, setSavedDiets] = useState([]);
  // The recipes that are show on screen. Get's reset on refresh, user stops generating, etc...
  const [recipes, setRecipes] = useState(null);
  // The message history
  const [messageHistory, setMessageHistory] = useState([]);
  // The string format of the selected diet
  const [selectedDiet, setSelectedDiet] = useState("");
  // State to check if user wants to use saved diets from database
  const [useSavedDiets, setUseSavedDiets] = useState(false);
  // Sets the multi-select list
  const [selectList, setSelectList] = useState([]);

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

  //
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

  // When the user presses the stop generating button reset everything back to their initial state
  const handleStopGenerating = () => {
    console.log("Stopped generating from previous diet list");
    console.log("Resetting all values");
    setGeneratePressed(false);
    setRecipes(null);
    setSelectedDiet("");
    setUseSavedDiets(false);
    setSelectList([]);
    setMessageHistory([]);
  };

  // Simple toggle switch to use saved diets
  const toggleUseSavedDiets = () => {
    setUseSavedDiets(!useSavedDiets);
  };

  // Update generated recipe count MongoDB
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

  // Generates the recipes:
  const handleGenerateClick = async () => {
    setGeneratePressed(true);
    try {
      // Get selected diet in string format (i.e. 'vegan, vegetarian')
      console.log("Selected diet:", selectedDiet);
      console.log("Message History: ", messageHistory);
      /* --- Fetch API to get recipes ---  */
      const res = await fetch("/api/generateRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedDiet, messageHistory }),
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
      console.error(err);
    }
  };

  const handleGenerateMoreClick = async () => {
    // Resetting recipes
    // This is for display purpose only
    setRecipes(null);
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
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  return (
    <>
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md={12} className="text-center">
            <h1 className="hero-title">Discover Diet-Based Recipes</h1>
            <p className="text-muted">
              Generate recipes based on a particular diet or dietary
              restriction. Select a diet or dietary restriction and we'll do the
              rest.
            </p>
          </Col>
        </Row>
        {generatePressed ? (
          <Container className="mb-4">
            <Row>
              <Col md={6} className="text-end">
                <Button
                  onClick={handleGenerateMoreClick}
                  className="generate-recipe-btn"
                  variant="success"
                  size="lg"
                  disabled={!recipes ? true : false}
                >
                  Generate New Recipes
                </Button>
              </Col>
              <Col md={6}>
                <Button
                  onClick={handleStopGenerating}
                  className="generate-recipe-btn"
                  variant="danger"
                  size="lg"
                  disabled={!recipes ? true : false}
                >
                  Stop Generating Recipes
                </Button>
              </Col>
            </Row>
            {!recipes && <LoadingScreen />}
          </Container>
        ) : (
          <Container>
            <Row className="justify-content-center mb-4">
              <Col className="flex-column align-items-center" md={9}>
                <h5 className="diet-select-label">
                  Select a diet or dietary restriction
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
                        id="custom-switch"
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
                  disabled={selectedDiet == "" ? true : false}
                >
                  Generate Recipes
                </Button>
              </Col>
            </Row>
          </Container>
        )}
        {/* Render recipes if available */}
        {recipes && <RecipeList recipes={recipes} />}
      </Container>
    </>
  );
};

export default DietPage;