import mongoose from "mongoose";
import Tours from "../models/Tours.js";

// GET
export const getAllTours = async (req, res) => {
  try {
    const allTours = await Tours.find();
    res.status(200).json(allTours);
  } catch (error) {
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

  // associate the image to the correct form or subform
  files.forEach((file) => {
    if (!file.fieldname.includes("viewpoints")) {
      obj.images = obj.images ? [...obj.images, file.filename] : [file.filename];
    } else {
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
    console.log(error);
  }
};
