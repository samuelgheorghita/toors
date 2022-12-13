import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//just trying this out
import path from "path";
import { fileURLToPath } from "url";

import toursRoutes from "./routes/tours.js";
import usersRoutes from "./routes/users.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

//set up the server
const app = express();

app.use(express.static("uploads"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
// I'm not sure if i'm gonna be needing the next line
app.use(express.json());

// The routes have to be after the setting the cors
app.use("/tours", toursRoutes);
app.use("/users", usersRoutes);
app.use("/admin", adminRoutes);

const port = process.env.PORT || 8000;
// set up the connection with database
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(port, () => console.log(`Server running on port: ${port}`)))
  .catch((err) => console.log(err.message));
