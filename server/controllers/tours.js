import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { parseISO, addSeconds } from "date-fns";
import sharp from "sharp";

import Tours from "../models/Tours.js";
import Users from "../models/Users.js";

import { bucketName, randomImgName, s3 } from "../middleware/imagesMiddleware.js";

// GET
export const getAllTours = async (req, res) => {
  try {
    const { queryObj, skip } = handleFilters(req);
    const countTours = await Tours.find(queryObj).count();
    const allTours = await Tours.find(queryObj).sort({ updatedAt: -1 }).skip(skip).limit(1);

    for (const tour of allTours) {
      await checkingObjImgsUrl(tour);
    }

    const tourWithImgs = await findProfileImgs(allTours);

    // TODO: add call to DB to update/replace these tours
    const bulk = await Tours.collection.initializeUnorderedBulkOp();
    for (const tour of tourWithImgs) {
      await bulk.find({ _id: tour._id }).replaceOne(tour);
    }
    if (bulk.length !== 0) await bulk.execute();

    res.status(200).json({ data: tourWithImgs, countTours });
  } catch (error) {
    res.status(400).json({ mess: "Error" });
    console.log(error);
  }
};

export const getSingleTour = async (req, res) => {
  try {
    const tour = await Tours.findById(req.query.id);

    // Checking URLs for non-viewpoint images
    await checkingImgsUrl(tour.images);

    // Checking URLs of viewpoints' images
    for (const viewpoint of tour.viewpoints) {
      await checkingImgsUrl(viewpoint.images);
    }

    const response = await Tours.replaceOne({ _id: req.query.id }, tour);

    res.status(200).json(tour);
  } catch (error) {
    res.status(404).json({ mess: "Couldn't get the info about this tour" });
    console.log(error);
  }
};

// POST
export const postTour = async (req, res) => {
  const date1 = Date.now();

  // For every image (loop)
  const files = req.files;
  const obj = req.body;

  const promises = [];
  const imgsName = [];

  // Resizing images
  for (const file of files) {
    const image = await sharp(file.buffer);
    const metadata = await image.metadata();
    let dimension = "width";

    if (metadata.height > metadata.width) {
      dimension = "height";
    }

    file.buffer = await image
      .resize({
        fit: sharp.fit.contain,
        [dimension]: 2_000,
      })
      .webp()
      .toBuffer();

    // For testing the difference between the size of image before and after resizing
    // const image2 = await sharp(file.buffer);
    // const metadata2 = await image2.metadata();
    // file.size2 = metadata2.size / 1_000_000;
    // file.size = file.size / 1_000_000;
  }

  // Storing all images in S3 bucket and 1) changing, and 2) saving each file's name
  for (const file of files) {
    // Add all promises into "promises" variable
    const randImgName = randomImgName();

    // Store in S3 bucket
    const params = {
      Bucket: bucketName,
      Key: randImgName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);

    imgsName.push(randImgName);

    promises.push(s3.send(command));
  }

  try {
    await Promise.all(promises);
  } catch (error) {
    res.status(400).json({ mess: "Error" });
    console.log(error);
  }

  // Associate the image to the correct form or subform
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.fieldname.includes("viewpoints")) {
      // Image of general/main tour
      obj.images = obj.images ? [...obj.images, { name: imgsName[i] }] : [{ name: imgsName[i] }];
    } else {
      // Image of viewpoint
      const id = file.fieldname.split("[")[1].slice(0, -1);
      const currObj = obj.viewpoints[id];
      currObj.images = currObj.images ? [...currObj.images, { name: imgsName[i] }] : [{ name: imgsName[i] }];
    }
  }

  // Changing the obj in order to fit DB structure of viewpoints (viewpoints is a property that is an array
  // that has objects as items)
  const arr = [];

  for (let key in obj.viewpoints) {
    const newObj = obj.viewpoints[key];
    newObj.id = key;
    arr.push(newObj);
  }
  obj.viewpoints = arr;

  // Saving the tour do the DB
  try {
    const newTours = new Tours(obj);
    await newTours.save();
    res.status(202);
  } catch (error) {
    res.status(400).json({ mess: "Error" });
    console.log(error);
  }

  const date2 = Date.now();
  const diff = (date2 - date1) / 1000;

  res.status(200).json({ diff });
};

// PUT
export const updateTour = async (req, res) => {
  const files = req.files;
  const obj = req.body;
  obj.cost = Number(obj.cost);

  // Transforming the weird looking data into a viewpoints object
  obj.viewpoints = [];
  for (const key in obj) {
    if (key.includes("viewpoints.") && Object.hasOwnProperty.call(obj, key)) {
      const elem = obj[key];
      const [v, id, vKey] = key.split(".");

      const index = obj.viewpoints.findIndex((elem) => elem.id === id);
      // If it doesn't exist already
      if (index === -1) {
        obj.viewpoints.push({
          id: id,
          [vKey]: vKey === "images" ? [elem] : elem,
        });
      } else {
        if (vKey === "images") {
          if (obj.viewpoints[index][vKey]) {
            obj.viewpoints[index][vKey].push(elem);
          } else {
            obj.viewpoints[index][vKey] = [elem];
          }
        } else {
          obj.viewpoints[index][vKey] = elem;
        }
      }
    }
  }

  // Assosciate images with the correct form or subform ------uncomment next function
  files.forEach((file) => {
    if (file.fieldname.includes("viewpoints.")) {
      const id = file.fieldname.split(".")[1];
      const currObj = obj.viewpoints[obj.viewpoints.findIndex((elem) => elem.id === id)];
      currObj.images = currObj?.images ? [...currObj.images, file.filename] : [file.filename];
    } else {
      obj.images = obj.images ? [...obj.images, file.filename] : [file.filename];
    }
  });

  try {
    await Tours.updateOne({ _id: req.query.id }, { $set: obj });
    res.status(200).json({ mess: "All ok" });
  } catch (error) {
    res.status(400).json({ mess: "Oops, something went wrong!" });
    console.log(error);
  }
};

// DELETE
export const deleteTour = async (req, res) => {
  await Tours.findByIdAndDelete(req.query.id);

  return res.status(201).json({ mess: "Heyoo" });
};

// ---- private functions
const handleFilters = (req) => {
  let queryObj = {};
  let { transportation, costMin, costMax, searchStr, pagSkip } = req.query;
  costMin = parseInt(costMin);
  costMax = parseInt(costMax);

  if (!pagSkip) {
    pagSkip = 0;
  }

  if (transportation) {
    queryObj.transportation = { $in: req.query.transportation };
  }
  if (costMin > 0 && costMin <= costMax) {
    queryObj.cost = { $gte: costMin, $lte: costMax };
  }
  if (searchStr) {
    const splitted = searchStr.split(" "); // Here I obtain multiple words
    const regex = splitted.join("|");
    queryObj = {
      ...queryObj,
      $or: [{ title: { $regex: regex, $options: "i" } }, { description: { $regex: regex, $options: "i" } }],
    };
  }

  return { queryObj, skip: pagSkip };
};

// Adds to every tour the image profile of the author
export const findProfileImgs = async (allTours) => {
  const copyTours = allTours.map((tour) => tour.toObject());

  const allUsers = allTours.map((tour) => tour.createdBy);
  const uniqueUsers = [...new Set(allUsers)];

  const promises = uniqueUsers.map((username) => Users.findOne({ username: username }));

  const usersNotFiltered = await Promise.all(promises);
  const users = usersNotFiltered.filter((user) => user?.profileImg?.name);

  // If there's no image to retrieve because no user on the current page has an image, then return the original array
  if (users.length === 0) return copyTours;

  // Generating valid urls for images
  for (const user of users) {
    await checkingSingleImgUrl(user.profileImg);
  }

  // Changing the urls of the images inside the DB
  const bulk = await Users.collection.initializeUnorderedBulkOp();
  for (const user of users) {
    if (user?.profileImg?.url) {
      await bulk.find({ _id: user._id }).updateOne({ $set: { "profileImg.url": user.profileImg.url } });
    }
  }
  await bulk.execute();

  // Changing the copy of the array of tours
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
  if (typeof images !== "undefined" && images.length > 0) {
    // ES6 way Array.isArray(array) && array.length
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
    const url = await getSignedUrl(s3, command, { expiresIn: 86400 }); // TODO: put the value of "expiresIn" to 1 day (86400)
    image.url = url;
  }
}
