// VerificationCodeModal.js
import { React, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { CognitoIdentityProviderClient, VerifyUserAttributeCommand } from "@aws-sdk/client-cognito-identity-provider";
import { useSession, signOut } from 'next-auth/react';

export default function VerificationCodeModal({ show, onHide, verifyEmail, newEmail }) {
   const {data: session} = useSession();
   const [code, setCode] = useState('');
   const [error, setError] = useState('');

   const enhancedOnHide = () => {
      setCode('');
      setError('');
   }

   const handleVerify = async () => {
      if (!code) {
         setError('Please enter the verification code');
         return;
      }
      // Verify the code with actual code?

      const client = new CognitoIdentityProviderClient({ region: 'us-east-1'});

      const input = { // VerifyUserAttributeRequest
         AccessToken: session.user.accessToken, // required
         AttributeName: "email", // required
         Code: code, // required
       };
       try{
         const command = new VerifyUserAttributeCommand(input);
         const response = await client.send(command);
         // --------------------------------
         enhancedOnHide();
         verifyEmail(code, newEmail);
         signOut({callbackUrl: "/logout"})
       }catch(error){
         console.log('Error with code:', error);
       }

   };

   return (
      <Modal show={show} onHide={onHide} centered>
         <Modal.Header closeButton>
         <Modal.Title>Verify Email</Modal.Title>
         </Modal.Header>
         <Modal.Body>
         <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="formVerificationCode">
               <Form.Label>Verification Code</Form.Label>
               <Form.Control
               type="text"
               placeholder="Enter verification code"
               value={code}
               onChange={(e) => setCode(e.target.value)}
               />
            </Form.Group>
         </Form>
         </Modal.Body>
         <Modal.Footer>
         <Button variant="secondary" onClick={onHide}>
            Close
         </Button>
         <Button variant="primary" onClick={handleVerify}>
            Verify
         </Button>
         </Modal.Footer>
      </Modal>
   );
}
