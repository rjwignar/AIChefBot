// DeleteAllRecipesModal.js
import { Modal, Button, Alert } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

// onDeleteSuccess -> Unselects and resets recipes.
// make this use the user instead of recipes since we are deleting the accounts recipes!.
function DeleteAllRecipesModal({ show, onHide, recipes}) {
   const { data: session, status } = useSession();
   const router = useRouter();
   //const [recipes, setRecipes] = useState([]);

   const enhancedOnHide = () => {
      onHide(); // Close the modal
      //onDeleteSuccess(); // Call the onDeleteSuccess prop function
   };

   const removeImages = async (imageIds) => {
     console.log(`(DeleteAll) Removing images with ids: ${imageIds}`);

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
         console.log("(DeleteAll) Images deleted successfully")
       } else {
         console.error("(DeleteAll) Failed to delete images")
       }

     } catch (err) {
      console.error("(DeleteAll) Error deleting images:", err);
     }
   };

   // Handle Delete Recipe
   const handleDeleteRecipes = async () => {
      //console.log('Deleting Recipes');
      //console.log("user id",session.user.id)
      //console.log(recipes);

      //const recipes = await getRecipes();

      const imageIds = recipes.filter(recipe => recipe.hasOwnProperty('image_id')).map(recipe => recipe.image_id);

      if (imageIds.length >= 1){
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
      console.log("(DeleteAll) Recipes deleted successfully from DeleteAllRecipesModal");
      // If deletion was successful hide modal
      enhancedOnHide();
      router.reload(); // refreshes the page after deleting
      }else{
         console.error("(DeleteAll) Failed to delete recipes from DeleteAllRecipesModal");
      }

      } catch (err){
         console.error("(DeleteAll) Error removing recipes", err)
      }
   }

   return (
      <Modal show={show} onHide={enhancedOnHide} centered>
         <Modal.Header closeButton>
            <Modal.Title>Deleting All Recipes</Modal.Title>
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
               Delete {recipes.length > 0 ? recipes.length : "No Recipes"} Recipes
            </Button>
         </Modal.Footer>
      </Modal>
   )
}

export default DeleteAllRecipesModal;