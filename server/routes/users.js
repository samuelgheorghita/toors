import express from "express";
import { body, check, validationResult } from "express-validator";

import { changeAbout, changeEmail, changeName, changeProfileImg, getFavorites, getMyTours, getUserByUsername, login, signup, toggleFavorite, verifyLogin } from "../controllers/users.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/imagesMiddleware.js";

const router = express.Router();

// Place these validation in another file eventually
const loginValidation = [check("email").isEmail(), check("password").isLength({ min: 6 })];
const signupValidation = [...loginValidation, check("username").isLength({ min: 3 }), check("firstName").isLength({ min: 1 }), check("lastName").isLength({ min: 1 })];

// Auth routes
router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
// jolly route in order to identify a user is logged in (used for accessing restricted pages)
router.get("/verify-login", authMiddleware, verifyLogin);

// Normal routes
router.get("/user-info", authMiddleware, getUserByUsername);
router.get("/favorites", authMiddleware, getFavorites);
router.get("/my-tours", authMiddleware, getMyTours);
router.put("/toggle-favorite", authMiddleware, toggleFavorite);

// account-settings
router.post("/account-settings/personal-info/name", authMiddleware, changeName);
router.post("/account-settings/personal-info/email", authMiddleware, changeEmail);
router.post("/account-settings/personal-info/about", authMiddleware, changeAbout);
router.post("/account-settings/personal-info/profile-img", authMiddleware, upload.any(), changeProfileImg);

export default router;
