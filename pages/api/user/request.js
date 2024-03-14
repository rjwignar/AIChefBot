
// define responses issued to fetch requests made for USERS

// get our db methods
import { getUserById, addUser, updateUser, removeUser } from "./user";

// handler for all relevant requests
async function handler(req, res) {
  switch (req.method) {
    // GET
    // this route accepts a query string that contains session.user.id (cognito id)
    case "GET": {
      try {
        // await the found user
        const user = await getUserById(req.query.id);
        if (user) {
          // everything ok, return user as json
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User was not found." });
        }
      } catch (err) {
        console.debug(err);
        res.status(500);
      }
      break;
    }
    // POST
    case "POST": {
      try {
        // await the user to be added, and returned
        const result = await addUser(req.body);
        res.status(200).json(result);
      } catch (err) {
        console.debug(err);
        res.status(500);
      }
      break;
    }
    // UPDATE
    case "PUT":
      try {
        // await the user to be updated, and returned
        const user = await updateUser(req.body);
        if (user) {
          // everything ok, return user as json
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User was not found." });
        }
      } catch (err) {
        console.debug(err);
        res.status(500);
      }
      break;
    // DELETE
    case "DELETE":
      try {
        await removeUser(req.body);
      } catch (err) {
        console.log("Error in request.js, ", err);
      }
      break;
    default:
      // any other route that is attempted should be denied.
      res.json(401).json({ error: "Request denied." });
      break;
  }
}

export default handler;
