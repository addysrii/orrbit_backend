import Influencer from "../models/Influencer.js";
import Proof from "../models/Proof.js";
export const registerInfluencer = async (req, res) => {
  try {
    const influencer = await Influencer.create(req.body);
    res.status(201).json(influencer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getInfluencers = async (req, res) => {
  const influencers = await Influencer.find();
  res.json(influencers);
};

export const getInfluencer = async (req, res) => {
  try {
    const { influencerId } = req.params;
    const influencer = await Influencer.findById(influencerId);
    res.json(influencer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateInfluencer = async (req, res) => {
  try {
    const { influencerId } = req.params;
    const influencer = await Influencer.findByIdAndUpdate(influencerId, req.body, { new: true });
    res.json(influencer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteInfluencer = async (req, res) => {
  try {
    const { influencerId } = req.params;
    const influencer = await Influencer.findByIdAndDelete(influencerId);
    res.json(influencer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInfluencerProofs = async (req, res) => {
  try {
    const { influencerId } = req.params;
    const proofs = await Proof.find({ influencer: influencerId }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateInfluencerProfile = async (req, res) => {
  try {
    const { influencerId } = req.params;
  const data = req.body;
  console.log(data)
    const influencer = await Influencer.findByIdAndUpdate(influencerId, req.body, { new: true });
    res.json(influencer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getInfluencerProfile = async (req, res) => {
  try {
    const { influencerId } = req.params;
    const influencer = await Influencer.findById(influencerId);
    res.json(influencer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getInfluencerProofsForStatus = async (req, res) => {
  try {
    const { influencerId, status } = req.params;
    const proofs = await Proof.find({ influencer: influencerId, status }).populate("influencer", "name followers categories score linkedinProfile");
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};