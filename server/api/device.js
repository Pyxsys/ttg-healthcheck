/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const Devices = require('../models/device.js')
const auth = require('../middleware/auth.js')

// get a specific device, based on param options of either deviceId or name
router.get('/specific-device', async (req, res) => {
  try {
    const queryObj = req.query
    await Devices.findOne(queryObj).exec(function (err, device) {
      res.status(200).json(device)
      return
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// get multiple devices with param options (limit, multiple attributes, orderBy, orderValue)
router.get('/options', async (req, res) => {
  try {
    let options = {}
    let queryObj = req.query
    if (queryObj.limit) {
      var limit = queryObj.limit
      options.limit = parseInt(limit)
      delete queryObj.limit
    }
    if (queryObj.orderBy) {
      var orderBy = queryObj.orderBy
      delete queryObj.orderBy
    }
    if (queryObj.orderValue) {
      var orderValue = queryObj.orderValue
      delete queryObj.orderValue
    }
    if (orderValue && orderBy) {
      options.sort = {
        [orderBy]: parseInt(orderValue),
      }
    }
    for (let k in queryObj) {
      queryObj[k] = queryObj[k].split(',')
    }
    await Devices.find({ $and: [queryObj] }, {}, options).exec(
      (err, device) => {
        res.status(200).json(device)
        return
      }
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
