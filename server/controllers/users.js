import mongoose from "mongoose";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Users from "../models/Users.js";

export const signup = async (req, res) => {
  //   the validation returns an array of error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, username } = req.body;

  console.log("singing up!");
  try {
    const emailFound = await Users.findOne({ email: email });
    if (emailFound) return res.status(400).json({ errorMess: "Email already exists" });

    const usernameFound = await Users.findOne({ username: username });
    if (usernameFound) return res.status(400).json({ errorMess: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("hashedPAss: " + hashedPassword);
    const newUser = new Users({ ...req.body, password: hashedPassword });

    await newUser.save();
    console.log("user saved");
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  // validate password and email, in order to spare some trips to the database
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorMess: "Credentials invalid (inside the validation)" });
  }

  const { email, password } = req.body;
  console.log("logging in");

  try {
    const foundUser = await Users.findOne({ email: email });
    if (!foundUser) return res.status(400).json({ errorMess: "Email doesn't exist" });

    const passMatch = await bcrypt.compare(password, foundUser.password);

    if (!passMatch) return res.status(400).json({ errorMess: "Password invalid" });

    console.log("user found");

    // send token --- TODO: change the payload, in order to send something less private/sensitive than the email
    const token = jwt.sign({ email }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "4h",
    });

    res.cookie("token", token, { httpOnly: true });
    console.log("cookie created: " + token);

    res.status(200).json({ mess: "login successful", username: foundUser.username });
  } catch (error) {
    console.log(error);
  }
};

export const verifyLogin = (req, res) => {
  res.status(200).json({ mess: "Login successfully verified" });
};
