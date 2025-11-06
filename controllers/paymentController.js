import Payment from "../models/Payment.js";
import Escrow from "../models/Escrow.js";
export const makePayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPayments = async (req, res) => {
  const payments = await Payment.find().populate("campaign brand influencer");
  res.json(payments);
};
export const releaseEscrow = async (req, res) => {
  try {
    const { escrowId } = req.params;
    // call PSP: stripe.transfers.create(...) or Razorpay payout
    // For now, mark released:
    const escrow = await Escrow.findByIdAndUpdate(escrowId, { status: "released", releasedAt: new Date() }, { new: true });
    res.json(escrow);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * refundEscrow - refund brand if campaign fails
 */
export const refundEscrow = async (req, res) => {
  try {
    const { escrowId } = req.params;
    // call PSP to refund
    const escrow = await Escrow.findByIdAndUpdate(escrowId, { status: "refunded" }, { new: true });
    res.json(escrow);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};