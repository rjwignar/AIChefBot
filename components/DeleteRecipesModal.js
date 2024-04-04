// DeleteRecipesModal.js
import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

function DeleteRecipesModal({ show, onHide, recipes }) {
   const enhancedOnHide = () => {
      onHide();
   };

   // Handle Delete Recipe
   const handleDeleteRecipes = async () => {
      console.log('Deleting Recipes');
      console.log(recipes);
   }

   return (
      <Modal show={show} onHide={enhancedOnHide} centered>
         <Modal.Header closeButton>
            <Modal.Title>Delete {recipes.length} Recipes</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <Alert variant="danger">
               Warning: Deleting these recipes is irreversible. You will not be able
               to recover any of these recipes after deletion.
            </Alert>
         </Modal.Body>
         <Modal.Footer>
            <Button variant="secondary" onClick={enhancedOnHide}>
               Cancel
            </Button>
            <Button
               variant="danger"
               onClick={handleDeleteRecipes}
            >
               Delete {recipes.length} Recipes
            </Button>
         </Modal.Footer>
      </Modal>
   )
}

export default DeleteRecipesModal;