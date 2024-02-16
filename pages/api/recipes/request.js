
// define responses issued to fetch requests made for RECIPES

// get our db methods
import { getRecipeById, addRecipe } from "./recipes";

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
        const recipe = await addRecipe(req.body);
        
        if (recipe) {
          // everything ok, return user as json
          res.status(200).json(recipe);
        } else {
          res.status(404).json({ message: "Recipe was not added." });
        }
      } catch (err) {
        console.debug(err);
        res.status(500);
      }
      break;
    }
    case "DELETE":
      // TODO
      break;
    default:
      // any other route that is attempted should be denied.
      res.json(401).json({ error: "Request denied." });
      break;
  }
}

export default handler;
