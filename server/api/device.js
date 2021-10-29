/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const Devices = require('../models/device.js')
const auth = require('../middleware/auth.js')

// get a specific device, based on Id, or name
router.get('/specific', async (req, res) => {
  try {
    let param = req.query.entry
    await Devices.findOne({
      $or: [{ deviceId: param }, { name: param }],
    }).exec(function (err, device) {
      res.status(200).json(device)
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// get multiple devices with options
router.get('/multiple', async (req, res) => {
  try {
    let limit = req.query.limit
    let attribute = req.query.attribute
    let attribute_value = req.query.attribute_value
    if (!!limit && !!attribute && !!attribute_value) {
      await Devices.find({ [attribute]: attribute_value })
        .limit(parseInt(limit))
        .exec(function (err, device) {
          res.status(200).json(device)
        })
    } else if (!!limit) {
      await Devices.find()
        .limit(parseInt(limit))
        .exec(function (err, device) {
          res.status(200).json(device)
        })
    } else {
      return res.status(200).json('nope')
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
