// Demonstration page for retrieving user from the mongodb database

import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState } from "react";
import UserData from '../components/UserData';

export default function Home() {
  // this function registers form fields
  const { register, handleSubmit } = useForm();

  // handles the user returned from the api
  const [user, setUser] = useState(null);

  async function submitForm(data, e) {
    console.log(data);

    try {
      // post user data to api using HTTP request body
      const res = await fetch(`./api/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // user was added successfully, set user
      const result = await res.json();
      setUser(result);

    } catch (err) {
      setUser({message: "An error occurred"});
    }
  }

  // add a user to the database -- form
  return (
    <>
      <Container className="hero-section">
        <Row className="align-items-center">
          <Col>
            <br />
            <h1 className="hero-title">
              Add User <span style={{ color: "green" }}>(Demonstration)</span>
            </h1>
            <p>Let's register a user.</p>
          </Col>
        </Row>
        <hr />
        <br />
        {/* Form */}
        <Form onSubmit={handleSubmit(submitForm)}>
          <Form.Group as={Row}>
            <Form.Label as={Col}
              className="fw-bold col-md-2"
              htmlFor="username"
              column
              md={1}
            >
              Username:
            </Form.Label>
            <Col md={3} className="mb-2">
              <Form.Control
                required
                type="text"
                placeholder="username"
                id="username"
                name="username"
                {...register("username")}
              ></Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label as={Col}
              className="fw-bold col-md-2"
              htmlFor="email"
              column
              sm={1}
            >
              Email:
            </Form.Label>
            <Col md={3} className="me-2 mb-2">
              <Form.Control
                required
                type="text"
                placeholder="email"
                id="email"
                name="email"
                {...register("email")}
              ></Form.Control>
            </Col>
          </Form.Group>
          <br />

          <Button className="landing-page-btn ml-2" type="submit">
            Add User
          </Button>
        </Form>
        <br />
        {/* Display user, if user was added successfully. */}
        <UserData user={user}/>
        
      </Container>
    </>
  );
}
