import { Container, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';

const GeneratePage = () => {

   const router = useRouter();

   const handleClick = (href) => {
      router.push(href);
   }

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
               <Col lg={3} className="generate-card-body mt-3">
                  {/* For Ingredients */}
                  <a className="generate-card ingredients" onClick={() => handleClick("/recipes/generate/ingredients")}>
                     <div className="overlay"></div>
                     <div className="circle">
                     <i className="circle-icon fas fa-book fa-4x"></i>
                     </div>
                     <p className='generate-card-paragraph'>By Ingredients</p>
                  </a>
               </Col>
               <Col lg={3} className="generate-card-body mt-3">
                  {/* For Ingredients And Diet */}
                  <a className="generate-card ingredientsAndDiet" onClick={() => handleClick("/recipes/generate/ingredients-and-diet")}>
                     <div className="overlay"></div>
                     <div className="circle">
                     <i className="circle-icon fab fa-pagelines fa-4x"></i>
                     </div>
                     <p className='generate-card-paragraph'>By Ingredients & Diet</p>
                  </a>
               </Col>
               <Col lg={3} className="generate-card-body mt-3">
                  {/* For Diet */}
                  <a className="generate-card diet" onClick={() => handleClick("/recipes/generate/diet")}>
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