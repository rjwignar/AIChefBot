import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function MainNav() {
   const router = useRouter();
   const { data: session, status } = useSession();
   const [ user, setUser ] = useState(null);
   
   // may need to fill the dependency array with [session], unless MainNav carries data between renders
   useEffect(() => {
      if (session != null) {
         const fetchData = async () => {
            try {
               // post session to api
               const res = await fetch(`/api/request`, {
                  method: "POST",
                  headers: {
                     "Content-Type": "application/json",
                  },
                  body: JSON.stringify(session.user),
               });
               const result = await res.json();

                // log result for testing
               console.log(result);
               setUser(result);
            }
            catch(err) {
               // log errors for testing
               console.log(err);
            }
         }
         fetchData();
      }
   }, []);

   return (
      <>
         <Navbar variant='light' expand='lg' className='fixed-top navbar-custom'>
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
                              <NavDropdown.Item onClick={() => router.push("/account")}>
                                 <p className='navbar-dropdown-item-custom m-1'>Manage Account</p>
                              </NavDropdown.Item>
                              <NavDropdown.Item onClick={() => signOut({callbackUrl: "/logout"})}>
                                 <p className='navbar-dropdown-item-custom m-1'>Logout</p>
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