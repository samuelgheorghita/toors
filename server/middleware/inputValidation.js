import { check } from "express-validator";

export const loginValidation = [
  check("email").isEmail().withMessage("Email is not valid "),
  check("password").isLength({ min: 6 }).withMessage("Invalid password, minimum length is 6."),
];

export const signupValidation = [
  ...loginValidation,
  check("username").isLength({ min: 3 }).withMessage("Invalid username, minimum length is 3."),
  check("firstName").isLength({ min: 1 }).withMessage("First name is required"),
  check("lastName").isLength({ min: 1 }).withMessage("Last name is required"),
];
