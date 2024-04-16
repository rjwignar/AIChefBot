// account/recipes/recipes.js
import { Container, Col, Row, Form, Button, Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import RecipeCardList from "@/components/RecipeCardList";
import { Pagination } from 'react-bootstrap';
import DeleteRecipesModal from "@/components/DeleteRecipesModal";
import LoadingScreen from "@/components/LoadingScreen";
import { setCache, getCache } from "@/pages/api/sessionStorage";
import { requestImageGeneration } from "@/pages/api/generateImageUtils";

// Page of manage recipes:
export default function recipes() {
  const { data: session, status } = useSession();
  const [recipes, setRecipes] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  // Variable to hold what page the user is in.
  const [currentPage, setCurrentPage] = useState(1);
  // Change value if you think it should be changed:
  const [recipesPerPage] = useState(9);
  const [isSortedMostRecent, setIsSortedMostRecent] = useState(true);
  // Check if the generate button is pressed
  const [generatePressed, setGeneratePressed] = useState(false);
  // The recipes generated based on similar recipes.
  const [generatedRecipes, setGeneratedRecipes] = useState(null);
  // THe message History
  const [messageHistory, setMessageHistory] = useState([]);
  // selected Recipes
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  // Sets image awaiting state
  const [awaitingImages, setAwaitingImages] = useState(false);

  const [filterText, setFilterText] = useState("");

  const [showDeleteRecipesModal, setShowDeleteRecipesModal] = useState(false);

  const handleShowDeleteRecipesModal = () => setShowDeleteRecipesModal(true);
  const handleCloseDeleteRecipesModal = () => setShowDeleteRecipesModal(false);

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

  useEffect(() => {
    /*
      Check cache
        - Destructure relevant JSON data
        - Set application state
    */
    let {recipes, messageHistory, similarRecipes} = getCache();
    if (recipes && messageHistory && similarRecipes == true) {
      setGeneratedRecipes(recipes);
      setMessageHistory(messageHistory);
      setGeneratePressed(true);
    }
  }, []);

  // Sorts the recipes based on most or least recent.
  useEffect(() => {
    if (recipes) {
      let sortedFilteredRecipes = [...filteredRecipes];
      
      
      // Sort the recipes based on the "created" attribute
      sortedFilteredRecipes.sort((a, b) => {
        // Convert the date strings to Date objects for reliable comparison
        let dateA = new Date(a.created);
        let dateB = new Date(b.created);
        // Determine sort order based on the isSortedMostRecent flag
        return isSortedMostRecent ? dateB - dateA : dateA - dateB;
      });
      setFilteredRecipes(sortedFilteredRecipes);
    }
  }, [isSortedMostRecent, recipes]);  

  const getRecipes = async () => {
    try {
      const res = await fetch(`/api/recipes/request?id=${session.user.id}`, {
        method: "GET",
      });
      const recipes = await res.json();
      setRecipes(recipes);
      setFilteredRecipes(recipes);
      setSelectedRecipes([]);
    } catch (err) {
      console.error(err);
    }
  };

  const filterRecipes = (text) => {
    setCurrentPage(1); // Reset to the first page on filter.
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

  // Calculate the recipes to show on the current page
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  // currentRecipes hold the 9 recipes.
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Calculate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredRecipes.length / recipesPerPage); i++) {
    pageNumbers.push(i);
  }

  const updateRecipesAfterDelete = (updatedRecipes) => {
    getRecipes();
    // Reset selectedRecipes if the deleted recipe was selected
    setSelectedRecipes(prev => prev.filter(r => updatedRecipes.some(ur => ur._id === r._id)));
  };

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

  const handleStopGenerating = () => {
    console.log("Stopped generating from recipes list");
    console.log("Resetting all values");
    getRecipes(); // Update the recipes list
    setGeneratePressed(false);
    setMessageHistory([]);
    setSelectedRecipes([]); // Unselect selected recipes
    setGeneratedRecipes(null);
    setFilterText("");
    sessionStorage.clear();
  }

  const handleGenerateSimilarRecipes = async () => {
    setGeneratePressed(true);
    if (messageHistory.length > 0) {
      setGeneratedRecipes(null);
    }
    try {
      console.log("Messages History: " + messageHistory);
      setAwaitingImages(false);
      /* --- Fetch API to get recipes ---  */
      const res = await fetch("/api/generateRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedRecipes, messageHistory }),
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
      setGeneratedRecipes(data.recipes);
      setMessageHistory(data.messageHistory);
      /* ------------------------------ */
      sessionStorage.clear()
      data.similarRecipes = true;
      setCache(data);
      /* Updating database stuff: */
      if (session) {
        updateDatabase(data.recipes.length);
      }
      /* ---------------------------- */
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {/* Creates the Back Button */}
      {generatePressed && (
        <Button
          onClick={handleStopGenerating}
          className="generate-recipe-btn"
          variant="secondary"
          size="md"
          disabled={!generatedRecipes ? true : false}
        >
          &laquo; Manage Recipes Page
        </Button>
      )}
      {generatePressed ? (
        // Generating stuff:
        <Container className="mt-5">
          <Row className="justify-content-md-center">
            <Col md={12} className="text-center">
              <h1 className="hero-title">
                Discover Similar Based Recipes
              </h1>
              <p className="text-muted">
                Generating recipes based on recipes you've selected.
              </p>
            </Col>
          </Row>
          <Container className="mb-4">
              <Row>
                <Button
                  onClick={handleGenerateSimilarRecipes}
                  className="generate-recipe-btn"
                  variant="success"
                  size="lg"
                  disabled={!generatedRecipes ? true : false}
                >
                  Generate New Recipes
                </Button>
              </Row>
              {!generatedRecipes && <LoadingScreen awaitingImages={awaitingImages}/>}
            </Container>
          {/* Render recipes if available */}
          {generatedRecipes && (
            <RecipeCardList recipes={generatedRecipes}/>
          )}
        </Container>
      ) : (
        // manage account recipes page:
        <>
          <h1 className="hero-title">Saved Recipes</h1>
          <p className="text-muted mt-3">Showing {currentRecipes.length} of {filteredRecipes.length} Recipes</p>
          <hr />

          <Container style={{ paddingBottom: '100px' }}>
            {/* 
              Filter through recipes with text
              Display filter search bar only if user has saved recipes
            */}
            {recipes && (
              <Row className="align-items-center">
                <Col xs="auto">
                  <Button variant={selectedRecipes.length > 0 ? "secondary" : "primary"} onClick={() => {selectedRecipes.length > 0 ? setSelectedRecipes([]) : setSelectedRecipes(filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe))}}>
                    {selectedRecipes.length > 0 ? <>Deselect All {currentRecipes.length} Recipes</> : <>Select All {currentRecipes.length} Recipes</>}
                  </Button>
                </Col>
                <Col>
                  <Form.Control
                    id="filter-recipes"
                    type="text"
                    placeholder="Filter recipes"
                    className="me-3 mb-md-0" // Adds margin-bottom on smaller screens
                    value={filterText}
                    onChange={(e) => {filterRecipes(e.target.value); setFilterText(e.target.value);}}
                  />
                </Col>
                <Col xs="auto">
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      Sort: {isSortedMostRecent ? "Newest" : "Oldest"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setIsSortedMostRecent(true)} disabled={isSortedMostRecent ? true : false}>Newest</Dropdown.Item>
                      <Dropdown.Item onClick={() => setIsSortedMostRecent(false)} disabled={isSortedMostRecent ? false : true}>Oldest</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            )}
            <br />
            <br />
            {/* Render recipes if available */}
            {/* Needs to hide the save recipes button */}
            {currentRecipes &&
              (currentRecipes.length ? (
                <>
                  <RecipeCardList 
                    recipes={currentRecipes} 
                    isSelectable={true} 
                    selectedRecipes={selectedRecipes} 
                    setSelectedRecipes={setSelectedRecipes}
                    onUpdateAfterDelete={updateRecipesAfterDelete} />
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <Pagination>
                        <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                        {pageNumbers.map(number => (
                          <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                            {number}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length} />
                        <Pagination.Last onClick={() => paginate(pageNumbers.length)} disabled={currentPage === pageNumbers.length} />
                      </Pagination>
                    </Col>
                  </Row>
                </>
              ) : (
                <p className="text-muted">No recipes saved...</p>
              ))}
          </Container>
          {selectedRecipes.length > 0 && (
              <div className="action-buttons-container bg-primary bg-opacity-25">
                <Button 
                  variant="success" 
                  onClick={handleGenerateSimilarRecipes} 
                  disabled={selectedRecipes.length > 9 ? true : false} 
                  className="me-2">
                    {selectedRecipes.length > 9 ? <>Can't Generate! 9 Recipes Max.</> : <>Generate Similar Recipes</>}
                </Button>
                <Button variant="danger" onClick={handleShowDeleteRecipesModal}>Delete Recipes</Button>
              </div>
          )}

          <DeleteRecipesModal
            show={showDeleteRecipesModal}
            onHide={handleCloseDeleteRecipesModal}
            recipes={selectedRecipes}
            onDeleteSuccess={() => {
              getRecipes(); // Update the recipes list
              setFilterText("");
            }}
          />
        </>
      )}
    </>
  );
}
