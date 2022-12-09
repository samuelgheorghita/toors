import mongoose from "mongoose";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Users from "../models/Users.js";
import Tours from "../models/Tours.js";

// Authentication controllers
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

    res.status(200).json({
      mess: "login successful",
      username: foundUser.username,
      favorites: foundUser.favorites,
    });
  } catch (error) {
    console.log(error);
  }
};

export const verifyLogin = (req, res) => {
  res.status(200).json({ mess: "Login successfully verified" });
};

// Normal controllers
export const getUserByUsername = async (req, res) => {
  console.log("inside getUserByUsername");
  try {
    const user = await Users.findOne({ username: req.query.username });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ mess: "Cannot get the user" });
  }
};

export const getFavorites = async (req, res) => {
  console.log(req.query);
  try {
    const user = await Users.findOne({ username: req.query.username });
    console.log("user favorites");
    console.log(user);
    console.log(user.favorites);
    const filteredTours = await Tours.find().where("_id").in(user.favorites).exec();
    console.log("filteredTours");
    console.log(filteredTours);

    res.status(200).json(filteredTours);
  } catch (error) {
    res.status(400);
    console.log(error);
  }
};

export const getMyTours = async (req, res) => {
  const myTours = await Tours.find({ createdBy: req.query.username });

  return res.json(myTours);
};

export const toggleFavorite = async (req, res) => {
  const userEmail = res.locals.userEmail;
  const tourId = req.body.tourId;

  let foundAnything = false;

  const user = await Users.findOne({ email: userEmail });
  for (let i = 0; i < user.favorites.length; i++) {
    const elem = user.favorites[i];
    if (elem === tourId) {
      await Users.updateOne({ email: userEmail }, { $pull: { favorites: tourId } });
      foundAnything = true;
    }
  }

  if (!foundAnything) {
    await Users.updateOne({ email: userEmail }, { $push: { favorites: tourId } });
  }

  res.status(200).json({ mess: "Favorite toggled successfully" });
};

// ACCOUNT-SETTINGS
export const changeName = async (req, res) => {
  try {
    await Users.updateOne(
      { email: res.locals.userEmail },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      }
    );
    res.status(200).json({ mess: "Name updated" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ mess: "some error, ups" });
  }
};

export const changeEmail = async (req, res) => {
  const oldEmail = res.locals.userEmail;
  const newEmail = req.body.email;
  console.log(newEmail);
  try {
    const existingUser = await Users.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(404).json({ mess: "email already exists" });
    }

    await Users.updateOne({ email: oldEmail }, { email: newEmail });

    res.status(200).json({ mess: "Email updated!" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ mess: "some error, ups" });
  }
};

export const changeAbout = async (req, res) => {
  const userEmail = res.locals.userEmail;
  try {
    await Users.updateOne(
      { email: userEmail },
      {
        $set: {
          about: req.body.about,
        },
      }
    );
    res.status(200).json({ mess: "About updated" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ mess: "some error, ups" });
  }
};

export const changeProfileImg = async (req, res) => {
  const img = req.files[0].filename;
  try {
    await Users.updateOne({ email: res.locals.userEmail }, { $set: { profileImg: img } });
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(404);
  }
};
