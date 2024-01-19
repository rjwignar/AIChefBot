// performs interactions with the database


// set up an instance of mongo client
const { MongoClient } = require("mongodb");

// require dotenv, acquire environment variables
require("dotenv").config();

// create a client object, pass the connection string
const client = new MongoClient(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bcearzi.mongodb.net/`
);

// get one user
module.exports.getUser = async () => {
    // get users collection
    const collection = client.db("aichefbot").collection("users");

    // find the user
    const result = await collection.findOne({ email: 'example@example.com' });

    // return to api
    return result;
};

// add one user
module.exports.addUser = (params) => {
    
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