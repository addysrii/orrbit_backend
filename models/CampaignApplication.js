import mongoose from "mongoose";

const campaignApplicationSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  influencer: { type: mongoose.Schema.Types.ObjectId, ref: "Influencer", required: true },
  bidAmount: Number,
  message: String,
  status: { type: String, enum: ["applied", "shortlisted", "rejected", "accepted", "cancelled"], default: "applied" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CampaignApplication || mongoose.model("CampaignApplication", campaignApplicationSchema);
