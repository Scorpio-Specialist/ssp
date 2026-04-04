var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/register", async (req, res) => {
  const {name, email, password, key } = req.body;

  try {
    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const role = key === process.env.ADMIN_KEY ? "admin" : "user";

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name,email, password: hash, role});

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    

    res.status(201).json({ message: "User registered successfully ✅", token, user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }, });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Connection error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login successful ✅", token, user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Connection error" });
  }
});

module.exports = router;