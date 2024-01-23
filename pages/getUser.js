// Demonstration page for retrieving user from the mongodb database

import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { useState } from "react";
import UserData from "../components/UserData";

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
      const result = await res.json();
      console.log(result);
      setUser(result);
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
        <UserData user={user}/>
      </Container>
    </>
  );
}
