/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const Devices = require('../models/device.js')
const auth = require('../middleware/auth.js')
const { filterData } = require('./shared/filter')

// get all device id
router.get('/ids', async (req, res) => {
  const devices = await Devices.find({}, { deviceId: 1 })
  res.status(200).json(devices)
})

// get multiple devices with param options (limit, multiple attributes, orderBy, orderValue)
router.get('/', auth, async (req, res) => {
  let [query, options] = filterData(req.query)
  await Devices.find({ $and: [query] }, {}, options).exec((err, device) => {
    return res.status(200).json(device)
  })
})

module.exports = router
