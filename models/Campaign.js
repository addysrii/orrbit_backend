import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  title: { type: String, required: true },
  description: String,
  budget: Number,
  status: { type: String, enum: ["draft", "approved", "live", "completed"], default: "draft" },
  influencers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Influencer" }],
  startDate: Date,
  endDate: Date,
});

export default mongoose.model("Campaign", campaignSchema);
