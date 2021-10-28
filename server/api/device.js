/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const Devices = require('../models/device.js')
const auth = require('../middleware/auth.js')

// get a specific device, based on Id, or name
router.get('/specific', auth, async (req, res) => {
  try {
    let param = req.query.entry
    Devices.find(
      { $or: [{ region: param }, { sector: param }] },
      function (err, device) {
        if (err) {
          res.send(err)
        }
        res.status(200).json(device)
      }
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
