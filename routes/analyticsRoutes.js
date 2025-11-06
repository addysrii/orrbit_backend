// routes/authRoutes.js
import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/linkedin", passport.authenticate("linkedin"));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/influencer/dashboard");
  }
);

export default router;
