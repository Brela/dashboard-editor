import dotenv from "dotenv";

dotenv.config();

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const CORS_ORIGINS = process.env.CORS_ORIGINS;
export const PORT = process.env.PORT;
export const IS_DEV_MODE = process.env.IS_DEV_MODE;
export const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
export const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT;
export const APPWRITE_PROJECT = process.env.APPWRITE_PROJECT;
