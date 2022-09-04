import express from "express";
import { body, check, validationResult } from "express-validator";

const router = express.Router();

import { signup, login } from "../controllers/auth.js";

// The logic of these 2 will going to split up eventually
const signupValidation = [check("email").isEmail().withMessage("email not valid"), check("password").isLength({ min: 6 })];
const loginValidation = [...signupValidation];

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

export default router;
