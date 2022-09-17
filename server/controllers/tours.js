import mongoose from "mongoose";
import Tours from "../models/Tours.js";

export const getAllTours = async (req, res) => {
  try {
    const allTours = await Tours.find();
    res.status(200).json(allTours);
  } catch (error) {
    console.log(error);
  }
};

export const postTour = async (req, res) => {
  console.log(req.file);
  const newTours = new Tours({
    ...req.body,
    tourImage: req.file.path,
  });

  try {
    await newTours.save();
    res.status(202).json(newTours);
  } catch (error) {
    console.log(error);
  }
};
