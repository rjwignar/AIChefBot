// api for db connection

// TODO: Delete a user.

// get our db methods
const db = require ("./db");

// handler for all relevant requests
async function handler(req, res) {
  switch (req.method) {
    // GET
    // this route accepts a query string that contains username
    case "GET": {
      
      // await the found user
      const user = await db.getUser(req.query.username);

      // everything ok, return user as json
      res.status(200).json(user);
      break;
    }
    // POST
    // this route accepts HTTP body containing json for a user to be added to DB
    case "POST": {
      // await the user to be added, and returned
      const user = await db.addUser(req.body);

      // everything ok, return user as json
      res.status(200).json(user);
      break;
    }
    // DELETE
    // TODO: this route will delete a user from the database
    case "DELETE":
      // ./users.js
      // db.deleteUser();
    default:

    // any other route that is attempted should be denied.
      res.json(401).json({error: "Request denied."});
      break;
  }
}

export default handler;
