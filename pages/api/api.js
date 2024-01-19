// api for db connection

// we need to parse the request body: better method of extracting post parameters
import bodyParser from 'body-parser';

// get our db methods
const db = require ("./users");

// handler for all relevant requests
async function handler(req, res) {

  console.log(req.body);

  // get request method
  const { method } = req;

  switch (method) {
    // GET
    case "GET": {
      res.status(200)
      .json(db.getUser()); 
      break;
    }
    // POST
    case "POST": db.addUser(req.query); break;
    //
    // TODO
    //
    // DELETE
    case "DELETE":
      // ./users.js
      // db.deleteUser();
    default:
      res.json(401).json({error: "Request denied."});
  }
}

export default handler;
