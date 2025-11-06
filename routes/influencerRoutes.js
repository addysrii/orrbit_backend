import express from "express";
import { registerInfluencer, getInfluencers,updateInfluencer } from "../controllers/influencerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerInfluencer);
router.get("/", getInfluencers);
router.get("/:id", getInfluencers);
router.get("/search", getInfluencers);
router.get("/search/:query", getInfluencers);
router.put("/:id", authMiddleware("influencer"), updateInfluencer);

export default router;
