import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Start LinkedIn login
router.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", { state: true, scope: ["openid", "profile", "email"] })
);

// Callback route
router.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/api/auth/error" }),
  (req, res) => {
    const user = req.user;

    // Create JWT for later API use
    const token = jwt.sign(
      { id: user._id, role: "influencer" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect to frontend profile setup page with userId & token in params
    res.redirect(`${FRONTEND_URL}/profile-setup/${user._id}?token=${token}`);
  }
);



// Error route
router.get("/auth/error", (req, res) => {
  res.status(401).json({ message: "Authentication failed" });
});

export default router;
