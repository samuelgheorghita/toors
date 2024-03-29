import express from "express";

import { loginValidation, signupValidation } from "../middleware/inputValidation.js";

import {
  changeAbout,
  changeEmail,
  changeName,
  changeProfileImg,
  getFavorites,
  getMyTours,
  getUserByUsername,
  getAuthorByUsername,
  toggleFavorite,
} from "../controllers/users.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/imagesMiddleware.js";

const router = express.Router();

// Normal routes
router.get("/user-info", authMiddleware, getUserByUsername);
router.get("/author-info", getAuthorByUsername);
router.get("/favorites", authMiddleware, getFavorites);
router.get("/my-tours", authMiddleware, getMyTours);
router.put("/toggle-favorite", authMiddleware, toggleFavorite);

// account-settings
router.post("/account-settings/personal-info/name", authMiddleware, changeName);
router.post("/account-settings/personal-info/email", authMiddleware, changeEmail);
router.post("/account-settings/personal-info/about", authMiddleware, changeAbout);
router.post("/account-settings/personal-info/profile-img", authMiddleware, upload.any(), changeProfileImg);

export default router;
