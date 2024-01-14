import { Client, Account } from "appwrite";
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT = import.meta.env.VITE_APPWRITE_PROJECT;

console.log("APPWRITE_ENDPOINT", APPWRITE_ENDPOINT);
console.log("APPWRITE_PROJECT", APPWRITE_PROJECT);

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT);

export const account = new Account(client);

export default client;
