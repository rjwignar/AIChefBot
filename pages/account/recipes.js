// account/recipes/recipes.js
import { Container, Col, Row, Form, Button, Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import RecipeCardList from "@/components/RecipeCardList";
import { Pagination } from 'react-bootstrap';
import DeleteRecipesModal from "@/components/DeleteRecipesModal";

// Page of manage recipes:
export default function recipes() {
  const { data: session, status } = useSession();
  const [recipes, setRecipes] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  // Variable to hold what page the user is in.
  const [currentPage, setCurrentPage] = useState(1);
  // Change value if you think it should be changed:
  const [recipesPerPage] = useState(9);
  const [isSortedMostRecent, setIsSortedMostRecent] = useState(false);

  // selected Recipes
  const [selectedRecipes, setSelectedRecipes] = useState([]);

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

  // Sorts the recipes based on least or most recent.
  useEffect(() => {
    if (recipes) {
      let sortedFilteredRecipes = [...filteredRecipes];
      if (isSortedMostRecent) {
        sortedFilteredRecipes.reverse();
      } else {
        sortedFilteredRecipes = [...recipes];
      }
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

  const handleGenerateSimilarRecipes = () => {
    console.log('GENERATING RECIPES BASED ON SELECTED RECIPES:');
    console.log(selectedRecipes);
  }

  return (
    <>
      <h1 className="hero-title">Saved Recipes</h1>
      <hr />

      <Container style={{ paddingBottom: '100px' }}>
        {/* 
          Filter through recipes with text
          Display filter search bar only if user has saved recipes
        */}
        {recipes && (
          <Row className="align-items-center mt-3">
            <Col md={3}>
              <p className="text-muted mt-3">Showing {currentRecipes.length} of {recipes.length} Recipes</p>
            </Col>
            <Col md={7}>
              <Form.Control
                id="filter-recipes"
                type="text"
                placeholder="Filter recipes"
                className="mb-3 mb-md-0" // Adds margin-bottom on smaller screens
                onChange={(e) => filterRecipes(e.target.value)}
              />
            </Col>
            <Col md={2}>
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
                    <Pagination.Ellipsis disabled />
      
                    {pageNumbers.map(number => (
                      <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                        {number}
                      </Pagination.Item>
                    ))}
      
                    <Pagination.Ellipsis disabled />
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
            <Button variant="secondary" onClick={() => setSelectedRecipes([])} className="me-2">Deselect All</Button>
            <Button variant="success" onClick={handleGenerateSimilarRecipes} className="me-2">Generate Similar Recipes</Button>
            <Button variant="danger" onClick={handleShowDeleteRecipesModal}>Delete Recipes</Button>
          </div>
      )}

      <DeleteRecipesModal
        show={showDeleteRecipesModal}
        onHide={handleCloseDeleteRecipesModal}
        recipes={selectedRecipes}
        // onDeleteSuccess={() => {
        //   getRecipes();
        //   setSelectedRecipes([]);
        // }}
      />
    </>
  );
}
