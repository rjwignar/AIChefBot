// api for db connection

// require dotenv, acquire environment variables
require("dotenv").config();
import bodyParser from "body-parser";

const db = require ("./users");

async function handler(req, res) {

  console.log(req.body);

  // get request method
  const { method } = req;

  switch (method) {
    // GET
    case "GET": db.getUser(); break;
    // POST
    case "POST": db.addUser(req.query); break;
    //
    // TODO
    //
    // DELETE
    case "DELETE":
      // ./users.js
      // db.deleteUser();
  }
  // await connecting to the database server via the client

  // set up an instance of mongo client
  const { MongoClient } = require("mongodb");
  const username = process.env.DB_USER;
  const password = process.env.DB_PASS;
  // database secret URI (handwritten to .env)
  const CONNECTION_STRING = `mongodb+srv://${username}:${password}@cluster0.bcearzi.mongodb.net/`;
  // create a client object, pass the connection string
  const client = new MongoClient(CONNECTION_STRING);

  try {
    // attempt to connect
    await client.connect();
    console.debug("db connection opened");

    // establish db
    // establish collection
    // const collection = client.db("sample_mflix").collection("users");
    const db = client.db("sample_mflix");
    const collection_2 = db.collection("users");

    // TEST
    // get users from appropriate db
    const user = {
      id: 1,
      cognito_id: "???",
      email: "example@example.com",
      full_name: "exemplary example",
      password: "example",
      requests: [
        {
          id: "?",
          query: "make me a recipe that includes bread and cheese, please.",
          ingredients: ["bread", "cheese"],
          recipes: [
            {
              id: "?",
              name: "?",
              details: "turn oven on, toast bread, melt cheese",
            },
            {
              id: "?",
              name: "?",
              details:
                "boil pasta, make cheese sauce, top with breadcrumbs, bake",
            },
          ],
        },
      ],
      appliances: ["fridge", "gas stove", "gas oven"],
      avoided_ingredients: ["pork", "almonds"],
    };

    const collection = client.db("aichefbot").collection("users");
    // const addResult = await collection.insertOne(user);
    const findResult = await collection
      .find({ full_name: "exemplary example" })
      .toArray();
    //

    // debug log the returned value from collection
    console.debug(findResult);

    // everything ok, send json data
    res.status(200).json(findResult);

  } catch (err) {
    // log error
    console.error(err);
    res.status(500).json({ error: "failure" });

  } finally {
    await client.close();
    console.debug("db connection closed.");
  }
}

export default handler;
