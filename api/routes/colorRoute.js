import express from "express";
import { createColor, getAllColor } from "../controllers/colorController.js";
import { verifyAdmin, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createColor);
router.get("/all-color", verifyToken, verifyAdmin, getAllColor);

export default router;
