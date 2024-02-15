import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

// Makes the loading screen page when user is generating recipes.
const LoadingScreen = () => {
   return (
      <Container className="text-center my-4">
         <h4 className="loading-text">Loading<span>.</span><span>.</span><span>.</span></h4>
         <br/>
         <Row className='animate__animated animate__fadeInUp'>
            {[...Array(3)].map((_, i) => (
               <Col key={i} md={4} className="mb-4">
               <Card className="placeholder-card">
                  <Card.Body>
                     {/* You might want to add some placeholder content here */}
                     <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                     <br/><br/><br/><br/><br/><br/><br/><br/>
                  </Card.Body>
               </Card>
               </Col>
            ))}
         </Row>
      </Container>
   );
};

export default LoadingScreen;
