import client from "../config/appwriteConfig.js";
import { Users } from "node-appwrite";

export const validateSession = async (req, res, next) => {
  try {
    // --------

    const users = new Users(client);

    users
      .list()
      .then((response) => {
        console.log("users: ", response); // Response is an object with the users list
      })
      .catch((err) => {
        console.error(err);
      });

    // ---------

    let session = true;
    if (session) {
      // User is logged in, add user information to the request object
      req.user = {
        userId: session.userId, // The user ID of the logged-in user
        // Include other user details as needed
      };
      next();
    } else {
      // No valid session, user is not logged in
      res.status(401).send("Unauthorized: Invalid session token");
    }
  } catch (error) {
    console.error(error);
    res.status(401).send("Unauthorized: Error validating session token");
  }
};
