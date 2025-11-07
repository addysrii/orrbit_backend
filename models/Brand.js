import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  linkedinId: { type: String, unique: true, sparse: true },
  logo: { type: String },
  website: { type: String },
  industry: { type: String },
  description: { type: String },
  budgetRange: { type: String },
  marketingGoals: [String],
  targetAudience: {
    location: String,
    industry: String,
    jobTitles: String,
    ageGroup: String,
    interests: String,
  },
  preferredInfluencerNiches: String,
  preferredPlatform: String,
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }],
});

export default mongoose.model("Brand", brandSchema);
