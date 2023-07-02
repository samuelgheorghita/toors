// Auth routes
import express from "express";

import { loginValidation, signupValidation } from "../middleware/inputValidation.js";

import { login, logout, refreshToken, signup, verifyLogin } from "../controllers/auth.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.get("/logout", logout);
router.get("/refresh-token", refreshToken);
// jolly route in order to identify a user is logged in (used for accessing restricted pages)
router.get("/verify-login", authMiddleware, verifyLogin);

export default router;
