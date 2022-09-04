import mongoose from "mongoose";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const signup = async (req, res) => {
  //   the validation returns an array of error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email: email });
    if (userFound) return res.status(400).json({ errorMess: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("hashedPAss: " + hashedPassword);
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();
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

  try {
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) return res.status(400).json({ errorMess: "Email doesn't exist" });

    const passMatch = await bcrypt.compare(password, foundUser.password);

    if (!passMatch) return res.status(404).json({ errorMess: "Password invalid" });

    // send token --- TODO: change the payload, in order to send something less private/sensitive than the email
    const token = jwt.sign({ email }, process.env.JWT_PRIVATE_KEY, {
      // expiresIn: 2 * 60 * 60 * 1000,
      expiresIn: "2h",
    });

    res.status(200).json({ mess: "login successful", token });
  } catch (error) {
    console.log(error);
  }
};
