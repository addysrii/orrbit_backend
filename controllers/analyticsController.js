import CampaignMetric from "../models/CampaignMetric.js";
import Campaign from "../models/Campaign.js";
import CampaignApplication from "../models/CampaignApplication.js";
import mongoose from "mongoose";
/*
 * campaignSummary - returns aggregated summary for a campaign
 */
export const campaignSummary = async (req, res) => {
  try {
    const { campaignId } = req.params;

    // 1) aggregate metrics totals
    const metricsAgg = await CampaignMetric.aggregate([
      { $match: { campaign: new mongoose.Types.ObjectId(campaignId) } },
      {
        $group: {
          _id: "$campaign",
          impressions: { $sum: "$impressions" },
          clicks: { $sum: "$clicks" },
          likes: { $sum: "$likes" },
          comments: { $sum: "$comments" },
          shares: { $sum: "$shares" },
          posts: { $sum: 1 },
        },
      },
    ]);

    const metrics = metricsAgg[0] || { impressions: 0, clicks: 0, likes: 0, comments: 0, shares: 0, posts: 0 };

    // 2) top performing influencers by impressions
    const topInfluencers = await CampaignMetric.aggregate([
      { $match: { campaign: new mongoose.Types.ObjectId(campaignId) } },
      {
        $group: {
          _id: "$influencer",
          impressions: { $sum: "$impressions" },
          likes: { $sum: "$likes" },
          comments: { $sum: "$comments" },
        },
      },
      { $sort: { impressions: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "influencers",
          localField: "_id",
          foreignField: "_id",
          as: "influencer",
        },
      },
      { $unwind: "$influencer" },
      { $project: { influencer: { name: "$influencer.name", linkedinProfile: "$influencer.linkedInProfile" }, impressions: 1, likes: 1, comments: 1 } },
    ]);

    // 3) application stats
    const applicationsCount = await CampaignApplication.countDocuments({ campaign: campaignId });

    res.json({ metrics, topInfluencers, applicationsCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
