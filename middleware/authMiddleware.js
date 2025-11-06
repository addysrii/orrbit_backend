import jwt from "jsonwebtoken";
import Brand from "../models/Brand.js";
import Influencer from "../models/Influencer.js";

export const authMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const auth = req.headers.authorization;
      if (!auth) return res.status(401).json({ message: "No token" });
      const token = auth.split(" ")[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      // attach user object minimal
      if (payload.role === "brand") {
        req.user = { id: payload.id, role: "brand" };
      } else if (payload.role === "influencer") {
        req.user = { id: payload.id, role: "influencer" };
      } else if (payload.role === "ops") {
        req.user = { id: payload.id, role: "ops" };
      }

      // simple role check
      if (requiredRole && requiredRole !== req.user.role) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
