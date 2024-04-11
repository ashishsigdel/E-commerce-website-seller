import express from "express";
import {
  createCategory,
  getAllCategory,
} from "../controllers/prodCategoryController.js";
import { verifyAdmin, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createCategory);
router.get("/all-category", verifyToken, verifyAdmin, getAllCategory);

export default router;
