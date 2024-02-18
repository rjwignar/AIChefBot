// operate on recipes in database

// is not a route

// performs interactions with the database

// set up an instance of mongo client
import { MongoClient, ObjectId } from "mongodb";
// require dotenv, acquire environment variables
require("dotenv").config();
// create a client object, pass the connection string
const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bcearzi.mongodb.net/`
);
// get users collection
export const collection = client.db("aichefbot").collection("users");

export async function updateRecipeCount(data) {
    // Parse incoming object
    data = JSON.parse(data);
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

export async function addRecipe(data) {
    // assign a unique identifier
    data.recipe._id = new ObjectId();
    // update database
    try {
        const res = await collection.updateOne({_id: data.userId}, {$push: {recipes: data.recipe}})
        return data.recipe._id;
    }
    catch (err) {
        console.err(err)
        return null;
    }
}


export async function deleteRecipe(data) {
    // delete recipe
    try {
        return await collection.deleteOne({
            _id: data.userId,
            "recipes._id": data.recipeId
        });
    }
    catch(err) {
        console.err(err);
        return null;
    }
}
