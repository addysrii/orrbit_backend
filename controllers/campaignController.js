import Campaign from "../models/Campaign.js";
import mongoose from "mongoose";
export const createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCampaigns = async (req, res) => {
  const campaigns = await Campaign.find().populate("brand").populate("influencers");
  res.json(campaigns);
};
