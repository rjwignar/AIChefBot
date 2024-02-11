import { Row, Col, Container, Image  } from 'react-bootstrap';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Container className='hero-section'>
        <Row className='align-items-center'>
          <Col md={7}>
            <br/>
            <h1 className='hero-title'>Meet your AI Chef</h1>
            <p>
              AIChefBot allows you to generate recipes based on simple input. Get started without an account, or register to save your favourite recipes.
            </p>
            {/*Pathway to generate recipes:*/}
            <Link href="#" passHref legacyBehavior>
              <button className="landing-page-btn" role="button">Get Started</button>
            </Link>
          </Col>
          <Col md={5} className='text-end'>
            <br/>
            <Image 
              src='https://i.imgur.com/4mvbVW0.png' 
              width={450} 
              height={200} 
              fluid 
              alt='Robot cooking' 
              className='hero-img'/>
          </Col>
        </Row>
      </Container>
    </>
  );
}