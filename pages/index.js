import { Row, Col, Container, Image  } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Container className='hero-section'>
        <Row className='align-items-center'>
          <Col md={5}>
            <br/>
            <Image 
              src='https://i.imgur.com/4mvbVW0.png' 
              width={450} 
              height={200} 
              fluid 
              alt='Robot cooking' 
              className='hero-img'/>
          </Col>
          <Col md={7}>
            <br/>
            <h1 className='hero-title'>Meet your AI Chef</h1>
            <p>
              AIChefBot allows you to generate recipes based on simple input. Get started without an account, or register to save your favourite recipes.
            </p>
            {/*Pathway to generate recipes:*/}
            <button className="landing-page-btn main-btn" role="button" onClick={() => router.push("/recipes/generate")}>
              Get Started
            </button>
          </Col>
        </Row>
      </Container>
    </>
  );
}