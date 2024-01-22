// api for db connection

// get our db methods
const db = require ("users");

// handler for all relevant requests
async function handler(req, res) {
  switch (req.method) {
    // GET
    case "GET": {
      res.status(200)
      .json(db.getUser()); 
      break;
    }
    // POST
    case "POST": {
      console.log(req.body)
      res.status(200)
      .json(db.addUser(req.body));
      break;
    }
    case "DELETE":
      // ./users.js
      // db.deleteUser();
    default:
      res.json(401).json({error: "Request denied."});
  }
}

export default handler;
