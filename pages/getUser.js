// Demonstration page for retrieving user from the mongodb database

import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { useState } from "react";

export default function Home() {
  // handles text input for searching a user
  const [textInput, setTextInput] = useState("");

  // handles the user returned from the api
  const [user, setUser] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    // get user from database
    try {
      const res = await fetch(`./api/request?username=${textInput}`, {
        method: "GET",
      });
      // user found, set user as found user
      const user = await res.json();
      setUser(user);
    } catch (err) {
      // user was not found
      setUser({ message: "No user found." });
    }
  }

  // form for acquiring one user from the database, for demonstration purposes
  return (
    <>
      <Container className="hero-section">
        <Row className="align-items-center">
          <Col md={7}>
            <br />
            <h1 className="hero-title">
              Get User <span style={{ color: "green" }}>(Demonstration)</span>
            </h1>
            <p>
              Let's acquire one user from the database, along with their
              recipes.
            </p>
          </Col>
        </Row>

        {/* Form */}
        <Row>
          <Col md={3} className="d-flex">
            <Form onSubmit={handleSubmit} className="d-flex">
              <Form.Control
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Username"
              ></Form.Control>
              &nbsp;&nbsp;
              <Button className="landing-page-btn ml-2" type="submit">
                Search
              </Button>
            </Form>
          </Col>
        </Row>
        <br />
        {user == null ? (
          <></>
        ) : (
          <Card body className="fs-4">
            <h3>User:</h3>
            name: <span style={{ color: "green" }}>{user.username}</span>
            <br />
            email: <span style={{ color: "green" }}>{user.email}</span><br/>
            <br />
            <h3>appliances:</h3>
            <ul classame="fs-4">
              {user.appliances.length ? (
                user.appliances.map((item, i) => (
                  <li key={i}>
                    <span style={{ color: "green" }}>{item}</span>
                  </li>
                ))
              ) : (
                <></>
              )}
            </ul>
            <h3>requests:</h3>
            <ul classame="fs-4">
              {user.requests.length ? (
                user.requests.map((request, i) => (
                  <>
                    {i+ 1}: <span style={{ color: "green" }}>{request.query}</span>
                    <br/>
                    {/*<br/>ingredients:&nbsp;<span style={{ color: "green" }}>{request.ingredients}</span>*/}
                    
                    <br/>
                    <Container>
                    <h4>generated recipes:</h4>
                    <hr/>
                    {request.recipes.map((recipe, i) => (
                      <p key={i}>
                        <h4>{String.fromCharCode(97 + i)}: {recipe.name}</h4>
                        <span style={{ color: "green" }}>{recipe.details}</span>
                      </p>
                      
                    ))}
                    </Container>
                  </>
                ))
              ) : (
                <>None</>
              )}
            </ul>
          </Card>
        )}
      </Container>
    </>
  );
}
