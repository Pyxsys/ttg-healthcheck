const express = require("express");
const router = express.Router();
const user = require("../models/user.js");

// create a user
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    newUser = new user({
      name,
      email,
    });
    await newUser.save();
    res.status(200).send("Added a new user");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
