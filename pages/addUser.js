// Demonstration page for adding a user to the database

import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import UserData from "../components/UserData";

export default function Home() {
  // this function registers form fields
  const { register, handleSubmit } = useForm();

  // handles the user returned from the api
  const [user, setUser] = useState(null);

  async function submitForm(data) {
    // send POST request to api with form data

    // post user data to api using HTTP request body
    const res = await fetch(`./api/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // user found, set user as found user
    if (res.ok) {
      const result = await res.json();
      setUser(result);
    } else {
      setUser("None");
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
            <ul>
              <li>
                <Link href="./getUser">Get User &raquo;</Link>
              </li>
              <li>
                <Link href="./addUser">Add User &raquo;</Link>
              </li>
              <li>
                <Link href="./removeUser">Remove User &raquo;</Link>
              </li>
            </ul>
            <br />
            <p>Let's register a user.</p>
          </Col>
        </Row>
        {/* Form */}
        <Form onSubmit={handleSubmit(submitForm)}>
          <Form.Group as={Row}>
            <Form.Label
              as={Col}
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
            <Form.Label
              as={Col}
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
        <UserData user={user} />
      </Container>
    </>
  );
}
