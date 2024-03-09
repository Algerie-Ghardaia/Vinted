
const cors = require("cors");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI);

//======== CLOUDINARY =================//
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOOUDINARY_CLOUD_SECRET,
});
//========// CLOUDINARY //=================//

const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");
app.use(cors());
app.use(userRoutes);
app.use(offerRoutes);

app.get("/", (req, res) => {
  try {
    console.log(cloudinary);
    return res.status(200).json("Bienvenue sur notre serveur Vinted");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


app.all("*", (req, res) => {
  res.status(400).json("This route dose not exist ...!");
});

app.listen(process.env.PORT, () => {
  console.log("listening on port 3000  👀👀👀 ");
});
