import express from "express";
import { createCampaign, approveCampaign, fundCampaign, searchInfluencersForCampaign } from "../controllers/campaignLifecycleController.js";
import { applyToCampaign, listApplicationsForCampaign, updateApplicationStatus } from "../controllers/applicationController.js";
import { submitProof, verifyProof } from "../controllers/proofController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getCampaigns } from "../controllers/campaignController.js";

const router = express.Router();

router.post("/", authMiddleware(), createCampaign); 
router.post("/:campaignId/approve", authMiddleware("ops"), approveCampaign); 
router.post("/:campaignId/fund", authMiddleware("brand"), fundCampaign);
router.get("/:campaignId/influencers", authMiddleware("brand"), searchInfluencersForCampaign);
router.get("/",getCampaigns)
// application flows (influencer)
router.post("/:campaignId/apply", authMiddleware("influencer"), applyToCampaign);
router.get("/:campaignId/applications", authMiddleware("brand"), listApplicationsForCampaign);
router.patch("/applications/:applicationId", authMiddleware("brand"), updateApplicationStatus);

// proofs
router.post("/:campaignId/proof", authMiddleware("influencer"), submitProof); 
router.patch("/proofs/:proofId/verify", authMiddleware("ops"), verifyProof);

export default router;
