// performs interactions with the database

// set up an instance of mongo client
const { MongoClient, ObjectId } = require("mongodb");
// require dotenv, acquire environment variables
require("dotenv").config();
// create a client object, pass the connection string
const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bcearzi.mongodb.net/`
);
// get users collection
const collection = client.db("aichefbot").collection("users");

// get one user
module.exports.getUser = async function (username) {
  // find the user
  const result = await collection.findOne({ username: username });

  // return to api
  return result;
};

// add one user
module.exports.addUser = async function (user) {
  // add the user
  const result = await collection.insertOne({
    username: user.username,
    email: user.email,
    requests: [],
    appliances: [],
    avoided_ingredients: [],
  });

  // get Id from the inserted object
  const insertedId = result.insertedId;

  // retrieve object by _id from the DB
  const addedUser = await collection.findOne({ _id: new ObjectId(insertedId) });

  // return the found user (that has been added)
  return addedUser;
};

module.exports.updateUser = async function (user) {
  const result = await db.findOne({ username: user.username });
  console.log(result);
};

module.exports.removeUser = async function(username) {
  const result = await collection.deleteOne({ username: username });
  if (result.deletedCount == 1) {
    console.log("returning true...");
    return true;
  }
  else {
    return false;
  }
};

// connect to mongodb
module.exports.connect = async function () {
  try {
    // attempt to connect
    await client.connect();
    // everything ok
    console.debug("Connection established.");
  } catch (err) {
    // failed to connect
    console.error("Connection failed: ", err);
  }
};
