import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CORS_ORIGINS, PORT } from "./config/envConfig.js";
import userRoutes from "./modules/users/routes.js";
import authenticationRoutes from "./modules/auth/routes.js";
import dashboardRoutes from "./modules/dashboards/routes.js";

const app = express();

const allowedOrigins = CORS_ORIGINS.split(",");

const corsOptions = {
  // allowed all origins to test mobile no ckkies/login bug - didn't work
  /*    origin: function (origin, callback) {
    callback(null, true); // Allow all origins
  }, */
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});

app.use(cookieParser());

app.use("/authentication", authenticationRoutes);
app.use("/dashboards", dashboardRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
