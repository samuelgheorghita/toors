import express from "express";
import { body, check, validationResult } from "express-validator";

const router = express.Router();

import { signup, login } from "../controllers/users.js";

// Place these validation in another file eventually
const loginValidation = [check("email").isEmail().withMessage("email not valid"), check("password").isLength({ min: 6 }), check("username").isLength({ min: 3 })];
const signupValidation = [...loginValidation, check("firstName").isLength({ min: 1 }), check("lastName").isLength({ min: 1 })];

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

export default router;
