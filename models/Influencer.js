import mongoose from "mongoose";

const influencerSchema = new mongoose.Schema({
  linkedinId: { type: String, unique: true, sparse: true }, // 👈 Add this to identify LinkedIn users
  name: String,
  email: { type: String, required: false, unique: true, sparse: true }, // 👈 Make it optional & sparse
  profileImage: String, 
  linkedInProfile: String,
  followers: Number,
  engagementRate: Number,
  categories: [String],
  score: { type: Number, default: 0 },
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }],
});

export default mongoose.model("Influencer", influencerSchema);
