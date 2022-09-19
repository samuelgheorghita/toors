import express from "express";
import multer from "multer";

import { getAllTours, postTour } from "../controllers/tours.js";
import { usersMiddleware } from "../middleware/usersMiddleware.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 20 }, // TODO: change this to a smaller size file. Now is 20MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("wrong image format"), false);
    }
  },
});

const router = express.Router();

router.get("/", getAllTours);
router.post("/", upload.single("tourImage"), postTour);
router.post("/multiple", upload.any(), (req, res) => {
  console.log("inside the multiple router path -----");
  console.log(req.body);
  console.log(req.files);
  res.status(201).json({ mess: "successful!" });
  console.log("PROVAAAAAAAAAA");
});

export default router;
