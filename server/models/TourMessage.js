import mongoose from "mongoose";

const tourSchema = mongoose.Schema({
  title: String,
});

const TourMessage = mongoose.model("TourMessage", tourSchema);

export default TourMessage;
