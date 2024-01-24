// Demonstration page for deleting a user from the database

import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { useState } from "react";

export default function Home() {
  // handles text input for searching a user
  const [textInput, setTextInput] = useState("");

  // handles the status of deletion
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    // get user from database
    // send POST request to api with form data
    try {
      // post user data to api using HTTP request body
      const response = await fetch(`./api/request`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(textInput),
      });
      // extract json from response
      const result = await response.json();
      // set message
      setMessage(result.message);
    } catch (err) {
      console.debug("Error adding user: ", err);
      setMessage(null);
    } finally {
      document.getElementById("usernameField").value = "";
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
              Delete User{" "}
              <span style={{ color: "rgb(255,100,100)" }}>(Demonstration)</span>
            </h1>
            <p>
              Delete a user from the database.
            </p>
          </Col>
        </Row>

        {/* Form */}
        <Row>
          <Col md={8} className="d-flex">
            <Form onSubmit={handleSubmit} className="d-flex">
              <Form.Control
                id="usernameField"
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Username"
              ></Form.Control>
              &nbsp;&nbsp;
              <Button className="landing-page-btn" type="submit">
                Search
              </Button>
            </Form>
          </Col>
        </Row>
        <br />
        <p>{message}</p>
      </Container>
    </>
  );
}
