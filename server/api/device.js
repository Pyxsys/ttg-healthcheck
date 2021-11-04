const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const Device = require('../models/device.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth.js')

// get all devices
router.get('/', async (req, res) => {
    try {
    console.log("hello, in api");
      const devices = await Device.find({},{hardware:0})
      console.log(devices[0]);
      res.json(devices)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  })

module.exports = router
