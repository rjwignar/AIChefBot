// PasswordModal.js
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function PasswordModal({ show, onHide }) {
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

   // Validate and save changes
   const handleSaveChanges = () => {
         // Basic validation checks
         if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            return;
         }
         if (newPassword === currentPassword) {
            setError('New password must be different from the current password.');
            return;
         }
         // Check if account password is !== current password input:

         // Add Change Password Logic Here:
         console.log("Changing Password");

         // -------------------------------
         enhancedOnHide(); // Reset and close modal after successful operation
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