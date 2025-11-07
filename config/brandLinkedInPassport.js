import passport from "passport";
import OAuth2Strategy from "passport-oauth2";
import { jwtDecode } from "jwt-decode";
import dotenv from "dotenv";
import Brand from "../models/Brand.js";

dotenv.config();

const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, BRAND_LINKEDIN_CALLBACK_URL } = process.env;

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const brand = await Brand.findById(id);
    done(null, brand);
  } catch (err) {
    done(err, null);
  }
});

if (LINKEDIN_CLIENT_ID && LINKEDIN_CLIENT_SECRET) {
  passport.use(
    "linkedin-brand",
    new OAuth2Strategy(
      {
        authorizationURL: "https://www.linkedin.com/oauth/v2/authorization",
        tokenURL: "https://www.linkedin.com/oauth/v2/accessToken",
        clientID: LINKEDIN_CLIENT_ID,
        clientSecret: LINKEDIN_CLIENT_SECRET,
        callbackURL: BRAND_LINKEDIN_CALLBACK_URL,
        scope: ["openid", "profile", "email"],
        state: true,
      },
      async (accessToken, refreshToken, params, profile, done) => {
        try {
          const idToken = params.id_token;
          if (!idToken) throw new Error("No ID token returned by LinkedIn");

          const decoded = jwtDecode(idToken);
          console.log("🪪 Decoded LinkedIn Brand Token:", decoded);

          const linkedinId = decoded.sub;
          const name = decoded.name || `${decoded.given_name || ""} ${decoded.family_name || ""}`.trim();
          const email = decoded.email || decoded.email_address || "";
          const profileImage = decoded.picture || decoded.picture_url || "";

          if (!linkedinId && !email) {
            throw new Error("No unique LinkedIn ID or email found");
          }

          // ✅ Always try to match existing brand safely
          let brand = null;

          if (email) {
            brand = await Brand.findOne({ email });
          }

          // Fallback: find by LinkedIn ID if email is missing
          if (!brand && linkedinId) {
            brand = await Brand.findOne({ linkedinId });
          }

          // If still not found, create a new brand
          if (!brand) {
            brand = await Brand.create({
              linkedinId,
              name,
              email,
              logo: profileImage,
              linkedinProfileUrl: decoded.profile || "",
            });
            console.log("🆕 Created new brand:", brand._id);
          } else {
            // Update existing info
            brand.linkedinId = linkedinId || brand.linkedinId;
            brand.name = name || brand.name;
            brand.logo = profileImage || brand.logo;
            await brand.save();
            console.log("♻️ Updated existing brand:", brand._id);
          }

          return done(null, brand);
        } catch (err) {
          console.error("❌ LinkedIn Brand Login Error:", err.message);
          return done(err);
        }
      }
    )
  );

  console.log("✅ LinkedIn OpenID Strategy Active for Brands");
} else {
  console.warn("⚠️ Missing LinkedIn credentials for Brand Login");
}

export default passport;
