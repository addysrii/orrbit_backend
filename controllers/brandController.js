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


export const updateBrandProfile = async (req, res) => {
  try {
    const brandId = req.user?.id; // from authMiddleware
    if (!brandId) return res.status(401).json({ message: "Unauthorized" });

    const {
      name,
      email,
      website,
      industry,
      description,
      budgetRange,
      marketingGoals,
      targetAudience,
      preferredInfluencerNiches,
      preferredPlatform,
    } = req.body;

    const brand = await Brand.findById(brandId);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    // Update fields dynamically
    brand.name = name || brand.name;
    brand.email = email || brand.email;
    brand.website = website || brand.website;
    brand.industry = industry || brand.industry;
    brand.description = description || brand.description;
    brand.budgetRange = budgetRange || brand.budgetRange;
    brand.marketingGoals = marketingGoals || brand.marketingGoals;
    brand.targetAudience = targetAudience || brand.targetAudience;
    brand.preferredInfluencerNiches = preferredInfluencerNiches || brand.preferredInfluencerNiches;
    brand.preferredPlatform = preferredPlatform || brand.preferredPlatform;

    await brand.save();

    res.status(200).json({
      message: "Brand profile updated successfully",
      brand,
    });
  } catch (error) {
    console.error("Profile Update Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
