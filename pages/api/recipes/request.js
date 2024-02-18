
// define responses issued to fetch requests made for RECIPES

// get our db methods
import { getRecipeById, addRecipe, updateRecipeCount, deleteRecipe } from "./recipes";

// handler for all relevant requests
async function handler(req, res) {
  switch (req.method) {
    // GET
    // this route accepts a query string that contains session.user.id (cognito id)
    case "GET": {
      try {
        // await the found user
        const recipe = await getRecipeById(req.query.userId, req.query.recipeId);
        if (recipe) {
          // everything ok, return user as json
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
        // await the user to be added, and returned
        const recipeId = await addRecipe(req.body);
        if (recipeId) {
          // everything ok, return user as json
          res.status(200).json({_id: recipeId});
        } else {
          res.status(404).json({ message: "Recipe was not added." });
        }
      } catch (err) {
        console.debug(err);
        res.status(500);
      }
      break;
    }
    case "PUT": {
      try {
        const result = await updateRecipeCount(req.body);
        if (result.acknowledged == true) {
          res.status(200).json({message: "Updated recipe count."});
        }
        else res.status(404).json({message: "Failed to update recipe count."});
      }
      catch (err) {
        console.debug(err);
        res.status(500).json({error: "Internal server error."});
      }
      break;
    }
    case "DELETE":
      try {
        console.log(req.body);
        // await the recipe to be added, and returned
        const result = await deleteRecipe(req.body);
        if (result.acknowledged) {
          // everything ok, return user as json
          res.status(200).json({message: "Recipe was removed."});
        } else {
          res.status(404).json({ message: "Recipe was not deleted." });
        }
      } catch (err) {
        console.debug(err);
        res.status(500);
      }
      break;
    default:
      // any other route that is attempted should be denied.
      res.status(401).json({ error: "Request denied." });
      break;
  }
}

export default handler;
