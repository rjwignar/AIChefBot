import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';

const GeneratePage = () => {
   return (
      <Container className='my-lg-5'>
         <Container>
            <Row className="justify-content-md-center">
               <Col md={12} className="text-center">
                  <h1 className='recipe-modal-title'>
                     Generate Recipes
                     <span className='dot-1'>.</span>
                     <span className='dot-2'>.</span>
                     <span className='dot-3'>.</span>
                  </h1>
               </Col>
            </Row>
            <Row className="justify-content-md-center my-5 animate__animated animate__fadeInUp">
               <Col md={6} lg={4} className="generate-card-body">
                  {/* For Ingredients */}
                  <a href="/recipes/generate/ingredients" className="generate-card ingredients">
                     <div className="overlay"></div>
                     <div className="circle">
                     <i className="circle-icon fas fa-book fa-4x"></i>
                     </div>
                     <p className='generate-card-paragraph'>By Ingredients</p>
                  </a>
               </Col>
               <Col md={6} lg={4} className="generate-card-body">
                  {/* For Diet */}
                  <a href="/recipes/generate/diet" className="generate-card diet">
                     <div className="overlay"></div>
                     <div className="circle">
                     <i className="circle-icon fas fa-apple-alt fa-4x"></i>
                     </div>
                     <p className='generate-card-paragraph'>By Diet</p>
                  </a>
               </Col>
            </Row>
         </Container>
      </Container>
   );
};

export default GeneratePage;