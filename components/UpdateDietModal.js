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

// Simulated user saved diets (Using name to save a dietary restriction)
// Delete Once Database is completed:
const userSavedDiets = [
   'Vegetarian', 'Pescatarian' // Using name but you can use value
];
// ********************************************************************

const UpdateDietModal = ({ show, onHide }) => {
   const [selectedDiets, setSelectedDiets] = useState([]);

   // Load the user's saved diets when the modal opens
   useEffect(() => {
      // Find all saved user diets using name to hold users diet 
      const savedDiets = diets.filter(diet => userSavedDiets.includes(diet.name));
      // Set the selected saved diets (Auto fills the multi-select list)
      setSelectedDiets(savedDiets);
   }, [show]);

   const handleSaveChanges = () => {
      console.log('Saving diets:', selectedDiets);
      // Update Database Logic Goes Here:
      // Save them by using a key value (i.e. name, value)
      // We're simulating saving them by name, shown in the simulated user.

      
      // --------------------------------
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