import mongoose from "mongoose";

const profileImg = mongoose.Schema({
  name: { type: String, required: true },
  url: String,
});

const schema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    favorites: Array,
    about: String,
    rToken: String,
    profileImg: profileImg,
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", schema);

export default Users;
