import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../Controllers/auth.controller.js";
import { protectRoute } from "../Middleware/auth.middleware.js";
import { arcjetProtection } from "../Middleware/arcjet.middleware.js";

const router = express.Router();
//router.use(arcjetProtection); //if this passes the req mins per test(rate) and does not get limited then only eveything else can be done
//POST because we have to create profile on the server and for updating an existing id put request
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, arcjetProtection, updateProfile); //if user is authenticated then only next function for updating user's profile
router.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user),
);
export default router;
