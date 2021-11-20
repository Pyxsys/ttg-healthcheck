/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const Devices = require('../models/device.js')
const auth = require('../middleware/auth.js')
const { filterData } = require('./common/filter')

// get all device id
router.get('/ids', auth, async (req, res) => {
  const [query, options] = filterData(Object(req.query))
  const devices = await Devices.find(query, { deviceId: 1 }, options)
  return res.status(200).json({ Results: devices.map(d => d.deviceId) })
})

// get multiple devices with param options (limit, multiple attributes, orderBy, orderValue)
router.get('/', auth, async (req, res) => {
  const [query, options] = filterData(Object(req.query))
  const results = await Devices.find({ $and: [query] }, {}, options)
  return res.status(200).json({ Results: results })
})

module.exports = router
