import express from "express";
import { createBrand, getAllBrand } from "../controllers/brandController.js";
import { verifyAdmin, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createBrand);
router.get("/all-brand", verifyToken, verifyAdmin, getAllBrand);

export default router;
