
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
        return result;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

// Get one recipe by ID
export async function getRecipeById(data) {
    console.log(data);
    try {
        return await collection.findOne({
            _id: data.userId,
            "recipes._id": data.recipeId
        },{
            _id: 0,
            "recipes.$": 1
        })
    }
    catch (err) {
        console.error(err);
        return null;
    }
    
}

// Add a recipe to user's recipe list
export async function addRecipe(data) {
    // assign a unique identifier
    data.recipe._id = new ObjectId();
    // update database
    try {
        const res = await collection.updateOne(
            {_id: data.userId}, 
            { $push: { recipes: data.recipe }}
        );
        return data.recipe._id;
    }
    catch (err) {
        console.err(err)
        return null;
    }
}

// Delete a recipe from user's recipe list
export async function deleteRecipe(data) {
    console.log(data);
    // delete recipe
    try {
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
