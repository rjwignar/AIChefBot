// UpdateDietModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-dropdown-select';

// List of all diets
const diets = [
   { value: 1, name: 'Vegetarian', displayName: '🌿 Vegetarian' },
   { value: 2, name: 'Vegan', displayName: '🌱 Vegan' },
   { value: 3, name: 'Pescatarian', displayName: '🐟 Pescatarian' },
   { value: 4, name: 'GlutenFree', displayName: '🚫🌾 Gluten Free' },
   { value: 5, name: 'Ketogenic', displayName: '🥩 Ketogenic' },
   { value: 6, name: 'Paleo', displayName: '🍖 Paleo' },
   { value: 7, name: 'LowFODMAP', displayName: '🔍 Low FODMAP' },
   { value: 8, name: 'DairyFree', displayName: '🚫🥛 Dairy Free' },
   { value: 9, name: 'Halal', displayName: '☪️ Halal' },
   { value: 10, name: 'Kosher', displayName: '✡️ Kosher' },
   { value: 11, name: 'Whole30', displayName: '📆 Whole30' },
];

const UpdateDietModal = ({ show, onHide, userData }) => {
   const [selectedDiets, setSelectedDiets] = useState([]);
   useEffect(() => {
      // Find all saved user diets using name to hold users diet 
      const savedDiets = diets.filter(diet => userData?.dietaryRestrictions.includes(diet.name));
      // Set the selected saved diets (Auto fills the multi-select list)
      setSelectedDiets(savedDiets);
   }, [show, userData]);

   const handleSaveChanges = async () => {
      console.log('Saving diets:', selectedDiets);
      let savedDiets = [];
      // Extract names from display-formatted strings
      selectedDiets.forEach(diet => {
         savedDiets.push(diet.name);
      });
      
      // Update the database with new string array of diets
      await fetch('/api/user/request', {
         method: "PUT",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            userId: userData._id,
            dietaryRestrictions: savedDiets,
         }),
      })
      // Persist changes in this modal
      userData.dietaryRestrictions = savedDiets;
      onHide(); // Close modal after saving changes
   };

   return (
      <Modal show={show} onHide={onHide} centered>
         <Modal.Header closeButton>
            <Modal.Title>Edit Your Diet Preferences</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <Select
               multi
               options={diets}
               labelField='displayName'
               valueField='value'
               values={selectedDiets}
               clearable={selectedDiets.length > 0}
               searchable
               searchBy='name'
               dropdownHandle
               separator
               closeOnSelect
               closeOnClickInput
               placeholder='Search'
               onChange={(diets) => setSelectedDiets(diets)}
               className='p-2'
            />
         </Modal.Body>
         <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>Close</Button>
            <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
         </Modal.Footer>
      </Modal>
   );
   };

export default UpdateDietModal;