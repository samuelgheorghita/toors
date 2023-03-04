import mongoose from "mongoose";
import Tours from "../models/Tours.js";
import Users from "../models/Users.js";

// GET
export const getAllTours = async (req, res) => {
  try {
    const queryObj = handleFilters(req);
    const allTours = await Tours.find(queryObj);
    const tourWithImgs = await findProfileImgs(allTours);
    res.status(200).json(tourWithImgs);
  } catch (error) {
    res.status(400).json({ mess: "Error" });
    console.log(error);
  }
};

export const getSingleTour = async (req, res) => {
  console.log("INSIDE GET SINGLE TOUR");
  console.log(req.query);
  try {
    const tour = await Tours.findById(req.query.id);
    res.status(200).json(tour);
    console.log(tour);
  } catch (error) {
    res.status(404).json({ mess: "Couldn't get the info about this tour" });
  }
};

// POST
export const postTour = async (req, res) => {
  res.status(201).json({ mess: "successful!" });

  const files = req.files;
  const obj = req.body;
  console.log("obj");
  console.log(obj);

  // associate the image to the correct form or subform
  files.forEach((file) => {
    if (!file.fieldname.includes("viewpoints")) {
      obj.images = obj.images ? [...obj.images, file.filename] : [file.filename];
    } else {
      console.log("file");
      console.log(file);
      const id = file.fieldname.split("[")[1].slice(0, -1);
      const currObj = obj.viewpoints[id];
      currObj.images = currObj.images ? [...currObj.images, file.filename] : [file.filename];
    }
  });

  const arr = [];

  for (let key in obj.viewpoints) {
    const newObj = obj.viewpoints[key];
    newObj.id = key;
    arr.push(newObj);
  }
  obj.viewpoints = arr;

  try {
    const newTours = new Tours(obj);
    await newTours.save();
    res.status(202);
  } catch (error) {
    res.status(400).json({ mess: "Error" });
    console.log(error);
  }
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
  let { transportation, costMin, costMax, searchStr } = req.query;
  costMin = parseInt(costMin);
  costMax = parseInt(costMax);

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
    const regex = splitted.join("|"); // TODO: add "i" tagg to the regex
    console.log(regex);
    queryObj = {
      ...queryObj,
      $or: [{ title: { $regex: regex, $options: "i" } }, { description: { $regex: regex, $options: "i" } }],
    };
    console.log(queryObj);
  }

  return queryObj;
};

// Adds to every tour the image profile of the author
export const findProfileImgs = (allTours) => {
  const copyTours = allTours.map((tour) => tour.toObject());

  const allUsers = allTours.map((tour) => tour.createdBy);
  const uniqueUsers = [...new Set(allUsers)];

  const promises = uniqueUsers.map((username) => Users.findOne({ username: username }));

  return Promise.all(promises)
    .then((users) => {
      for (const tour of copyTours) {
        const correspondingUser = users.find((user) => user.username === tour.createdBy);
        tour.profileImg = correspondingUser.profileImg;
      }

      return copyTours;
    })
    .catch((err) => console.log(err));
};
