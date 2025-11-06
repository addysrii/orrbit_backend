import CampaignApplication from "../models/CampaignApplication.js";
import Campaign from "../models/Campaign.js";
import Influencer from "../models/Influencer.js";
import mongoose from "mongoose";
export const applyToCampaign = async (req, res) => {
  try {
    const influencerId = req.user.id;
    const { campaignId } = req.params;
    const { bidAmount, message } = req.body;

    const exists = await CampaignApplication.findOne({ campaign: campaignId, influencer: influencerId });
    if (exists) return res.status(400).json({ message: "Already applied" });

    const application = await CampaignApplication.create({
      campaign: campaignId,
      influencer: influencerId,
      bidAmount,
      message,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listApplicationsForCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const applications = await CampaignApplication.find({ campaign: campaignId }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body; // shortlisted, accepted, rejected
    const app = await CampaignApplication.findByIdAndUpdate(applicationId, { status }, { new: true });
    res.json(app);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
