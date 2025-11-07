import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Brand from "../models/Brand.js";
dotenv.config();

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// 🔗 Step 1: Redirect to LinkedIn
router.get(
  "/auth/linkedin/brand",
  passport.authenticate("linkedin-brand", { state: true, scope: ["openid", "profile", "email"] })
);

// 🔙 Step 2: LinkedIn Callback
router.get(
  "/auth/linkedin/brand/callback",
  passport.authenticate("linkedin-brand", { failureRedirect: "/api/auth/error" }),
  async (req, res) => {
    try {
      const brand = await Brand.findById(req.user._id);
      if (!brand) throw new Error("Brand not found after LinkedIn login");

      const token = jwt.sign(
        { id: brand._id.toString(), role: "brand" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      console.log("🎟️ Token issued for brand:", brand._id);
      res.redirect(`${FRONTEND_URL}/brand-setup/${brand._id}?token=${token}`);
    } catch (err) {
      console.error("LinkedIn callback error:", err.message);
      res.redirect(`${FRONTEND_URL}/login?error=linkedin`);
    }
  }
);



// ❌ Authentication Error
router.get("/auth/error", (req, res) => {
  res.status(401).json({ message: "Brand authentication failed" });
});

export default router;
