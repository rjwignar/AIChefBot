import { Container } from "react-bootstrap";
import MainNav from "./MainNav";
import { useSession } from 'next-auth/react';
export default function Layout(props) {
   const { data: session, status } = useSession();

   // // don't render page until user session is determined authenticated/unauthenticated
   // // i.e until status returns "authenticated" or "unauthenticated"
   // // see https://next-auth.js.org/getting-started/client#example for more information
   if (status === "loading") {
      return null;
   }

   return (
      <>
         <MainNav/>
         <br/>
         <br/>
         <Container>
            {props.children}
         </Container>
         <br/>
      </>
   );
}