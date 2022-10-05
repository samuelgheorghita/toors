import express from "express";

import { getAllTours, getSingleTour, postTour } from "../controllers/tours.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/imagesMiddleware.js";

const router = express.Router();

router.get("/", getAllTours);
router.get("/single-tour", getSingleTour);
router.post("/multiple", authMiddleware, upload.any(), postTour);

export default router;
