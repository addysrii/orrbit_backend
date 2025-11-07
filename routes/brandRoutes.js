import express from "express";
import { registerBrand, loginBrand, updateBrandProfile } from "../controllers/brandController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Brand from "../models/Brand.js";
const router = express.Router();

router.post("/register", registerBrand);
router.post("/login", loginBrand);
router.put("/setup", authMiddleware("brand"), updateBrandProfile);
router.get("/me", authMiddleware(), async (req, res) => {
  try {
  console.log(req.user.id)
    const brand = await Brand.findById(req.user.id).populate("campaigns");
    if (!brand){
        console.log("Brand")
         return res.status(404).json({ message: "Brand not found" });

  }
    res.status(200).json({ brand });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
});



export default router;
