import sdk, { Client, Users, Account } from "node-appwrite";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT,
  APPWRITE_API_KEY,
} from "../config/envConfig.js";

export const validateSession = async (req, res, next) => {
  // somehow validate the session token and attach the user to req

  try {
    // --------

    console.log("params: ", req?.params);
    const token = req?.headers.authorization?.split(" ")[1]; // Extract the token
    if (!token) {
      return res.status(401).send("No token provided");
    }
    console.log("token: ", token);

    // docs reccomend to discard client with each request - docs: https://appwrite.io/docs/products/auth/jwt
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT)
      .setJWT(token);

    console.log("client: ", client);

    const account = new Account(client);

    // Fetch the user details using the Account service
    const userDetails = await account.get();

    console.log("userDetails: ", userDetails);

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

/* const users = new Users(client);

    users
      .list()
      .then((response) => {
        console.log("users: ", response); // Response is an object with the users list
      })
      .catch((err) => {
        console.error(err);
      });
 */
// ---------
