const mongoose = require("mongoose");

const User = mongoose.model("User", {
  token: String,
  email: String,
  account: {
    username: String,
    avatar: Object,
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
  dateTime:{
    date: Object,
    time : Object
  },
});

module.exports = User;
