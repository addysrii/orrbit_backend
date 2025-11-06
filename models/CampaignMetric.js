import mongoose from "mongoose";

const campaignMetricSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  influencer: { type: mongoose.Schema.Types.ObjectId, ref: "Influencer", required: true },
  postUrl: String,
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CampaignMetric || mongoose.model("CampaignMetric", campaignMetricSchema);
