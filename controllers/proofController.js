import Proof from "../models/Proof.js";
import CampaignMetric from "../models/CampaignMetric.js";
import Escrow from "../models/Escrow.js";

/**
 * submitProof - influencer uploads screenshot & postUrl
 */
export const submitProof = async (req, res) => {
  try {
    const influencerId = req.user.id;
    const { campaignId } = req.params;
    // assume multer put file path in req.file.path or S3 URL in req.body.screenshotPath
    const screenshotPath = req.file?.path || req.body.screenshotPath;

    const proof = await Proof.create({
      campaign: campaignId,
      influencer: influencerId,
      postUrl: req.body.postUrl,
      screenshotPath,
    });

    // Optionally trigger an asynchronous verification job here

    res.status(201).json(proof);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * verifyProof - Ops or automated job sets verified true and optionally releases escrow
 */
export const verifyProof = async (req, res) => {
  try {
    const { proofId } = req.params;
    const { verified, verifierNotes } = req.body;
    const proof = await Proof.findByIdAndUpdate(proofId, { verified, verifierNotes }, { new: true });

    if (verified) {
      // Optionally create a metric entry (if we can scrape/post metrics) or schedule metric fetch
      // Example: release escrow for this influencer (milestone)
      // here we find relevant escrow entries and mark for release flow
    }

    res.json(proof);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getProofs = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const proofs = await Proof.find({ campaign: campaignId }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProof = async (req, res) => {
  try {
    const { proofId } = req.params;
    const proof = await Proof.findById(proofId).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proof);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProofsForCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const proofs = await Proof.find({ campaign: campaignId }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProofsForInfluencer = async (req, res) => {
  try {
    const { influencerId } = req.params;
    const proofs = await Proof.find({ influencer: influencerId }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProofsForCampaignAndInfluencer = async (req, res) => {
  try {
    const { campaignId, influencerId } = req.params;
    const proofs = await Proof.find({ campaign: campaignId, influencer: influencerId }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProofsForCampaignAndStatus = async (req, res) => {
  try {
    const { campaignId, status } = req.params;
    const proofs = await Proof.find({ campaign: campaignId, status }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProofsForInfluencerAndStatus = async (req, res) => {
  try {
    const { influencerId, status } = req.params;
    const proofs = await Proof.find({ influencer: influencerId, status }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProofsForCampaignAndInfluencerAndStatus = async (req, res) => {
  try {
    const { campaignId, influencerId, status } = req.params;
    const proofs = await Proof.find({ campaign: campaignId, influencer: influencerId, status }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProofsForCampaignAndStatusAndVerified = async (req, res) => {
  try {
    const { campaignId, status, verified } = req.params;
    const proofs = await Proof.find({ campaign: campaignId, status, verified }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProofsForInfluencerAndStatusAndVerified = async (req, res) => {
  try {
    const { influencerId, status, verified } = req.params;
    const proofs = await Proof.find({ influencer: influencerId, status, verified }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProofsForCampaignAndInfluencerAndStatusAndVerified = async (req, res) => {
  try {
    const { campaignId, influencerId, status, verified } = req.params;
    const proofs = await Proof.find({ campaign: campaignId, influencer: influencerId, status, verified }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProofsForCampaignAndStatusAndVerifiedAndInfluencer = async (req, res) => {
  try {
    const { campaignId, status, verified, influencerId } = req.params;
    const proofs = await Proof.find({ campaign: campaignId, status, verified, influencer: influencerId }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProofsForInfluencerAndStatusAndVerifiedAndCampaign = async (req, res) => {
  try {
    const { influencerId, status, verified, campaignId } = req.params;
    const proofs = await Proof.find({ influencer: influencerId, status, verified, campaign: campaignId }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
