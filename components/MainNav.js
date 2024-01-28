import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function MainNav() {
   const router = useRouter();
   const { data: session, status } = useSession();
   // console.log(session);
   return (
      <>
         <Navbar variant='light' expand='lg' className='fixed-top navbar-dark bg-dark'>
            <Container>
               <Navbar.Brand className='navbar-brand-custom'>
                  <Link href="/" passHref legacyBehavior>
                     <Nav.Link active={router.pathname === "/"}>AIChefBot</Nav.Link>
                  </Link>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="basic-navbar-nav" />
               <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                  </Nav>

                  <Nav>
                     {status === "unauthenticated" ? (
                           <Link href="#" passHref legacyBehavior>
                              <Nav.Link>
                                 <button className="landing-page-btn" role="button" onClick={() => signIn("cognito")}>Login</button>
                              </Nav.Link>
                           </Link>
                        ):(
                           <NavDropdown title={`Welcome ${session.user.name}`} id="basic-nav-dropdown">
                              <NavDropdown.Item>
                                 <Link href="/getUser" passHref legacyBehavior>
                                    <Nav.Link className='text-dark p-0' active={router.pathname === "/getUser"}>Manage Account</Nav.Link>
                                 </Link>
                              </NavDropdown.Item>
                              <NavDropdown.Item onClick={() => signOut({callbackUrl: "/logout"})}>
                                 Logout
                              </NavDropdown.Item>
                           </NavDropdown>
                        )
                     }
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>
         <br/>
         <br/>
      </>
   );
}