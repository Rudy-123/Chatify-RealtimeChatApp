import express from "express";
import authRoutes from "./Routes/auth.route.js";
import messageRoutes from "./Routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import path from "path";
import cookieParser from "cookie-parser";

const app = express();

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

app.use(express.json()); //Middleware to get all the response that is made from the frontend under the signup route with all conditions
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  //Any route other then mentioned and declared under the routes folder wouold be directed towards the frontend
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  connectDB();
});
