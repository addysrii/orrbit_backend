import express from "express";
import { createCampaign, approveCampaign, fundCampaign, searchInfluencersForCampaign } from "../controllers/campaignLifecycleController.js";
import { applyToCampaign, listApplicationsForCampaign, updateApplicationStatus } from "../controllers/applicationController.js";
import { submitProof, verifyProof } from "../controllers/proofController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // placeholder

const router = express.Router();

// campaign lifecycle
router.post("/", authMiddleware("brand"), createCampaign); // brand creates
router.post("/:campaignId/approve", authMiddleware("ops"), approveCampaign); // ops approves
router.post("/:campaignId/fund", authMiddleware("brand"), fundCampaign); // brand funds (psp integration)
router.get("/:campaignId/influencers", authMiddleware("brand"), searchInfluencersForCampaign); // gated search

// application flows (influencer)
router.post("/:campaignId/apply", authMiddleware("influencer"), applyToCampaign);
router.get("/:campaignId/applications", authMiddleware("brand"), listApplicationsForCampaign);
router.patch("/applications/:applicationId", authMiddleware("brand"), updateApplicationStatus);

// proofs
router.post("/:campaignId/proof", authMiddleware("influencer"), submitProof); // multer middleware to accept file
router.patch("/proofs/:proofId/verify", authMiddleware("ops"), verifyProof);

export default router;
