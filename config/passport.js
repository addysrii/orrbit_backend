import passport from "passport";
import OAuth2Strategy from "passport-oauth2";
import { jwtDecode } from "jwt-decode";
import dotenv from "dotenv";
import Influencer from "../models/Influencer.js";

dotenv.config();

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_CALLBACK_URL = process.env.LINKEDIN_CALLBACK_URL;

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Influencer.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

if (LINKEDIN_CLIENT_ID && LINKEDIN_CLIENT_SECRET) {
  passport.use(
    "linkedin",
    new OAuth2Strategy(
      {
        authorizationURL: "https://www.linkedin.com/oauth/v2/authorization",
        tokenURL: "https://www.linkedin.com/oauth/v2/accessToken",
        clientID: LINKEDIN_CLIENT_ID,
        clientSecret: LINKEDIN_CLIENT_SECRET,
        callbackURL: LINKEDIN_CALLBACK_URL,
        scope: ["openid", "profile", "email"],
        state: true,
      },
      async (accessToken, refreshToken, params, profile, done) => {
        try {
          const idToken = params.id_token;
          if (!idToken) throw new Error("No ID token returned by LinkedIn");

          const decoded = jwtDecode(idToken);
          console.log("🪪 Decoded LinkedIn ID Token:", decoded);

          const linkedinId = decoded.sub;
          const name = decoded.name || `${decoded.given_name || ""} ${decoded.family_name || ""}`.trim();
          const email = decoded.email || decoded.email_verified || "";
          const profileImage = decoded.picture || "";

          // 🔍 Find or create influencer
          let user = await Influencer.findOne({ $or: [{ linkedinId }, { email }] });
          if (!user) {
            user = await Influencer.create({
              linkedinId,
              name,
              email,
              profileImage,
            });
          } else {
            user.name = name || user.name;
            user.profileImage = profileImage || user.profileImage;
            await user.save();
          }

          console.log("✅ LinkedIn user saved:", { linkedinId, name, email, profileImage });
          return done(null, user);
        } catch (err) {
          console.error("❌ LinkedIn OpenID error:", err.message);
          return done(err);
        }
      }
    )
  );

  console.log("✅ LinkedIn OpenID Connect strategy active");
} else {
  console.warn("⚠️ Missing LinkedIn credentials in environment variables");
}

export default passport;
