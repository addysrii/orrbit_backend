import Brand from "../models/Brand.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
export const registerBrand = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const brandExists = await Brand.findOne({ email });
    if (brandExists) return res.status(400).json({ message: "Brand already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const brand = await Brand.create({ name, email, password: hashed });

    res.status(201).json({ message: "Brand registered successfully", brand });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginBrand = async (req, res) => {
  try {
    const { email, password } = req.body;
    const brand = await Brand.findOne({ email });
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    const match = await bcrypt.compare(password, brand.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: brand._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, brand });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
