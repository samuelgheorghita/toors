import express from "express";
import { body, check, validationResult } from "express-validator";

import { signup, login, verifyLogin } from "../controllers/users.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Place these validation in another file eventually
const loginValidation = [check("email").isEmail(), check("password").isLength({ min: 6 })];
const signupValidation = [...loginValidation, check("username").isLength({ min: 3 }), check("firstName").isLength({ min: 1 }), check("lastName").isLength({ min: 1 })];

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
// jolly route in order to identify a user is logged in (used for accessing restricted pages)
router.get("/verify-login", authMiddleware, verifyLogin);

export default router;
