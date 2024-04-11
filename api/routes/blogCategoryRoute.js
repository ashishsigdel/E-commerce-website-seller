import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updateCategory,
} from "../controllers/blogCategoryController.js";
import { verifyAdmin, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createCategory);
router.post("/:id", verifyToken, verifyAdmin, updateCategory);
router.delete("/:id", verifyToken, verifyAdmin, deleteCategory);
router.get("/all-category", verifyToken, verifyAdmin, getAllCategory);
router.get("/:id", verifyToken, verifyAdmin, getCategory);

export default router;
