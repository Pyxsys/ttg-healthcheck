/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const Devices = require('../models/device.js')
const auth = require('../middleware/auth.js')

// get a specific device, based on Id, or name
router.post('/specific', auth, async (req, res) => {
  try {
  } catch (err) {}
})

module.exports = router
