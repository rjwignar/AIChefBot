// VerificationCodeModal.js
import { React, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function VerificationCodeModal({ show, onHide, verifyEmail, newEmail }) {
   const [code, setCode] = useState('');
   const [error, setError] = useState('');

   const enhancedOnHide = () => {
      setCode('');
      setError('');
   }

   const handleVerify = () => {
      if (!code) {
         setError('Please enter the verification code');
         return;
      }
      // Verify the code with actual code?

      // --------------------------------
      enhancedOnHide();
      verifyEmail(code, newEmail);
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
