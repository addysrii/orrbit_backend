import express from "express";
import { makePayment, getPayments } from "../controllers/paymentController.js";
const router = express.Router();

router.post("/", makePayment);
router.get("/", getPayments);

export default router;
