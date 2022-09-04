import express from "express";

import { getAllTours, postTour } from "../controllers/tours.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getAllTours);
router.post("/", postTour);

export default router;
