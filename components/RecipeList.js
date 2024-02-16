import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCard from '@/components/RecipeCard'; // assuming RecipeCard is in the same directory

const RecipeList = ({ recipes }) => {
   return (
      <Container>
         <Row>
            {recipes && recipes.map((recipe, index) => (
               <Col key={index} sm={12} md={6} lg={4} className="mb-4">
                  <RecipeCard recipe={recipe} />
               </Col>
            ))}
         </Row>
      </Container>
   );
};

export default RecipeList;
