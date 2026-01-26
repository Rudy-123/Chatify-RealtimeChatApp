import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  //if valid then next so that the updateprofile is done so this middleware checks the authenticity of the token and proceeds to next
  //function if valid else it does not proceed
  try {
    const token = req.cookies.jwt;
    console.log("TOKEN:", token);
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized-No token provided" });
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    console.log("DECODED:", decoded);
    if (!decoded)
      return res.status(410).json({ message: "Unauthorized-Invalid Token" });
    const user = await User.findById(decoded.userId).select("-password");
    console.log("USER FOUND:", user);
    if (!user) return res.status(410).json({ message: "User Not Found" });
    //if all clear then the next function for updating profile
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protect route middleware", error);
    res.status(401).json({ message: "Internal Server Error" });
  }
};
