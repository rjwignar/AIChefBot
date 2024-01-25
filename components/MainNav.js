import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function MainNav() {
   const router = useRouter();

   /*Implement AWS Cognito login function here:*/
   const loginBtn = () => {
      
   }
   const { data: session, status } = useSession();

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
                           <button className="landing-page-btn" role="button" onClick={loginBtn}>Login</button>
                        </Nav.Link>
                     </Link>
                     ):(
                        <NavDropdown title="Welcome (NAME)" id="basic-nav-dropdown">
                        <NavDropdown.Item>
                           Manage Account
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                           Logout
                        </NavDropdown.Item>
                     </NavDropdown>
                     )
                     }
                     {/* <Link href="#" passHref legacyBehavior>
                        <Nav.Link>
                           <button className="landing-page-btn" role="button" onClick={loginBtn}>Login</button>
                        </Nav.Link>
                     </Link> */}
                     {/*When User is logged in, display dropdown:*/}
                     {/* <NavDropdown title="Welcome (NAME)" id="basic-nav-dropdown">
                        <NavDropdown.Item>
                           Manage Account
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                           Logout
                        </NavDropdown.Item>
                     </NavDropdown> */}

                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>
         <br/>
         <br/>
      </>
   );
}