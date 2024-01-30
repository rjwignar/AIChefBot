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
const collection = client.db("aichefbot").collection("users");

// get one user
export async function getUserByEmail(email) {
  // find the user
  const result = await collection.findOne({ email: email });

  // return to api
  return result;
}

// add one user
export async function addUser(user) {
  // try and find user by email
  const existingUser = getUserByEmail(user.email);

  // does the user exist already?
  if (existingUser.insertedId) {
    return existingUser;
  }

  // add the user
  const result = await collection.insertOne({
    username: user.name,
    email: user.email,
    requests: [],
    appliances: [],
    avoided_ingredients: [],
  });


  if (result.insertedId) {
    // retrieve object by _id from the DB
    const addedUser = getUserByEmail(user.email);

    // return added user
    return addedUser;
  } else {
    return null;
  }
}

export async function updateUser(user) {
  const result = await db.findOne({ username: user.username });
  console.log(result);
}

export async function removeUser(username) {
  const result = await collection.deleteOne({ username: username });
  if (result.deletedCount == 1) {
    return true;
  } else {
    return false;
  }
}

// connect to mongodb
export async function connect() {
  try {
    // attempt to connect
    await client.connect();
    // everything ok
    console.debug("Connection established.");
  } catch (err) {
    // failed to connect
    console.error("Connection failed: ", err);
  }
}
