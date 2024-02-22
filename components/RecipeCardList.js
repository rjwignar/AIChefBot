
import { Container, Col, Row } from 'react-bootstrap';
import RecipeCard from "@/components/RecipeCard";
import { useState } from "react";

const RecipeCardList = ({recipes}) => {
    const [savedRecipes, setSavedRecipes] = useState(recipes);

    // callback from RecipeCard, recipe is deleted from database, then:
    // filter out the deleted recipe, rerender the recipes array
    const handleOnDelete = (recipe) => {
        setSavedRecipes(savedRecipes.filter((e) => e._id != recipe._id));
    }

    return (
        <Container className="animate__animated animate__fadeInUp">
            <Row>
              {savedRecipes &&
                savedRecipes.map((recipe, index) => (
                  <Col key={index} sm={12} md={6} lg={4} className="mb-4">
                    <RecipeCard recipe={recipe} onDelete={handleOnDelete}/>
                  </Col>
                ))}
            </Row>
        </Container>
    )
}

export default RecipeCardList;

