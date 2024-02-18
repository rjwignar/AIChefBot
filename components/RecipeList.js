import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCard from '@/components/RecipeCard'; // assuming RecipeCard is in the same directory

const RecipeList = ({ recipes, showDeleteRecipe }) => {
   return (
      <Container className='animate__animated animate__fadeInUp'>
         <Row>
            {recipes && recipes.map((recipe, index) => (
               <Col key={index} sm={12} md={6} lg={4} className="mb-4">
                  <RecipeCard recipe={recipe} showDeleteRecipe={showDeleteRecipe}/>
               </Col>
            ))}
         </Row>
      </Container>
   );
};

export default RecipeList;
