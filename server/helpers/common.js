import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { parseISO, addSeconds } from "date-fns";

import Tours from "../models/Tours.js";
import Users from "../models/Users.js";
import { bucketName, randomImgName, s3 } from "../middleware/imagesMiddleware.js";

export const getToursWithQueryObj = async (queryObj, skip, res) => {
  try {
    // const { queryObj, skip } = handleFilters(req);
    const countTours = await Tours.find(queryObj).count();
    const allTours = await Tours.find(queryObj).sort({ updatedAt: -1 }).skip(skip).limit(10);

    for (const tour of allTours) {
      await checkingObjImgsUrl(tour);
    }

    const tourWithImgs = await findProfileImgs(allTours);

    // TODO: add call to DB to update/replace these tours
    const bulk = await Tours.collection.initializeUnorderedBulkOp();
    for (const tour of tourWithImgs) {
      await bulk.find({ _id: tour._id }).replaceOne(tour);
    }
    await bulk.execute();

    res.status(200).json({ data: tourWithImgs, countTours });
  } catch (error) {
    res.status(400).json({ mess: "Error" });
    console.log(error);
  }
};

// Adds to every tour the image profile of the author
export const findProfileImgs = async (allTours) => {
  const copyTours = allTours.map((tour) => tour.toObject());

  const allUsers = allTours.map((tour) => tour.createdBy);
  const uniqueUsers = [...new Set(allUsers)];

  const promises = uniqueUsers.map((username) => Users.findOne({ username: username }));

  const users = await Promise.all(promises);
  for (const user of users) {
    await checkingSingleImgUrl(user.profileImg);
  }

  const bulk = await Users.collection.initializeUnorderedBulkOp();
  for (const user of users) {
    if (user?.profileImg?.url) {
      await bulk.find({ _id: user._id }).updateOne({ $set: { "profileImg.url": user.profileImg.url } });
    }
  }
  await bulk.execute();

  for (const tour of copyTours) {
    const correspondingUser = users.find((user) => user.username === tour.createdBy);
    tour.profileImg = correspondingUser.profileImg;
  }

  return copyTours;
};

const isUrlExpired = (signedUrl) => {
  const params = new Proxy(new URLSearchParams(signedUrl), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  const creationDate = parseISO(params["X-Amz-Date"]);
  const expiresInSecs = Number(params["X-Amz-Expires"]);

  const expiryDate = addSeconds(creationDate, expiresInSecs);
  const isExpired = expiryDate < new Date();

  return isExpired;
};

// This function deals with normal images as well as viewpoints' ones
async function checkingObjImgsUrl(tour) {
  // Checking URLs for non-viewpoint images
  await checkingImgsUrl(tour.images);

  // Checking URLs of viewpoints' images
  for (const viewpoint of tour.viewpoints) {
    await checkingImgsUrl(viewpoint.images);
  }
}

export async function checkingImgsUrl(images) {
  // Checking if images have a signed URL
  if (images) {
    for (const image of images) {
      await checkingSingleImgUrl(image);
    }
  }
}

export async function checkingSingleImgUrl(image) {
  // If url is expired or the property "url" does not exist, then set the property "url" to a new presigned url
  if (!image?.url || isUrlExpired(image.url)) {
    const params = {
      Bucket: bucketName,
      Key: image.name,
    };
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 120 }); // TODO: put the value of "expiresIn" to 1 day (86400)
    image.url = url;
  }
}
