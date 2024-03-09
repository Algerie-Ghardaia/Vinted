const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  dateTime:{
    date: Object,
    time : Object
  },
  product_name: String,
  product_description: String,
  product_price: Number,
  product_details: Array,
  product_image: Object,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});


module.exports = Offer;

// await newOffer.populate("owner","account")