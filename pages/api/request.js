// api for db connection

// TODO: Delete a user.

// get our db methods
const db = require ("./db");

// handler for all relevant requests
async function handler(req, res) {
  switch (req.method) {
    // GET
    case "GET": {
      // pass the searched username to getUser(username)
      const user = await db.getUser(req.query.username);
      res.json(user);
      break;
    }
    // POST
    case "POST": {
      console.log(req.body)
      res.status(200)
      .json(await db.addUser(req.body));
      break;
    }
    case "DELETE":
      // ./users.js
      // db.deleteUser();
    default:
      res.json(401).json({error: "Request denied."});
      break;
  }
}

export default handler;
