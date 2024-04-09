import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Badge, Form } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRef } from 'react';
import generatePDF from 'react-to-pdf';

// recipe   -> the current recipe
// onDelete -> callback function to remove this recipe from caller's recipes array
// onSelect -> callback function to add/remove a recipe based on if it's selected.
// isSelected -> Determines if the user selected the recipe or not
// isSelectable -> Check if recipes can be selected or not.
const RecipeCard = ({ recipe, onDelete, onSelect, isSelected, isSelectable }) => {
   // the reference element for the root of a to-PDF snapshot
   const targetRef = useRef();

   const { data: session, status } = useSession();
   const [showModal, setShowModal] = useState(false);
   const [savedId, setSavedId] = useState(null);

   const handleClose = () => setShowModal(false);
   const handleShow = () => setShowModal(true);;

   // If the recipe has an _id property
   // We are working with a saved recipe
   // Initialize the card to suit the context. (Manage saved recipes)
   useEffect(() => {
      if (recipe._id) {
         setSavedId(recipe._id);
      }
   }, [recipe]);

   const saveImage = async () => {
      // if there is an AI-generated image, use it (tempImageURL)
      // otherwise, use placeholder image
      const res = await fetch(`/api/images/request`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({imageURL: recipe.tempImageURL}),
      });

      const extractedData = await res.json();

      // Give recipe two new properties; imageURL (Cloudinary image secure_url), image_id  (Cloudinary image public_id)
      recipe.imageURL = extractedData.secure_url;
      recipe.image_id = extractedData.public_id;
   }
   const handleSavingRecipe = async (e) => {
      e.target.disabled = true;

      // Log action
      console.log(`Saving recipe: ${recipe.name}`)

      // If the recipe has an AI-generated image, save it recipe image to Cloudinary and add Cloudinary imageURL and image_id to recipe object
      if (recipe.hasOwnProperty('tempImageURL')){
         await saveImage();
         console.log("updated recipe object", recipe);
      }
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

   const removeImage = async (image_id) => {
      console.log(`Removing image with id: ${image_id}`);

      // Delete image from Cloudinary environment
      const res = await fetch(`/api/images/request`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({image_ids: [image_id]}),
      });

   }
   const handleRemoveRecipe = async(e) => {
      e.target.disabled = true;
      // Log action
      console.log(`Removing recipe: ${recipe.name}`);

      // Delete recipe image first, if it has an image hosted on Cloudinary
      if (recipe.hasOwnProperty('image_id')){
         await removeImage(recipe.image_id);
      }
      // Delete recipe from user's recipe list
      await fetch(`/api/recipes/request`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({userId: session.user.id, recipeIds: [savedId]}),
      })
      setSavedId(null);
      setShowModal(false);

      // If recipes have an _id property
      // They have been loaded from the database
      // We should delete these from the user's view
      if (recipe._id) {
         onDelete(recipe);
      }
   }

   const downloadPDF = () => {
      // get footer from modal, which holds buttons
      let e = document.getElementById('modal-footer')

      // generate filename
      let filename = recipe.name.replaceAll(' ', '-');

      // react-to-pdf takes a "snapshot", hide the buttons before snapshot
      e.style.display='none';
      generatePDF(targetRef, {filename: `${filename}`});

      // display buttons again
      e.style.display='flex';
   }

   // Handle if the recipe is selected
   const handleSelectionChange = (e) => {
      e.stopPropagation(); // Stop the event from bubbling up
      onSelect(!isSelected); // Toggle the selected state
   };
   
   return (
      <>
         {/* Users can select a recipe by also clicking on the recipe. */}
         <Card className={`recipe-card ${isSelectable && isSelected ? 'border-primary border-2' : ''}`} onClick={!isSelectable ? handleShow : handleSelectionChange}>
            { isSelectable && (
               <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '17px',
                  margin: 0,
                  transform: "scale(1.5)",
               }}>
                  {/* Check box to allow for users to select */}
                  <Form.Check
                     type="checkbox"
                     checked={isSelected}
                     onChange={(e) => handleSelectionChange(e)}
                     onClick={(e) => e.stopPropagation()}
                     className="recipe-select-checkbox"
                  />
               </div>
            )}
            <Card.Img className='recipe-card-img' variant="top" src={recipe.imageURL || recipe.tempImageURL || 'https://i.imgur.com/iTpOC92.jpeg'}/>
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
               {/* Added e.stopPropagation to stop from selecting the recipe. */}
               <Button variant='primary' onClick={(e) => {
                  if (isSelectable) e.stopPropagation();
                  handleShow();
               }} className='recipe-card-btn d-block mx-auto w-50 mb-2'>
                  View {savedId && <span>Saved</span>} Recipe
               </Button>
            </Card.Body>
         </Card>

         <Modal show={showModal} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            {/* root of the PDF snapshot */}
            <section ref={targetRef}>
            <Modal.Header closeButton>
               <Modal.Title className='recipe-modal-title'>{recipe.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body ref={targetRef}>
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
            <Modal.Footer id="modal-footer">
            <Button variant="success" onClick={downloadPDF}><i className="fas fa-download"></i></Button>
               {status !== "unauthenticated" && (
                  savedId === null ? (
                  <Button variant='primary' onClick={e => handleSavingRecipe(e)}>
                     Save Recipe
                  </Button> 
                  ) : (
                  <Button variant='primary' onClick={e => handleRemoveRecipe(e)}>
                     Remove Recipe
                  </Button>
                  )
               )}
               <Button variant="secondary" onClick={handleClose}>
                  Close
               </Button>
            </Modal.Footer>
            </section>
         </Modal>
      </>
   );
};

export default RecipeCard;