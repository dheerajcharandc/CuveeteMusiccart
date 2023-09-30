const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const  bodyParser=require('body-parser')
const validator = require("validator");


// **** login ******

router.post("/login", bodyParser.json(), async (req, res) => {
  console.log(process.env.SECRET_KEY);
  const { identifier, password } = req.body;
  if (!identifier) {
    return res.status(400).json({ message: "Email or mobile number is required." });
  }
  
  const isEmail = validator.isEmail(identifier); // You can use a library like validator.js to validate email
  const isMobileNumber = /^\d{10}$/.test(identifier);
  // //  email format validation
  // var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if (!emailRegex.test(email)) {
  //   return res.status(400).json({ message: "Invalid email format." });
  // }
  if (!isEmail && !isMobileNumber) {
    return res.status(400).json({ message: "Invalid email or mobile number" });
  }

  // password minimum length validation
  if (password.length < 5) {
    return res
      .status(400)
      .json({ message: "Password must be at least 5 characters long." });
  }

  try {
    const existingUser = await user.findOne({ 
      $or: [{ email: identifier }, { mobile: identifier }],
     });
    if (existingUser) {
      const matchPassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!matchPassword) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const token = jwt.sign(
        {
          email: existingUser.email,
          id: existingUser._id,
          mobile_num: existingUser.mobile,
        },
        process.env.SECRET_KEY
      );
      return res.status(201).json({ user: existingUser, token: token });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong !" });
  }
});

module.exports = router;