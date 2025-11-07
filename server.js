import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; 
import brandLinkedInPassport from "./config/brandLinkedInPassport.js";
import brandLinkedInRoutes from "./routes/brandLinkedInRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import influencerRoutes from "./routes/influencerRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "yourSecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRoutes);
app.use("/api/brandLinkedIn",  brandLinkedInRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/influencers", influencerRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
