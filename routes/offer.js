const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const isAuthenticated = require("../middlewares/isAuthenticated");
const convertToBase64 = require("../utils/convertToBase64");
const Offer = require("../models/Offer");

//=========== LIBRAY TIME AND DATE =======//
const moment = require("moment");
const { Query } = require("mongoose");
const Date = moment().format("yy-MM-DD");
const Time = moment().format("HH:mm:ss");
//===========// LIBRAY TIME AND DATE //=======//

//=========== A NEW POST FOR USER ================//
router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const { description, price, condition, city, brand, size, color, title } =
        req.body;
        const objImg ={}
        if (req.files === null || req.files.pictures.length === 0) {
          return res.json("No file uploaded!");
        }
        const arrayOfFilesUrl = [];
        const picturesToUpload = req.files.pictures;
        for (let i = 0; i < picturesToUpload.length; i++) {
          const picture = picturesToUpload[i];
          const result = await cloudinary.uploader.upload(
            convertToBase64(picture)
          );
           arrayOfFilesUrl.push(objImg.img = `Img ${i+1} : ${result.secure_url} `);
        }

      const newOffer = new Offer({
        dateTime: {
          date: Date,
          time: Time,
        },
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          {
            MARQUE: brand,
          },
          {
            TAILLE: size,
          },
          {
            ETAT: condition,
          },
          {
            color: color,
          },
          {
            EMPLACEMENT: city,
          },
        ],
        product_image: arrayOfFilesUrl,
        owner: req.user,
      });

      await newOffer.save();

      //   await newOffer.populate("owner", "account");

      res.status(201).json(newOffer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
//=========== A NEW POST FOR USER ================//

//=========== FIND ARTICLE BY  ================//

router.get("/offers", async (req, res) => {
  try {
    const { title, priceMin, priceMax, sort, page } = req.query;

    const filters = {
      // product_name: new RegExp(title, "i"),
      // product_price: { $gte: priceMin },
    };

    if (title) {
      filters.product_name = new RegExp(title, "i");
    }

    if (priceMin) {
      filters.product_price = { $gte: priceMin };
    }

    if (priceMax) {
      if (priceMin) {
        filters.product_price.$lte = priceMax;
      } else {
        filters.product_price = { $lte: priceMax };
      }
    }

    const sorter = {};

    if (sort === "price-asc") {
      sorter.product_price = "asc";
    } else if (sort === "price-desc") {
      sorter.product_price = "desc";
    }

    let skip = 0;
    if (page) {
      skip = (page - 1) * 5;
    }

    const offers = await Offer.find(filters)
      .sort(sorter)
      .skip(skip)
      .limit(5)
      .populate("owner", "account");

    const count = await Offer.countDocuments(filters);

    res.json({
      count: count,
      offers: offers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//===========// FIND ARTICLE BY  //================//


module.exports = router;

