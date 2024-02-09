import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button, Nav, Badge } from "react-bootstrap";
import { useSession } from 'next-auth/react';

// account.js: Displays the account info
export default function account() {
   const { data: session, status } = useSession();

   // State to track the active tab
   const [activeTab, setActiveTab] = useState('details');

   const [user, setUser] = useState(null);
   // may need to fill the dependency array with [session], unless MainNav carries data between renders
   useEffect(() => {
      if (session != null) {
         // get data
         const fetchData = async () => {
            const res = await fetch(`/api/user/request?id=${session.user.id}`, {
               method: "GET",
            });
            await res.json().then(user => {
               setUser(user);
               console.log("User was found: \n", user)
            });
            if (!res.ok) {
               try {
                  // post session to api
                  const res = await fetch(`/api/user/request`, {
                     method: "POST",
                     headers: {
                       "Content-Type": "application/json",
                     },
                     body: JSON.stringify(session.user),
                   });
                  const user = await res.json();
   
                   // log result for testing
                  console.log("Added new user: \n", user);
                  setUser(user);
               }
               catch(err) {
                  // log errors for testing
                  console.log(err);
               }
            }
         }
         fetchData();
      }
   }, []);

   return (
      <>
         <Container className="mt-5">
            <Card className="account-card mx-4 animate__animated animate__fadeInUp animate__fast">
               <Card.Header>
                  <Nav className="nav-tabs card-header-tabs mt-1 mx-1">
                        <Nav.Item>
                           <Nav.Link
                              active={activeTab === 'details'}
                              onClick={() => setActiveTab('details')}
                              className="text-muted"
                           >
                              Details
                           </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                           <Nav.Link
                              active={activeTab === 'statistics'}
                              onClick={() => setActiveTab('statistics')}
                              className="text-muted"
                           >
                              Statistics
                           </Nav.Link>
                        </Nav.Item>
                  </Nav>
               </Card.Header>
               {activeTab === 'details' && (
                  <Card.Body className="p-5">
                     <Container className="p-2">
                        <h1 className="account-title">Account Details</h1>
                        <Card.Subtitle className="mb-2 text-muted">Manage your AIChefBot Profile</Card.Subtitle>
                     </Container>
                     <hr className="accountLine"/>
                     <Container className="p-2">
                        <Row className="align-items-center">
                           <Col md={5}>
                              <Card.Title>Username:</Card.Title>
                           </Col>
                           <Col md={7} className="text-end text-muted">
                              {session ? session.user.name : "username"}
                           </Col>
                        </Row>
                     </Container>
                     <hr className="accountLine"/>
                     <Container className="p-2">
                        <Row className="align-items-center">
                           <Col md={4}>
                              <Card.Title>Email:</Card.Title>
                              <Card.Subtitle className="md-2 text-muted">The email address associated with your account.</Card.Subtitle>
                           </Col>
                           <Col md={7} className=" text-end text-muted">
                              {session ? session.user.email : "email"}
                           </Col>
                           <Col md={1} className="text-end">
                              <button className="account-update-btn">Edit</button>
                           </Col>
                        </Row>
                     </Container>
                     <hr className="accountLine"/>
                     <Container className="p-2">
                        <Row className="align-items-center">
                           <Col md={6}>
                              <Card.Title>Password:</Card.Title>
                              <Card.Subtitle className="md-2 text-muted">Set a unique password to protect your account.</Card.Subtitle>
                           </Col>
                           <Col md={6} className="text-end">
                              <button className="account-update-btn">Change Password</button>
                           </Col>
                        </Row>
                     </Container>
                     <hr className="accountLine"/>
                     <Container className="p-1 pt-3">
                        <Button className="btn btn-danger">Delete Account</Button>
                     </Container>
                  </Card.Body>
               )}
               {activeTab === 'statistics' && (
                  <Card.Body className="p-5">
                     <Container className="p-2">
                        <h1 className="account-title">Account Statistics</h1>
                        <Card.Subtitle className="mb-2 text-muted">Manage your AIChefBot Statistics</Card.Subtitle>
                     </Container>
                     <hr className="accountLine"/>
                     <Container className="p-2">
                        <Row className="align-items-center">
                           <Col md={6}>
                              <Card.Title>Number of Saved Recipes:</Card.Title>
                           </Col>
                           <Col md={6} className="text-end">
                              <Badge className="px-3 pt-2 pb-2 bg-secondary">13</Badge>
                           </Col>
                        </Row>
                     </Container>
                     <hr className="accountLine"/>
                     <Container className="p-2">
                        <Row className="align-items-center">
                           <Col md={4}>
                              <Card.Title>Dietary Restrictions:</Card.Title>
                              <Card.Subtitle className="md-2 text-muted">Your dietary restrictions set in your account.</Card.Subtitle>
                           </Col>
                           <Col md={6} className="text-muted">
                              vegan, keto, etc...
                           </Col>
                           <Col md={2} className="text-end">
                              <button className="account-update-btn">Edit Diet List</button>
                           </Col>
                        </Row>
                     </Container>
                     <hr className="accountLine"/>
                     <Container className="p-2">
                        <Row className="align-items-center">
                           <Col md={6}>
                              <Card.Title>Recipes Generated:</Card.Title>
                           </Col>
                           <Col md={6} className="text-end">
                              <Badge className="px-3 pt-2 pb-2 bg-secondary">89</Badge>
                           </Col>
                        </Row>
                     </Container>
                     <hr className="accountLine"/>
                     <Container className="p-1 pt-3">
                        <Button className="btn btn-primary">Manage Saved Recipes</Button>
                     </Container>
                  </Card.Body>
               )}
            </Card>
         </Container>
      </>
   )
}