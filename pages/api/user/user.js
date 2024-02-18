// performs interactions with the database

// set up an instance of mongo client
import { MongoClient } from "mongodb";
// require dotenv, acquire environment variables
require("dotenv").config();
// create a client object, pass the connection string
const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bcearzi.mongodb.net/`
);
// get users collection
export const collection = client.db("aichefbot").collection("users");

// get one user
export async function getUserById(id) {
  // find the user
  try {
    const result = await collection.findOne({ _id: id });
    // return to api
    return result;
  }
  catch (err) {
    console.error(err);
    return null;
  }
}

// add one user
export async function addUser(user) {
  try {
    // add the user
    const result = await collection.insertOne({
      _id: user.id,
      generatedRecipes: 0,
      recipes: [],
      appliances: [],
      avoided_ingredients: [],
    });

    if (result.insertedId) {
      // retrieve object by _id from the DB
      const addedUser = getUserById(user.id);
      // return added user
      return addedUser;
    } else {
      // no user added, was not found
      console.error("Could not find added user.");
      return null
    }
  } catch (err) {
    // tried to insert, failed, user exists
    console.error("User exists.");
    return null;
  }
}

// TODO
export async function removeUser(username) {
  try {
    await collection.deleteOne({ username: username });
    return true;
  }
  catch (err) {
    console.error(err);
    return false;
  }
  
}

export async function removeAll() {
  await collection.deleteMany({});
}


