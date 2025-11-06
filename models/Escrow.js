import mongoose from "mongoose";

const escrowSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
  influencer: { type: mongoose.Schema.Types.ObjectId, ref: "Influencer" },
  amount: Number,
  currency: { type: String, default: "INR" },
  status: { type: String, enum: ["held", "released", "refunded"], default: "held" },
  pspPaymentId: String, // payment provider transaction id
  createdAt: { type: Date, default: Date.now },
  releasedAt: Date,
});

export default mongoose.models.Escrow || mongoose.model("Escrow", escrowSchema);
