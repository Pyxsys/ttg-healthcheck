/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

// create a user
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    newUser = new User({
      name,
      email,
    });
    await newUser.save();
    res.send(newUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
