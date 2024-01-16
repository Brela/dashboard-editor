import sdk from "node-appwrite";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT,
  APPWRITE_API_KEY,
} from "./envConfig.js";

const client = new sdk.Client();

client
  .setEndpoint(APPWRITE_ENDPOINT) // Your Appwrite endpoint
  .setProject(APPWRITE_PROJECT) // Your Appwrite project ID
  .setKey(APPWRITE_API_KEY); // Your Appwrite API key

// no need for account - according to docs

export default client;
