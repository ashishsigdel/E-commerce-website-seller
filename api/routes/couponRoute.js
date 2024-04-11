import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
} from "../controllers/couponController.js";
import { verifyAdmin, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
router.post("/", verifyToken, verifyAdmin, createCoupon);
router.get("/", verifyToken, verifyAdmin, getAllCoupons);
router.put("/:id", verifyToken, verifyAdmin, updateCoupon);
router.delete("/:id", verifyToken, verifyAdmin, deleteCoupon);

export default router;
