import express from "express";
import { body, check, validationResult } from "express-validator";

const router = express.Router();

import { signup, login } from "../controllers/users.js";

// Place these validation in another file eventually
const loginValidation = [check("email").isEmail(), check("password").isLength({ min: 6 })];
const signupValidation = [...loginValidation, check("username").isLength({ min: 3 }), check("firstName").isLength({ min: 1 }), check("lastName").isLength({ min: 1 })];

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

export default router;
