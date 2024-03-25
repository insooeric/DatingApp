import path from "path";
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
// import testRoutes from "./routes/testingRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/locations", locationRoutes);
// app.use("/api/test", testRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
