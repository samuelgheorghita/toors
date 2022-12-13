import mongoose from "mongoose";
import Tours from "../models/Tours.js";

// PUT

export const changeFieldsName = async (req, res) => {
  const documentsUpdated = await Tours.updateMany({}, { $unset: { prova: "" } });

  // COMMAND: used to update a field with random numbers between 0 and n
  //   const documentsUpdated = await Tours.aggregate([
  //     {
  //       $set: { totalTime: { $multiply: [{ $rand: {} }, 11] } },
  //     },
  //     { $set: { totalTime: { $floor: "$totalTime" } } },
  //     { $merge: "tours" },
  //   ]);

  console.log("documentsUpdated");
  console.log(documentsUpdated);

  res.status(202).json({ mess: "Successful!" });
};
