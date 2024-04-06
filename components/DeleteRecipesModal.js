// DeleteRecipesModal.js
import { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";

// onDeleteSuccess -> Unselects and resets recipes.
function DeleteRecipesModal({ show, onHide, recipes, onDeleteSuccess }) {
   const enhancedOnHide = () => {
      onHide(); // Close the modal
      onDeleteSuccess(); // Call the onDeleteSuccess prop function
   };

   // Handle Delete Recipe
   const handleDeleteRecipes = async () => {
      console.log('Deleting Recipes');
      console.log(recipes);
      // Your deletion logic here...

      // If deletion was successful hide modal and reset recipes list a unselect selected recipes
      enhancedOnHide();
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