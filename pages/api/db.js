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
module.exports.getUser = async (username) => {

    // find the user
    const result = await collection.findOne({ username: `${username}` });

    // return to api
    return result;
};

// add one user
module.exports.addUser = async (user) => {
    // add the user
    const result = await collection.insertOne({
        "username": user.username,
        "email": user.email,
        "requests": [],
        "appliances": [],
        "avoided_ingredients": []
      });
    
    // get Id from the inserted object
    const insertedId = result.insertedId;
    
    // retrieve object by _id from the DB
    const addedUser = await collection.findOne({_id: new ObjectId(insertedId)});

    // return the found user (that has been added)
    return addedUser;
};

// connect to mongodb
async function connect() {
  try {
    // attempt to connect
    await client.connect();
    // everything ok
    console.debug("Connection established.")
  } catch (err) {
    // failed to connect
    console.error(err);
}};

module.exports.connect = connect;