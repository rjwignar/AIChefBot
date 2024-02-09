import express from 'express';
const router = express.Router();

// add recipe-related routes here

// retrieve all recipes for a user
router.get('/recipes/:userId', async (req, res) => {
    const userId = req.params.userId;
    // code here
});

// save a recipe to user's list of recipes
router.post('/recipes/:userId', async (req, res) => {
    const userId = req.params.userId;
    const recipe = req.body;
    // code here
});

router.delete('/recipes/:userId/:recipeId', async (req, res) => {
    const userId = req.params.userId;
    const recipeId = req.params.recipeId;
    // code here
});

export default router;