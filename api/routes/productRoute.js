import express from "express";
import {
  addToWishlist,
  createProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  rating,
  updateProduct,
  uploadImages,
} from "../controllers/productController.js";
import { verifyToken, verifyAdmin } from "../utils/verifyUser.js";

const router = express();

router.post("/create", verifyAdmin, verifyToken, createProduct);
router.post("/upload/:id", verifyToken, verifyAdmin, uploadImages);
router.get("/get", getAllProduct);
router.post("/wishlist", verifyToken, addToWishlist);
router.post("/rating", verifyToken, rating);

router.get("/getproduct", getProduct);
router.post("/:id", verifyAdmin, verifyToken, updateProduct);
router.delete("/:id", verifyAdmin, verifyToken, deleteProduct);

export default router;
