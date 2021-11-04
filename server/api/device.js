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
/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const Devices = require('../models/device.js')
const auth = require('../middleware/auth.js')
const { filterData } = require('./shared/filter')

// get a specific device, based on param option of either deviceId or name
router.get('/specific-device', auth, async (req, res) => {
  try {
    const param = String(req.query.entry)
    await Devices.findOne({
      $or: [{ deviceId: param }, { name: param }],
    }).exec(function (err, device) {
      return res.status(200).json(device)
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// get multiple devices with param options (limit, multiple attributes, orderBy, orderValue)
router.get('/options', auth, async (req, res) => {
  try {
    let [query, options] = filterData(req.query)
    await Devices.find({ $and: [query] }, {}, options).exec((err, device) => {
      return res.status(200).json(device)
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
