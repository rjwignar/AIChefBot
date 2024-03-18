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

// get one user
export async function getUserById(id) {
  // find the user
  try {
    return await collection.findOne({ _id: id });
  }
  catch (err) {
    return null;
  }
}

// add one user
export async function addUser(user) {
  // check if user exists
  // return if found
  let result = await getUserById(user.id);
  // add the user
  if (!result) {
    try {
      await collection.insertOne({
        _id: user.id,
        generatedRecipes: 0,
        recipes: [],
        appliances: [],
        dietaryRestrictions: [],
      });
      result = await getUserById(user.id);
    } catch (err) {
      // tried to insert, failed, user exists
      return null;
    }
  }
  return result;
}

// Update user by ID with contained data
export async function updateUser(data) {
  try {
    const res = await collection.updateOne(
      {_id: data.userId}, 
      { $set: { dietaryRestrictions: data.dietaryRestrictions }}
    );
    return data;
  }
  catch(err) {
    return null;
  }
}

export async function removeUser(userId) {
  try {
    await collection.deleteOne({ _id: userId });
    return true;
  }
  catch (err) {
    console.error(err);
    return false;
  }
  
}


