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

export async function getRecipeById(userId, recipeId) {
    try {
        return await collection.find({
            _id: userId,
            "recipes._id": recipeId
        },
        {
            _id: 0,
            "recipes.$": 1
        })
    }
    catch (err) {
        console.error(err);
        return null;
    }
    
}

export async function addRecipe(userId /*, recipe*/) {
    try {
        let recipe = require('./testRecipe.json');
        return await collection.updateOne({_id: userId}, {$push: {recipes: recipe}})
    }
    catch (err) {
        console.err(err)
        return null;
    }
}

export async function deleteRecipe() {
    // delete
}
