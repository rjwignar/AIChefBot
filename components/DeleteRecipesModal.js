// DeleteRecipesModal.js
import { Modal, Button, Alert } from "react-bootstrap";
import { useSession } from "next-auth/react";

// onDeleteSuccess -> Unselects and resets recipes.
function DeleteRecipesModal({ show, onHide, recipes, onDeleteSuccess }) {
   const { data: session, status } = useSession();

   const enhancedOnHide = () => {
      onHide(); // Close the modal
      onDeleteSuccess(); // Call the onDeleteSuccess prop function
   };

   // Handle Delete Recipe
   const handleDeleteRecipes = async () => {
      console.log('Deleting Recipes');
      console.log(recipes);
      // Delete recipe from user's recipe list
      await fetch(`/api/recipes/request`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({userId: session.user.id, recipeIds: recipes.map(recipe => recipe._id)}),
      })
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