import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CORS_ORIGIN, PORT } from "./config/envConfig.js";
import inventoryRoutes from "./modules/inventory/routes.js";
import ordersRoutes from "./modules/orders/routes.js";
import userRoutes from "./modules/users/routes.js";
import authenticationRoutes from "./modules/auth/routes.js";
import dashboardRoutes from "./modules/auth/routes.js";
import customWidgetRoutes from "./modules/customWidgets/routes.js";

const app = express();

const corsOptions = {
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
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
app.use("/user", userRoutes);

app.use("/dashboards", dashboardRoutes);
app.use("/customWidgets", customWidgetRoutes);

app.use("/inventory", inventoryRoutes);
app.use("/orders", ordersRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
