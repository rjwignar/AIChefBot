// EmailModal.js
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import AWS from 'aws-sdk';
import { useSession } from 'next-auth/react';

export default function EmailModal({ show, onHide, currentEmail }) {
   const {data: session} = useSession();
   const [currentEmailInput, setCurrentEmailInput] = useState('');
   const [newEmail, setNewEmail] = useState('');
   const [errorMessage, setErrorMessage] = useState('');

   AWS.config.update({
      region: 'us-east-1',
      credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
        secretAccessKey: `${process.env.AWS_SECRET_KEY}`
      }
    });

   // Handle current email input change
   const handleCurrentEmailInputChange = (e) => setCurrentEmailInput(e.target.value);

   // Handle new email change
   const handleNewEmailChange = (e) => setNewEmail(e.target.value);

   // Email validation regex
   const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

   // Enhanced onHide function to reset the modal state
   const enhancedOnHide = () => {
      // Reset the input states and error message
      setCurrentEmailInput('');
      setNewEmail('');
      setErrorMessage('');
      // Call the original onHide prop function
      onHide();
   };

   // Validate and save changes
   const handleSaveChanges = async () => {

      if (currentEmailInput !== currentEmail) {
         setErrorMessage('The current email does not match!');
         return; // Stop the save operation
      }
      if (!emailRegex.test(newEmail)) {
         setErrorMessage('Not a valid email.');
         return;
      }
      // Add Change Email Logic Here:
      const params = {
         UserAttributes: [
            {
               Name: "email",
               Value: newEmail
            },
            {
               Name: "email_verified",
               Value: "false"
            }
         ],
         Username: session.user.Username,
         UserPoolId: `${process.env.AWS_COGNITO_POOL_ID}`
      };
      // console.log("Session", session);
      // console.log("params", params);
      try{
      const congnitoClient = new AWS.CognitoIdentityServiceProvider();
      await congnitoClient.adminUpdateUserAttributes(params).promise();

      // --------------------------------------------------------
      // Reset states
      enhancedOnHide(); // Hide modal after save and reset states
      console.log("New Email to save:", newEmail);
      }catch(error){
         console.log('Error updating Email:', error);
      }
      
   };

   return (
      <Modal show={show} onHide={enhancedOnHide} centered>
         <Modal.Header closeButton>
               <Modal.Title>Edit Email Address</Modal.Title>
         </Modal.Header>
         <Modal.Body>
               <Form>
                  {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                  <Form.Group controlId="formCurrentEmail">
                     <Form.Label>Current Email</Form.Label>
                     <Form.Control
                           type="email"
                           placeholder="Enter current email"
                           value={currentEmailInput}
                           onChange={handleCurrentEmailInputChange}
                           isInvalid={!!errorMessage}
                     />
                  </Form.Group>
                  <Form.Group controlId="formNewEmail" className="mt-3">
                     <Form.Label>New Email</Form.Label>
                     <Form.Control
                           type="email"
                           placeholder="Enter new email"
                           value={newEmail}
                           onChange={handleNewEmailChange}
                     />
                  </Form.Group>
               </Form>
         </Modal.Body>
         <Modal.Footer>
               <Button variant="secondary" onClick={enhancedOnHide}>
                  Close
               </Button>
               <Button variant="primary" onClick={handleSaveChanges}>
                  Save Changes
               </Button>
         </Modal.Footer>
      </Modal>
   );
}
