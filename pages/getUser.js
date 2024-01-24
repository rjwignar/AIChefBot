// Demonstration page for retrieving user from the database

import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { useState } from "react";
import Link from "next/link";
import UserData from "../components/UserData";

export default function Home() {
  // handles text input for searching a user
  const [textInput, setTextInput] = useState("");

  // handles the user returned from the api
  const [user, setUser] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    // get user from database
    const res = await fetch(`./api/request?username=${textInput}`, {
      method: "GET",
    });

    // user found, set user as found user
    if (res.ok) {
      const result = await res.json();
      setUser(result);
    } else {
      setUser("None");
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
              Get User{" "}
              <span style={{ color: "rgb(255,100,100)" }}>(Demonstration)</span>
            </h1>
            <ul>
              <li><Link href="./getUser">Get User &raquo;</Link></li>
              <li><Link href="./addUser">Add User &raquo;</Link></li>
              <li><Link href="./removeUser">Remove User &raquo;</Link></li>
            </ul>
            <br />
            <p>
              Let's acquire one user from the database, along with their
              recipes.
            </p>
          </Col>
        </Row>
        {/* Form */}
        <Row>
          <Col md={8} className="d-flex">
            <Form onSubmit={handleSubmit} className="d-flex">
              <Form.Control
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
        <UserData user={user} />
      </Container>
    </>
  );
}
