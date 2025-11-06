import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
  influencer: { type: mongoose.Schema.Types.ObjectId, ref: "Influencer" },
  amount: Number,
  status: { type: String, enum: ["pending", "released"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);
