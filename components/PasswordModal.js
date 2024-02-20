// PasswordModal.js
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { CognitoIdentityProviderClient, ChangePasswordCommand } from "@aws-sdk/client-cognito-identity-provider"
import { useSession } from 'next-auth/react';

function PasswordModal({ show, onHide }) {
   const {data: session} = useSession();
   const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmNewPassword, setConfirmNewPassword] = useState('');
   const [error, setError] = useState('');

   // Handle input field changes
   const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
   const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
   const handleConfirmNewPasswordChange = (e) => setConfirmNewPassword(e.target.value);

   // Enhanced onHide function to reset form on modal close
   const enhancedOnHide = () => {
         setCurrentPassword('');
         setNewPassword('');
         setConfirmNewPassword('');
         setError('');
         onHide();
   };

   //checking for users session
   // console.log("session callback from passwordModal.js", session);
   // console.log("access password token/session", session.user.accessToken);

   // Validate and save changes
   const handleSaveChanges = async () => {
         // Basic validation checks
         if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            return;
         }
         // Check if account password is !== current password input:
         if (newPassword === currentPassword) {
            setError('New password must be different from the current password.');
            return;
         }

         // console.log("Changing Password");
         // Initialize CognitoIdentityServiceProvider
         const client = new CognitoIdentityProviderClient({ region: 'us-east-1'});

         const input = {
            PreviousPassword: currentPassword,
            ProposedPassword: newPassword,
            AccessToken: session.user.accessToken,   
         };
         try{
            const command = new ChangePasswordCommand(input);
            const response = await client.send(command);
            // console.log('Password changed successfully');
            // -------------------------------
            enhancedOnHide(); // Reset and close modal after successful operation
         }catch(error){
            console.error('Error changing password:', error);
            setError(error.message);
         }
         
   };

   return (
      <Modal show={show} onHide={enhancedOnHide} centered>
            <Modal.Header closeButton>
               <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {error && <Alert variant="danger">{error}</Alert>}
               <Form>
                  <Form.Group className="mb-3" controlId="currentPassword">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                           type="password"
                           placeholder="Enter current password"
                           value={currentPassword}
                           onChange={handleCurrentPasswordChange}
                        />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="newPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                           type="password"
                           placeholder="Enter new password"
                           value={newPassword}
                           onChange={handleNewPasswordChange}
                        />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="confirmNewPassword">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                           type="password"
                           placeholder="Confirm new password"
                           value={confirmNewPassword}
                           onChange={handleConfirmNewPasswordChange}
                        />
                  </Form.Group>
               </Form>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={enhancedOnHide}>Close</Button>
               <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
            </Modal.Footer>
      </Modal>
   );
}

export default PasswordModal;
