import mongoose from "mongoose";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { parseISO, addSeconds } from "date-fns";
import Tours from "../models/Tours.js";
import Users from "../models/Users.js";

import { bucketName, randomImgName, s3 } from "../middleware/imagesMiddleware.js";

// GET
export const getAllTours = async (req, res) => {
  console.log("Inside getAllTours");
  try {
    const { queryObj, skip } = handleFilters(req);
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

export const getSingleTour = async (req, res) => {
  console.log("INSIDE GET SINGLE TOUR");
  // console.log(req.query);
  try {
    const tour = await Tours.findById(req.query.id);

    // Checking URLs for non-viewpoint images
    await checkingImgsUrl(tour.images);

    // Checking URLs of viewpoints' images
    for (const viewpoint of tour.viewpoints) {
      await checkingImgsUrl(viewpoint.images);
    }

    // Updating tour with modified urls (preparing the promises)
    // const response = await Tours.replaceOne({ _id: req.query.id }, tour, { psert: true });

    const response = await Tours.replaceOne({ _id: req.query.id }, tour);

    res.status(200).json(tour);
    console.log(tour);
  } catch (error) {
    res.status(404).json({ mess: "Couldn't get the info about this tour" });
    console.log(error);
  }
};

// POST
export const postTour = async (req, res) => {
  res.status(201).json({ mess: "successful!" });
  console.log("req.body");
  console.log(req.body);
  console.log("req.files");
  console.log(req.files);

  console.log("NEW 3 LOGS ----------------------");
  console.log(req.files[0].originalName);
  console.log(req.files[0].buffer);
  console.log(req.files[0].mimetype);

  // For every image (loop)
  const files = req.files;
  const obj = req.body;

  const promises = [];
  const imgsName = [];

  // Storing all images in S3 bucket and 1) changhing, and 2) saving each file's name
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

  console.log("obj-----------------------------------------------------");
  console.log(obj);

  // Saving the tour do the DB
  try {
    const newTours = new Tours(obj);
    await newTours.save();
    res.status(202);
  } catch (error) {
    res.status(400).json({ mess: "Error" });
    console.log(error);
  }

  // const files = req.files;
  // const obj = req.body;
  // console.log("obj");
  // console.log(obj);

  // // associate the image to the correct form or subform
  // files.forEach((file) => {
  //   if (!file.fieldname.includes("viewpoints")) {
  //     obj.images = obj.images ? [...obj.images, file.filename] : [file.filename];
  //   } else {
  //     console.log("file");
  //     console.log(file);
  //     const id = file.fieldname.split("[")[1].slice(0, -1);
  //     const currObj = obj.viewpoints[id];
  //     currObj.images = currObj.images ? [...currObj.images, file.filename] : [file.filename];
  //   }
  // });

  // const arr = [];

  // for (let key in obj.viewpoints) {
  //   const newObj = obj.viewpoints[key];
  //   newObj.id = key;
  //   arr.push(newObj);
  // }
  // obj.viewpoints = arr;

  // try {
  //   const newTours = new Tours(obj);
  //   await newTours.save();
  //   res.status(202);
  // } catch (error) {
  //   res.status(400).json({ mess: "Error" });
  //   console.log(error);
  // }
};

// PUT
export const updateTour = async (req, res) => {
  console.log("inside updateTour!");

  const files = req.files;
  const obj = req.body;
  console.log("FIRST obj -----------------------");
  obj.cost = Number(obj.cost);
  console.log(obj);
  console.log("MULTER -----");
  console.log(files);

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

  console.log("SECOND obj -----------------------");
  console.log(obj);
  console.log(obj.viewpoints);

  // Assosciate images with the correct form or subform ------uncomment next function
  files.forEach((file) => {
    if (file.fieldname.includes("viewpoints.")) {
      console.log("file");
      console.log(file);
      const id = file.fieldname.split(".")[1];
      const currObj = obj.viewpoints[obj.viewpoints.findIndex((elem) => elem.id === id)];
      console.log("currObj");
      console.log(currObj);
      currObj.images = currObj?.images ? [...currObj.images, file.filename] : [file.filename];
    } else {
      obj.images = obj.images ? [...obj.images, file.filename] : [file.filename];
    }
  });

  console.log("THRID obj -----------------------");
  console.log(obj);

  console.log("FOURTH PRINT obj -----------------------");
  console.log(obj.viewpoints);

  // // Add the old images (before the update, already in the string format)
  // [...Object.entries(obj)].forEach(([key, value]) => {
  //   if (/^images[\W]/.test(key)) {
  //     obj.images.push(value);
  //     delete obj[key];
  //   }
  // });

  // [...obj.viewpoints].forEach((viewpoint) => {
  //   console.log("viewpoint");
  //   console.log(viewpoint);
  // });

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
  console.log("inside delete tour");

  const tours = await Tours.findByIdAndDelete(req.query.id);

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
    console.log("splitted");
    console.log(splitted);
    const regex = splitted.join("|");
    console.log(regex);
    queryObj = {
      ...queryObj,
      $or: [{ title: { $regex: regex, $options: "i" } }, { description: { $regex: regex, $options: "i" } }],
    };
    console.log(queryObj);
  }

  return { queryObj, skip: pagSkip };
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
