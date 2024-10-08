// EmailModal.js
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { CognitoIdentityProviderClient, UpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider";
import VerificationCodeModal from '@/components/VerificationCodeModal';

export default function EmailModal({ show, onHide, currentEmail }) {
   const {data: session} = useSession();
   const [currentEmailInput, setCurrentEmailInput] = useState('');
   const [newEmail, setNewEmail] = useState('');
   const [errorMessage, setErrorMessage] = useState('');
   const [showVerificationModal, setShowVerificationModal] = useState(false);
   const [email, setEmail] = useState('');
   

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

      const client = new CognitoIdentityProviderClient({ region: 'us-east-1'});

      console.log(session.user.accessToken)

      const input = {
         UserAttributes: [
            {
               Name: "email",
               Value: newEmail
            }
         ],
         AccessToken: session.user.accessToken,
      };

      try{
         const command = new UpdateUserAttributesCommand(input);
         const response = await client.send(command);

      // Open verification modal instead of closing directly
      setEmail(newEmail);
      setShowVerificationModal(true);
      enhancedOnHide();
      console.log("New Email to save:", newEmail);
      }catch(error){
         console.log('Error updating Email:', error);
      }
      
   };

      // Function to handle verification logic
      const verifyEmail = (code, email) => {
         // Add Change Email Logic Here:
         console.log("Verification code:", code);
         console.log("New Email to save:", email);
   
         // --------------------------------------------------------
         // Here you should include your verification logic
         setShowVerificationModal(false); // Close verification modal
      };

   return (
     <>
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
       <VerificationCodeModal
         show={showVerificationModal}
         onHide={() => setShowVerificationModal(false)}
         verifyEmail={verifyEmail}
         newEmail={email}
       />
     </>
   );
}
