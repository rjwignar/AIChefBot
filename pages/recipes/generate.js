import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';

const GeneratePage = () => {
  const router = useRouter();

  return (
    <Container className="my-4">
      <Row className="justify-content-md-center">
        <Col md={12} className="text-center">
          <h1>Generate recipes...</h1>
        </Col>
      </Row>
      <Row className="justify-content-md-center my-4">
        <Col md={6} lg={4} className="d-flex justify-content-around">
          <Link href="/recipes/generate/ingredients" passHref>
            <Button variant="success" size="lg">By Ingredients</Button>
          </Link>
          <Link href="/recipes/generate/diet" passHref>
            <Button variant="success" size="lg">By Diet</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default GeneratePage;