import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
  name: { type: String, required: true },
  url: String,
});

const viewpointSchema = mongoose.Schema({
  id: String,
  title: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  cost: { type: Number },
  images: [imageSchema],
});

const tourSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    transportation: { type: String, required: true },
    movingTime: { type: Number, required: true },
    totalTime: { type: Number, required: true },
    description: { type: String, required: true },
    createdBy: { type: String, required: true },
    cost: { type: Number },
    images: [imageSchema],
    viewpoints: [viewpointSchema],
  },
  { timestamps: true }
);

const Tours = mongoose.model("Tours", tourSchema);

export default Tours;
