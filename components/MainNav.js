import { Container, Nav, Navbar, NavDropdown, Image } from "react-bootstrap";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";

export default function MainNav() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Check if authenticated user has been unified with MongoDB
  const checkUser = async () => {
    try {
      // Call API to check user
      const res = await fetch(`/api/user/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session.user),
      });
      // Log result
      const result = await res.json();
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
   if (session) {
      checkUser();
     }
  }, [])

  return (
    <>
      <Navbar variant="light" expand="lg" className="fixed-top navbar-custom">
        <Container>
          <Navbar.Brand className="navbar-brand-custom">
            <Link href="/" passHref legacyBehavior>
              <Nav.Link active={router.pathname === "/"}>
                <Image
                  src="https://i.postimg.cc/k5J0qhsX/Test2.png"
                  width={150}
                  height={50}
                  fluid
                  alt="AIChefBot logo"
                />
              </Nav.Link>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto"></Nav>

            <Nav>
              {status === "unauthenticated" ? (
                <button
                  className="landing-page-btn"
                  role="button"
                  onClick={() => signIn("cognito")}
                >
                  Login
                </button>
              ) : (
                <NavDropdown
                  title={`Welcome ${session.user.name}`}
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item onClick={() => router.push("/account")}>
                    <p className="navbar-dropdown-item-custom m-1">
                      Manage Account
                    </p>
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => signOut({ callbackUrl: "/logout" })}
                  >
                    <p className="navbar-dropdown-item-custom m-1">Logout</p>
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
    </>
  );
}
