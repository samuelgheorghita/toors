import mongoose from "mongoose";
import TourMessage from "../models/TourMessage.js";

export const getAllTours = async (req, res) => {
  try {
    const allTours = await TourMessage.find();
    res.status(200).json(allTours);
  } catch (error) {
    console.log(error);
  }
};

export const postTour = async (req, res) => {
  const body = req.body;
  const newTourMessage = new TourMessage(body);

  try {
    await newTourMessage.save();
    res.status(201).json(newTourMessage);
  } catch (error) {
    console.log(error);
  }
};
