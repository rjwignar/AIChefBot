
import { Container, Col, Row } from 'react-bootstrap';
import RecipeCard from "@/components/RecipeCard";
import { useEffect, useState } from "react";

// isSelectable -> Determines if the recipes can be selected.
// selectedRecipes -> Get selected recipes 
// setSelectedRecipes -> Sets the selected recipes based on what recipes are selected.
/*
  When recipe list cannot be selected
    <RecipeCardList recipes={recipe}/>
  When recipe list can be selected
    <RecipeCardList recipes={recipe} isSelectable={true} setSelectedRecipes={setSelectedRecipes}/>
*/
const RecipeCardList = ({ recipes, isSelectable = false, selectedRecipes = [], setSelectedRecipes}) => {
    const [savedRecipes, setSavedRecipes] = useState(recipes);
    // Watch the recipes list for changes
    useEffect(() => setSavedRecipes(recipes), [recipes]);

    // Handle select changes
    useEffect(() => {
      // If recipes are selected set the parent to the localSelectedRecipes.
      if (isSelectable && setSelectedRecipes) {
        setSelectedRecipes(selectedRecipes);
      }
    }, [selectedRecipes, isSelectable, setSelectedRecipes])

    // callback from RecipeCard, recipe is deleted from database, then:
    // filter out the deleted recipe, rerender the recipes array
    const handleOnDelete = (recipe) => {
        setSavedRecipes(savedRecipes.filter((e) => e._id != recipe._id));
    }

    const handleSelect = (recipe, isSelected) => {
      if (isSelected) {
          // Add recipe to selection
          setSelectedRecipes(prevSelected => [...prevSelected, recipe]);
      } else {
          // Remove recipe from selection
          setSelectedRecipes(prevSelected => prevSelected.filter(r => r._id !== recipe._id));
      }
  };

    return (
        <Container className="animate__animated animate__fadeInUp">
            <Row>
              {savedRecipes &&
                savedRecipes.map((recipe, index) => (
                  <Col key={index} sm={12} md={6} lg={4} className="mb-4">
                    <RecipeCard
                        recipe={recipe}
                        onDelete={handleOnDelete}
                        onSelect={(isSelected) => handleSelect(recipe, isSelected)}
                        isSelected={selectedRecipes.some((r) => r._id === recipe._id)}
                        isSelectable={isSelectable}
                    />
                  </Col>
                ))}
            </Row>
        </Container>
    )
}

export default RecipeCardList;

