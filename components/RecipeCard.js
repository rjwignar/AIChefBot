import React, { useEffect, useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const RecipeCard = ({ recipe }) => {

   const router = useRouter();

   const { data: session, status } = useSession();
   const [showModal, setShowModal] = useState(false);
   const [savedId, setSavedId] = useState(null);

   const handleClose = () => setShowModal(false);
   const handleShow = () => setShowModal(true);

   // If the recipe has an _id property
   // We are working with a saved recipe
   // Initialize the card to suit the context. (Manage saved recipes)
   useEffect(() => {
      if (recipe._id) {
         setSavedId(recipe._id);
      }
   }, []);

   const handleSavingRecipe = async () => {
      // Log action
      console.log(`Saving recipe: ${recipe.name}`)
      // Save recipe to user's recipe list
      const res = await fetch(`/api/recipes/request`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({userId: session.user.id, recipe: recipe}),
       });
       const savedRecipe = await res.json();
       setSavedId(savedRecipe._id);
       setShowModal(false);
   }

   const handleRemoveRecipe = async() => {
      // Log action
      console.log(`Removing recipe: ${recipe.name}`);
      // Delete recipe from user's recipe list
      const res = await fetch(`/api/recipes/request`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({userId: session.user.id, recipeId: savedId}),
      })
      setSavedId(null);
      setShowModal(false);

      if (router.pathname === '/account/recipes') {
         router.reload();
      }
   }
   
   return (
      <>
         <Card className="recipe-card mb-4" onClick={handleShow}>
            <Card.Img className='recipe-card-img' variant="top" src='https://i.imgur.com/iTpOC92.jpeg'/>
            <Card.Body className='p-3'>
               <Card.Title className='recipe-card-title mt-2'>{recipe.name}</Card.Title>
               <hr className='recipe-card-line'/>
               <div className="ingredients-steps-count">
                  <span className="recipe-card-subtitle me-4">
                     <i className="fas fa-book"></i> 
                     <strong className='ms-2'>{recipe.ingredients.length}</strong> Ingredients
                  </span>
                  <span className='recipe-card-subtitle'>
                     <i className="fas fa-utensils"></i> 
                     <strong className='ms-2'>{recipe.steps.length}</strong> Steps
                     </span>
               </div>
               <Card.Subtitle className='recipe-card-subtitle mb-4 mt-3 text-muted'>
                  {recipe.description}
               </Card.Subtitle>
               <Button variant='primary' onClick={handleShow} className='recipe-card-btn d-block mx-auto w-50 mb-2'>
                  View {savedId && <span>Saved</span>} Recipe
               </Button>
            </Card.Body>
         </Card>

         <Modal show={showModal} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
               <Modal.Title className='recipe-modal-title'>{recipe.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {/* The detailed recipe view goes here */}
               <h5>Ingredients:</h5>
               <ul className='text-muted'>
               {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
               ))}
               </ul>
               <h5>Steps:</h5>
               <ol className='text-muted'>
               {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
               ))}
               </ol>
            </Modal.Body>
            <Modal.Footer>
               {status !== "unauthenticated" && (
                  savedId === null ? (
                  <Button variant='primary' onClick={handleSavingRecipe}>
                     Save Recipe
                  </Button> 
                  ) : (
                  <Button variant='primary' onClick={handleRemoveRecipe}>
                     Remove Recipe
                  </Button> 
                  )
               )}
               <Button variant="secondary" onClick={handleClose}>
                  Close
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};

export default RecipeCard;