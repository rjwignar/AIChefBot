// api for db connection

// require dotenv, acquire environment variables
require('dotenv').config();
const username = process.env.DB_USER;
const password = process.env.DB_PASS;

// database secret URI (handwritten to .env)
const CONNECTION_STRING = `mongodb+srv://${username}:${password}@cluster0.bcearzi.mongodb.net/`;

// set up an instance of mongo client
const { MongoClient } = require('mongodb');

// create a client object, pass the connection string
const client = new MongoClient(CONNECTION_STRING);


export default async function main() {
    // await connecting to the database server via the client
    await client.connect();
    console.log("successful connection ...");
    
    const db = client.db("sample_mflix");
    const collection = db.collection("users");

    const findResult = await collection.find({}).toArray();
    console.log('found all of this stuff:', findResult);

}

main()
    .then(console.log)
    .catch(console.error)
    .finally(await client.close());

//
// TEST BELOW
//

/*
export default function handler(req,res) {
    res.status(200).json({message: CONNECTION_STRING});
}
*/

