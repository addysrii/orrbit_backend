import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  industry: String,
  budgetRange: String,
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }],
});

export default mongoose.model("Brand", brandSchema);
