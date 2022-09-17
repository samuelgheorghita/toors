import mongoose from "mongoose";

const tourSchema = mongoose.Schema({
  title: { type: String, required: true },
  tourImage: { type: String, required: true },
});

const Tours = mongoose.model("Tours", tourSchema);

export default Tours;
