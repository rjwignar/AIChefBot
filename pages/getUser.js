// Demonstration page for retrieving user from the mongodb database

import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function Home() {
  const [textInput, setTextInput] = useState("");

  const [user, setUser] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    // get user from database
    const res = await fetch(`./api/request?username=${textInput}`, { method: "GET" });
    const user = await res.json();
    setUser(user);
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
            <p>
              {/*
              {user.appliances.map(appliances => (
                <li key={user.id}>{appliance}</li>
              ))}
              */}
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
          <Card body>
            <p>Name: <span style={{color: "green"}}>{user.full_name}</span></p>
            <p>Email: <span style={{color: "green"}}>{user.email}</span></p>
            <p>Appliances:
              <ul>
                {user.appliances.map((item, i) => (
                  <li key={i}><span style={{color: "green"}}>{item}</span></li>
                ))}
              </ul>
            </p>
            <p></p>
            <p></p>
          </Card>
        )}
      </Container>
    </>
  );
}
