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

export async function getRecipeById() {
    // get
}

export async function addRecipe(userId /*, recipe*/) {
    try {
        
        let recipe = require('./testRecipe.json');
        console.log(userId, recipe)
        const result = await collection.updateOne({_id: userId}, {$push: {recipes: recipe}})
        console.log(result);
        return result;
    }
    catch (err) {
        console.log(err)
        return null;
    }
}

export async function deleteRecipe() {
    // delete
}
