import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export default async (req, res, next) => {
  // Try to get token from multiple header formats
  let token = req.header("x-auth-token");

  // If x-auth-token not found, try Authorization header
  if (!token) {
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove "Bearer " prefix
    }
  }

  console.log("Auth middleware - Token found:", !!token);
  console.log("Auth middleware - Headers:", {
    "x-auth-token": req.header("x-auth-token") ? "present" : "missing",
    Authorization: req.header("Authorization") ? "present" : "missing",
  });

  if (!token) {
    console.log("Auth middleware - No token provided");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    );

    // Check if the user is an admin
    const admin = await Admin.findOne({ email: decoded.email });
    if (admin) {
      req.user = {
        email: admin.email,
        isAdmin: true,
        _id: admin._id,
      };
    } else {
      // For now, we only support admin users
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
