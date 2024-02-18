
// define responses issued to fetch requests made for RECIPES

// get our db methods
import { getRecipeById, addRecipe, updateGeneratedRecipes, deleteRecipe } from "./recipes";

// handler for all relevant requests
async function handler(req, res) {
  switch (req.method) {
    // GET
    case "GET": {
      try {
        // Get recipe
        const recipe = await getRecipeById(req.query.userId, req.query.recipeId);
        if (recipe) {
          // Respond with recipe
          res.status(200).json(recipe);
        } else {
          res.status(404).json({ message: "Recipe was not found." });
        }
      } catch (err) {
        console.debug(err);
        res.status(500);
      }
      break;
    }
    // POST
    case "POST": {
      try {
        // Add recipe
        const recipeId = await addRecipe(req.body);
        if (recipeId) {
          // Respond with recipe ID
          res.status(200).json({_id: recipeId});
        } else {
          res.status(404).json({ message: "Recipe was not added." });
        }
      } catch (err) {
        res.status(500).json({message: "Failed to add recipe.", "Error: ": err});
      }
      break;
    }
    case "PUT": {
      try {
        // Update the user's recipe count
        const result = await updateGeneratedRecipes(req.body);
        // Result was not null
        if (result.modifiedCount == 1) {
          res.status(200).json({message: "Updated recipe count."});
        }
        // Result was null
        else res.status(404).json({message: "Failed to update recipe count."});
      }
      catch (err) {
        console.debug(err);
        res.status(500).json({message: "Failed to updated recipe count.", "Error: ": err});
      }
      break;
    }
    case "DELETE":
      try {
        // Await recipe deletion
        const result = await deleteRecipe(req.body);
        
        if (result.acknowledged) {
          // everything ok, return user as json
          res.status(200).json({message: "Recipe was removed."});
        } else {
          res.status(404).json({ message: "Recipe was not deleted." });
        }
      } catch (err) {
        res.status(500).json({message: "Failed to delete recipe.", "Error: ": err});
      }
      break;
    default:
      // any other route that is attempted should be denied.
      res.status(401).json({ error: "Request denied." });
      break;
  }
}

export default handler;
