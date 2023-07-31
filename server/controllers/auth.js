import mongoose from "mongoose";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Users from "../models/Users.js";
import Tours from "../models/Tours.js";

export const signup = async (req, res) => {
  //   The validation returns an array of error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, username } = req.body;

  try {
    const emailFound = await Users.findOne({ email: email });
    if (emailFound) return res.status(400).json({ errors: [{ msg: "Email already exists" }] });

    const usernameFound = await Users.findOne({ username: username });
    if (usernameFound) return res.status(400).json({ errors: [{ msg: "Username already exists" }] });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new Users({ ...req.body, password: hashedPassword });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ errorMess: "Error" });
    console.log(error);
  }
};

export const login = async (req, res) => {
  // Validate password and email, in order to spare some trips to the database
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorMess: "Credentials invalid (inside the validation)" });
  }

  const { email, password } = req.body;

  try {
    const foundUser = await Users.findOne({ email: email });
    if (!foundUser) return res.status(400).json({ errorMess: "Email doesn't exist" });

    const passMatch = await bcrypt.compare(password, foundUser.password);

    if (!passMatch) return res.status(400).json({ errorMess: "Password invalid" });

    const [aToken, rToken] = createNewTokens(foundUser.id);

    await Users.findByIdAndUpdate(foundUser.id, { $set: { rToken: rToken } });

    res.status(200).json({
      mess: "login successful",
      username: foundUser.username,
      favorites: foundUser.favorites,
      aToken,
      rToken,
    });
  } catch (error) {
    res.status(400).json({ errorMess: "Error" });
    console.log(error);
  }
};

export const refreshToken = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const { sub } = await jwt.verify(token, process.env.JWT_REFRESH_TOKEN_KEY);
    const dbResp = await Users.findById(sub, { rToken: 1 });
    const oldRToken = dbResp.rToken;

    // Main concept of token rotation: a non expired old token has to be checked to see
    // whether you find it in the DB.
    if (oldRToken !== token) return res.status(403).json({ errorMess: "Something went wrong here" });

    const [aToken, rToken] = createNewTokens(sub);

    await Users.findByIdAndUpdate(sub, { $set: { rToken: rToken } });

    res.status(200).json({ aToken, rToken });
  } catch (error) {
    console.log(error);
    res.status(403).json({ errorMess: "Something went wrong" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true });
  res.status(200).json({ mess: "logout succcessfully" });
};

export const verifyLogin = (req, res) => {
  res.status(200).json({ mess: "Login successfully verified" });
};

// Helpers ----
const createNewTokens = (userId) => {
  // Access token
  const aToken = jwt.sign({}, process.env.JWT_ACCESS_TOKEN_KEY, {
    subject: userId,
    expiresIn: "10m", // set this to "10m"
  });

  // Refresh token
  const rToken = jwt.sign({}, process.env.JWT_REFRESH_TOKEN_KEY, {
    subject: userId,
    expiresIn: "30d", // set this to "4h" up to "12h"
  });

  return [aToken, rToken];
};
