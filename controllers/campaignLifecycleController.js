import Campaign from "../models/Campaign.js";
import CampaignApplication from "../models/CampaignApplication.js";
import Influencer from "../models/Influencer.js";
import Escrow from "../models/Escrow.js";

/**
 * createCampaign
 * Brand creates campaign (starts as draft). Return campaign object.
 */
export const createCampaign = async (req, res) => {
  try {
    const brandId = req.user?.id; // assume auth middleware set req.user
    const payload = { ...req.body, brand: brandId };
    const campaign = await Campaign.create(payload);
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * approveCampaign
 * Ops or automated checks mark campaign as approved.
 */
export const approveCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await Campaign.findByIdAndUpdate(campaignId, { status: "approved" }, { new: true });
    res.json(campaign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * fundCampaign -> create escrow record (and call PSP to actually hold funds)
 * This is where you'd call Stripe / Razorpay to create a PaymentIntent or hold funds.
 */
export const fundCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { amount, pspPaymentId } = req.body; // pspPaymentId returned by PSP after charge
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    // create escrow entry
    const escrow = await Escrow.create({
      campaign: campaign._id,
      brand: campaign.brand,
      amount,
      pspPaymentId,
      status: "held",
    });

    // mark campaign as live only after hold
    campaign.status = "live";
    await campaign.save();

    res.json({ campaign, escrow });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * searchInfluencers (gated)
 * Only allow search when campaign is live AND escrow exists.
 */
export const searchInfluencersForCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { q, niche, region, minFollowers, campaignType } = req.query;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.status !== "live") return res.status(403).json({ message: "Campaign not live" });

    // check escrow
    const escrow = await Escrow.findOne({ campaign: campaignId, status: "held" });
    if (!escrow) return res.status(403).json({ message: "Please fund campaign to access influencers" });

    // basic filter - extend with text search & scoring
    const filter = {};
    if (niche) filter.categories = niche;
    if (region) filter.region = region;
    if (minFollowers) filter.followers = { $gte: Number(minFollowers) };
    if (q) filter.name = { $regex: q, $options: "i" };

    const influencers = await Influencer.find(filter).limit(50);
    res.json({ influencers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * applyToCampaign
 * Influencer applies to campaign. Return campaignApplication object.
 */
export const applyToCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { influencerId } = req.body;
    const campaignApplication = await CampaignApplication.create({ campaign: campaignId, influencer: influencerId });
    res.status(201).json(campaignApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listApplicationsForCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaignApplications = await CampaignApplication.find({ campaign: campaignId }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(campaignApplications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body; // shortlisted, accepted, rejected
    const campaignApplication = await CampaignApplication.findByIdAndUpdate(applicationId, { status }, { new: true });
    res.json(campaignApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const campaignApplication = await CampaignApplication.findById(applicationId).populate("influencer", "name followers categories score linkedinProfile");
    res.json(campaignApplication);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const campaignApplication = await CampaignApplication.findByIdAndDelete(applicationId);
    res.json(campaignApplication);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 
