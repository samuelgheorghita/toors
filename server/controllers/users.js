import mongoose from "mongoose";

import { checkingSingleImgUrl } from "./tours.js";
import { randomImgName, uploadOnS3Bucket } from "../middleware/imagesMiddleware.js";

import Users from "../models/Users.js";
import { getToursWithQueryObj } from "../helpers/common.js";
import sharp from "sharp";

// Normal controllers
export const getUserByUsername = async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.query.username });
    user.password = undefined;

    if (user?.profileImg?.name) {
      await checkingSingleImgUrl(user.profileImg);
      await Users.updateOne({ username: req.query.username }, { $set: { "profileImg.url": user.profileImg.url } });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ mess: "Cannot get the user" });
  }
};

export const getAuthorByUsername = async (req, res) => {
  try {
    const author = await Users.findOne({ username: req.query.username }, { username: 1, profileImg: 1, _id: 0 });
    res.status(200).json(author);
  } catch (error) {
    console.log(error);
    res.status(404).json({ errorMess: "Error. Cannot get the author of the tour." });
  }
};

export const getFavorites = async (req, res) => {
  const { username, pagSkip } = req.query;
  try {
    const user = await Users.findOne({ username: username });
    getToursWithQueryObj({ _id: { $in: user.favorites } }, pagSkip, res);
  } catch (error) {
    res.status(404);
    console.log(error);
  }
};

export const getMyTours = async (req, res) => {
  const { username, pagSkip } = req.query;
  getToursWithQueryObj({ createdBy: username }, pagSkip, res);
};

export const toggleFavorite = async (req, res) => {
  const userId = res.locals.userId;
  const tourId = req.body.tourId;

  let foundAnything = false;

  const user = await Users.findById(userId);
  for (let i = 0; i < user.favorites.length; i++) {
    const elem = user.favorites[i];
    if (elem === tourId) {
      await Users.findByIdAndUpdate(userId, { $pull: { favorites: tourId } });
      foundAnything = true;
    }
  }

  if (!foundAnything) {
    await Users.findByIdAndUpdate(userId, { $push: { favorites: tourId } });
  }

  res.status(200).json({ mess: "Favorite toggled successfully" });
};

// ACCOUNT-SETTINGS
export const changeName = async (req, res) => {
  console.log("trying to change the name");
  try {
    await Users.findByIdAndUpdate(res.locals.userId, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    res.status(200).json({ mess: "Name updated" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ mess: "some error, ups" });
  }
};

export const changeEmail = async (req, res) => {
  const userId = res.locals.userId;
  const newEmail = req.body.email;
  console.log(newEmail);
  try {
    const existingUser = await Users.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(404).json({ mess: "email already exists" });
    }

    await Users.findByIdAndUpdate(userId, { email: newEmail });

    res.status(200).json({ mess: "Email updated!" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ mess: "some error, ups" });
  }
};

export const changeAbout = async (req, res) => {
  try {
    await Users.findByIdAndUpdate(res.locals.userId, { $set: { about: req.body.about } });
    res.status(200).json({ mess: "About updated" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ mess: "some error, ups" });
  }
};

export const changeProfileImg = async (req, res) => {
  const img = req.files[0];

  const image = await sharp(img.buffer);
  const metadata = await image.metadata();
  let dimension = "width";

  if (metadata.height > metadata.width) {
    dimension = "height";
  }

  img.buffer = await image
    .resize({
      fit: sharp.fit.contain,
      [dimension]: 2_000,
    })
    .webp()
    .toBuffer();

  try {
    const user = await Users.findById(res.locals.userId);

    // If there's no image
    if (!user?.profileImg?.name) {
      // Uploading on S3
      const randImgName = randomImgName();

      await uploadOnS3Bucket(img, randImgName);

      // Updating DB
      await Users.findByIdAndUpdate(res.locals.userId, { $set: { "profileImg.name": randImgName } }); // profileImg is an object
    } else {
      await uploadOnS3Bucket(img, user.profileImg.name);
    }
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};
