import { useState } from 'react';
import { Container, Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { useRouter } from 'next/router';

// Define the list of diets with their respective icons
const diets = [
  { name: 'Vegetarian', icon: '🥦' },
  { name: 'Vegan', icon: '🌱' },
  { name: 'Pescatarian', icon: '🐟' },
  // Add more diets as needed
];

const DietPage = () => {
  const [selectedDiet, setSelectedDiet] = useState('');
  const router = useRouter();

  const handleSelectDiet = (diet) => {
    setSelectedDiet(diet);
  };

  const handleGenerateClick = () => {
    // Trigger API call with selectedDiet
    console.log('Selected diet:', selectedDiet);
    // Replace with actual API call logic
  };

  const handleGoBackClick = () => {
    router.push('/recipes/generate');
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-md-center">
        <Col md={12} className="text-center">
          <h1>Discover diet-based recipes</h1>
          <p>Generate recipes based on a particular diet or dietary restriction. Select a diet or dietary restriction and we'll do the rest.</p>
        </Col>
      </Row>
      <Row className="justify-content-md-center my-4">
        <Col md={6} lg={4} className="d-flex flex-column align-items-center">
          <DropdownButton
            id="dropdown-diet-selection"
            title={selectedDiet || 'Select a diet or dietary restriction'}
            onSelect={handleSelectDiet}
          >
            {diets.map((diet, index) => (
              <Dropdown.Item key={index} eventKey={diet.name}>
                {diet.icon} {diet.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <Button variant="success" size="lg" className="my-2" onClick={handleGenerateClick}>
            Generate!
          </Button>
          <Button variant="outline-danger" size="lg" onClick={handleGoBackClick}>
            Go back
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default DietPage;