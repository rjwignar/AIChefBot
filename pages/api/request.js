// api for db connection

// TODO: Delete a user.

// get our db methods
const db = require("./db");

// handler for all relevant requests
async function handler(req, res) {
  switch (req.method) {
    // GET
    // this route accepts a query string that contains username
    case "GET": {
      try {
        // await the found user
        const user = await db.getUser(req.query.username);
        if (user) {
          // everything ok, return user as json
          res.status(200).json(user);
        } else {
          res.status(404).json({message: "User was not found."});
        }
      } catch (err) {
        console.debug(err);
        res.status(500);
      } finally {
        break;
      }
    }
    // POST
    case "POST": {
      try {
        // await the user to be added, and returned
        const user = await db.addUser(req.body);
        if (user) {
          // everything ok, return user as json
          res.status(200).json(user);
        } else {
          res.status(404).json({message: "User was not found."});
        }
      } catch (err) {
        console.debug(err);
        res.status(500);
      } finally {
        break;
      }
    }
    // UPDATE
    case "PUT":
      try {
        // await the user to be updated, and returned
        const user = await db.updateUser(req.body);
        if (user) {
          // everything ok, return user as json
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User was not found." });
        }
      } catch (err) {
        console.debug(err);
        res.status(500);
      } finally {
        break;
      }
    // DELETE
    case "DELETE":
      try {
        // TEST
        if (req.body == "TESTUSER") {
          res.status(500).json({message: "This user cannot be accessed."});
          break;
        }
        // await user deletion, acquire boolean result
        const result = await db.removeUser(req.body);
        if (result) {
          // everything ok, return success message
          res.status(200).json({ message: "User was deleted successfully." });
        } else {
          res.status(404).json({ message: "User was not found." });
        }
      } catch (err) {
        console.debug(err);
        res.status(500);
      } finally {
        break;
      }
    default:
      // any other route that is attempted should be denied.
      res.json(401).json({ error: "Request denied." });
      break;
  }
}

export default handler;
