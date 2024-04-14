
import { MongoClient, ObjectId } from "mongodb";
require("dotenv").config();

const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bcearzi.mongodb.net/`
);

// Collection of Users
export const collection = client.db("aichefbot").collection("users");

// Updates the count of generated recipes
export async function updateGeneratedRecipes(data) {
    // Update the user by Id
    try {
        // Increment user's recipe count
        const result = await collection.updateOne(
            { _id: data.userId },
            { $inc: { generatedRecipes: data.recipeCount}},
        );
        // Return database's acknowledgement response.
        return result;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

// Get all recipes by userId
export async function getRecipesByUser(id) {
    try {
        const user =  await collection.findOne({_id: id});
        return user.recipes;
    }
    catch (err) {
        console.error(err);
        return null;
    }
    
}

// Add a recipe to user's recipe list
export async function addRecipe(data) {
    // update database
    try {
        // assign a unique identifier
        data.recipe._id = new ObjectId();
        // assign a creation date
        data.recipe.created = new Date().toISOString();
        // Push recipe to user's recipe list
        const res = await collection.updateOne(
            {_id: data.userId}, 
            { $push: { recipes: data.recipe }}
        );
        console.log("Added recipe: ", data.recipe);
        // Return with _id of added recipe.
        // Needed so this action can be undone in UI.
        return data.recipe._id;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

// Delete recipe(s) from user's recipe list
export async function deleteRecipes(data) {
    const ids = data.recipeIds.map(id => new ObjectId(id));
    try {
        // Update user by userId, delete recipes by recipeIds.
        const res = await collection.updateMany(
            { _id: data.userId },
            { $pull: { recipes: { _id: { $in: ids } } } }
        );
        console.log(res);
        return res;
    }
    catch(err) {
        console.error(err);
        return null;
    }
}