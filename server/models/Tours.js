import mongoose from "mongoose";

const viewpointSchema = mongoose.Schema({
  id: String,
  title: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  price: { type: String },
  images: { type: Array },
});

const tourSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    transportation: { type: String, required: true },
    movingTime: { type: String, required: true },
    totalTime: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String },
    images: { type: Array },
    viewpoints: [viewpointSchema],
  },
  { timestamps: true }
);

const Tours = mongoose.model("Tours", tourSchema);

export default Tours;
