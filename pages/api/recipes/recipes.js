
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
        // Push recipe to user's recipe list
        const res = await collection.updateOne(
            {_id: data.userId}, 
            { $push: { recipes: data.recipe }}
        );
        // Return with _id of added recipe.
        // Needed so this action can be undone in UI.
        return data.recipe._id;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

// Delete a recipe from user's recipe list
export async function deleteRecipe(data) {
    try {
        // Update user by userId, delete recipe by recipeId.
        return await collection.updateOne(
            { _id: data.userId },
            { $pull: { recipes: { _id: new ObjectId(data.recipeId) } } }
        );
    }
    catch(err) {
        console.error(err);
        return null;
    }
}
