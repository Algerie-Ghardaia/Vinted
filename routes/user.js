const express = require("express");
const app = express();
app.use(express.json());
const router = express.Router();

//=========== LIBRAY TIME AND DATE =======//
const moment = require("moment");
const Date = moment().format("yy-MM-DD");
const Time = moment().format("HH:mm:ss");
//===========// LIBRAY TIME AND DATE //=======//

//=========== LIBRAY GENERATE PASSWORD =======//
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
//===========// LIBRAY GENERATE PASSWORD //=======//

//================= ROUTER =================//
const User = require("../models/User");
//=================// ROUTER //=================//

//=========== EFFECTUER UNE ISCRIPTION NOUVEAU UTILISATEUR =======//
router.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password,newsletter} = req.body
    const salt = uid2(21);
    const token = uid2(54);
    const hash = SHA256(password + salt).toString(encBase64);


    if (!username || !email || !password) {
      return res.status(400).json("Missing parameters");
    }

    const userPresence = await User.findOne({email});
    if (userPresence) {
      return res.status(200).json({ message: "Email already exists" });
    }

    if (!username) {
      return res.status(200).json({ message: "Username missing" });
    }

    const newUser = new User({
      email: email,
      account: {
        username: username,
      },
      newsletter: newsletter,
      salt: salt,
      hash: hash,
      token: token,
      dateTime:{
        date: Date,
        time : Time
      },
    });
    await newUser.save();

    const responseNewUser = {
      _id: newUser._id,
      token: newUser.token,
      account: {
        username: newUser.account.username,
      },
    };
    res.status(200).json(responseNewUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//=========== EFFECTUER UNE ISCRIPTION NOUVEAU UTILISATEUR =======//

//=========== AUTHENTIFICATION =======//
router.post("/user/login", async (req, res) => {
  try {
    const {email, password} = req.body
    const login = await User.findOne({ email });
    if (!login) {
      return res.status(401).json({ message: "Email or password incorrect" });
    }

    const newHash = SHA256(password + login.salt).toString(encBase64);

    if (newHash === login.hash) {
      res.status(200).json({
        _id: login._id,
        token: login.token,
        account: {
          username: login.account.username,
        },
      });
    } else {
      return res.status(401).json({ message: "Email or password incorrect" });
    }

    await login.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//=========== AUTHENTIFICATION  =======//

module.exports = router;
