// DeleteModal.js
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { CognitoIdentityProviderClient, DeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { useSession, signOut } from 'next-auth/react';

function DeleteModal({ show, onHide, username }) {
   const [inputUsername, setInputUsername] = useState('');
   const [error, setError] = useState('');
   const {data: session} = useSession();

   // Handle input change
   const handleUsernameChange = (e) => {
      setInputUsername(e.target.value);
      setError(''); // Clear error when user starts typing
   };

   const enhancedOnHide = () => {
      setInputUsername('');
      onHide();
   }

   // Validate username and perform deletion
   const handleDeleteAccount = async () => {
      if (inputUsername !== username) {
         setError('Username does not match.');
         return;
      }
      // Add Delete Account Logic Here:
      console.log("Deleting account with " + username);

      const client = new CognitoIdentityProviderClient({ region: 'us-east-1'});

      const input = { // DeleteUserRequest
         AccessToken: session.user.accessToken, // required
       };
       try {
         const command = new DeleteUserCommand(input);
         const response = await client.send(command);
         signOut({callbackUrl: "/logout"})
       } catch (error) {
         console.log("error deleting the account:", error);
       }
   };

   return (
      <Modal show={show} onHide={enhancedOnHide} centered>
         <Modal.Header closeButton>
               <Modal.Title>Delete Account</Modal.Title>
         </Modal.Header>
         <Modal.Body>
               <Alert variant="warning">
                  Warning: Deleting your account is irreversible. You will not be able to recover any data associated with your account after deletion.
               </Alert>
               {error && <Alert variant="danger">{error}</Alert>}
               <Form>
                  <Form.Group controlId="usernameInput">
                     <Form.Label>Confirm Username</Form.Label>
                     <Form.Control
                           type="text"
                           placeholder="Enter your username to confirm"
                           value={inputUsername}
                           onChange={handleUsernameChange}
                     />
                     <Form.Text className="text-muted">
                           Enter your username to enable the delete button.
                     </Form.Text>
                  </Form.Group>
               </Form>
         </Modal.Body>
         <Modal.Footer>
               <Button variant="secondary" onClick={enhancedOnHide}>Cancel</Button>
               <Button variant="danger" onClick={handleDeleteAccount} disabled={!inputUsername}>Delete Account</Button>
         </Modal.Footer>
      </Modal>
   );
}

export default DeleteModal;
