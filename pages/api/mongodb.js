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
export async function getUserById(id) {
  // find the user
  try {
    const result = await collection.findOne({ _id: id });
    // return to api
    return result;
  }
  catch (err) {
    console.log(err);
    return null;
  }
}

// add one user
export async function addUser(user) {
  try {
    // add the user
    const result = await collection.insertOne({
      _id: user.id,
      username: user.name,
      email: user.email,
      requests: [],
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
      console.debug("Could not find added user.");
      return null
    }
  } catch (err) {
    // tried to insert, failed, user exists
    console.debug("User exists.");
    return null;
  }
}

// TODO
export async function updateUser(user) {
  const result = await db.findOne({ username: user.username });
  console.log(result);
}

// TODO
export async function removeUser(username) {
  const result = await collection.deleteOne({ username: username });
  if (result.deletedCount == 1) {
    return true;
  } else {
    return false;
  }
}

export async function removeAll() {
  await collection.deleteMany({});
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
