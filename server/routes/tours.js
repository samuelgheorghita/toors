import express from "express";

import { getAllTours, postTour } from "../controllers/tours.js";
import { usersMiddleware } from "../middleware/usersMiddleware.js";
import { upload } from "../middleware/imagesMiddleware.js";

const router = express.Router();

router.get("/", getAllTours);
router.post("/multiple", upload.any(), postTour);

export default router;
