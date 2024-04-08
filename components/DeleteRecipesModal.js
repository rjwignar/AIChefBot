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

   const removeImages = async (imageIds) => {
     console.log(`Removing images with ids: ${imageIds}`);

     try {
       // Delete image from Cloudinary environment
       const res = await fetch(`/api/images/request`, {
         method: "DELETE",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ image_ids: imageIds }),
       });

       if (res.ok){
         console.log("Images deleted successfully")
       } else {
         console.error("Failed to delete images")
       }

     } catch (err) {
      console.error("Error deleting images:", err);
     }
   };

   // Handle Delete Recipe
   const handleDeleteRecipes = async () => {
      //console.log('Deleting Recipes');
      //console.log("user id",session.user.id)
      //console.log(recipes);

      const imageIds = recipes.filter(recipe => recipe.hasOwnProperty('image_id')).map(recipe => recipe.image_id);

      if (imageIds.length > 0){
         removeImages(imageIds)
      }

      try {
      //console.log(`Removing recipes with ids: ${recipes.map((recipe) => recipe._id)}`);
      // Delete recipe from user's recipe list
      const res = await fetch(`/api/recipes/request`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userId: session.user.id, recipeIds: recipes.map((recipe) => recipe._id),
        }),
      });

      if (res.ok) {
      console.log("Recipes deleted successfully");
      // If deletion was successful hide modal and reset recipes list a unselect selected recipes
      enhancedOnHide();
      }else{
         console.error("Failed to delete recipes");
      }

      } catch (err){
         console.error("Error removing recipes", err)
      }
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