import mongoose from "mongoose";

const proofSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  influencer: { type: mongoose.Schema.Types.ObjectId, ref: "Influencer", required: true },
  postUrl: String,
  screenshotPath: String, // multer uploaded path or S3 URL
  submittedAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  verifierNotes: String,
});

export default mongoose.models.Proof || mongoose.model("Proof", proofSchema);
