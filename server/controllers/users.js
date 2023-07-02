import mongoose from "mongoose";

import { checkingSingleImgUrl, findProfileImgs } from "./tours.js";
import { bucketName, randomImgName, s3, uploadOnS3Bucket } from "../middleware/imagesMiddleware.js";

import Users from "../models/Users.js";
import Tours from "../models/Tours.js";
import { getToursWithQueryObj } from "../helpers/common.js";

// Normal controllers
export const getUserByUsername = async (req, res) => {
  console.log("inside getUserByUsername ------------------------------");
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
    console.log("user favorites");
    // const filteredTours = await Tours.find().where("_id").in(user.favorites).exec();
    // const filteredTours = await Tours.find({ _id: { $in: user.favorites } });
    // const toursWithImgs = await findProfileImgs(filteredTours);
    getToursWithQueryObj({ _id: { $in: user.favorites } }, pagSkip, res);

    // res.status(200).json(toursWithImgs);
  } catch (error) {
    res.status(404);
    console.log(error);
  }
};

export const getMyTours = async (req, res) => {
  const { username, pagSkip } = req.query;
  getToursWithQueryObj({ createdBy: username }, pagSkip, res);
  // const myTours = await Tours.find({ createdBy: req.query.username });
  // const toursWithImgs = await findProfileImgs(myTours);

  // return res.json(toursWithImgs);
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
    res.status(400).json({ mess: "some error, ups" });
  }
};

export const changeProfileImg = async (req, res) => {
  const img = req.files[0];

  try {
    const user = await Users.findOne({ email: res.locals.userEmail });

    // If there's no image
    if (!user?.profileImg?.name) {
      // Uploading on S3
      const randImgName = randomImgName();

      await uploadOnS3Bucket(img, randImgName);

      // Updating DB
      await Users.updateOne({ email: res.locals.userEmail }, { $set: { "profileImg.name": randImgName } }); // profileImg is an object
    } else {
      await uploadOnS3Bucket(img, user.profileImg.name);
    }
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(400);
  }

  // // Assigning the same name to the image, makes it update on s3
  //   const randImgName = randomImgName();

  // const params = {
  //   Bucket: bucketName,
  //   Key: randImgName,
  //   Body: file.buffer,
  //   ContentType: file.mimetype,
  // };

  //     const command = new PutObjectCommand(params);
  //    await s3.send(command)

  try {
    // await Users.updateOne({ email: res.locals.userEmail }, { $set: { profileImg: img } });
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};
