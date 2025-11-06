import express from "express";
import { registerBrand, loginBrand } from "../controllers/brandController.js";

const router = express.Router();

router.post("/register", registerBrand);
router.post("/login", loginBrand);

export default router;
