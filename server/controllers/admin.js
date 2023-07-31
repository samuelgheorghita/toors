import mongoose from "mongoose";
import Tours from "../models/Tours.js";
import Users from "../models/Users.js";

// PUT
export const changeFieldsName = async (req, res) => {
  const documentsUpdated = await Tours.updateMany({}, { $unset: { prova: "" } });

  res.status(202).json({ mess: "Successful!" });
};

// Deletes all the tours that has the property "createdBy" non-existing.
export const deleteTours = async (req, res) => {
  await Tours.deleteMany({ createdBy: { $exists: false } });
  res.status(203).json({ mess: "success" });
};

export const deleteUser = async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.query.userId);
    res.status(202).json({ mess: "successfully deleted" });
  } catch (error) {
    res.status(400);
  }
};

export const deleteAllTours = async (req, res) => {
  try {
    await Tours.deleteMany({});
    res.status(203).json({ mess: "success" });
  } catch (error) {
    res.status(400);
  }
};

export const deleteAllUsers = async (req, res) => {
  try {
    await Users.deleteMany({});
    res.status(203).json({ mess: "success" });
  } catch (error) {
    res.status(400);
  }
};
