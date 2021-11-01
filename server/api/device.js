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
      return
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// get multiple devices with options
router.get('/options', async (req, res) => {
  try {
    let options = {}
    const limit = req.query.limit
    const attributes = req.query.attributes || {}
    const orderBy = req.query.orderBy
    const orderValue = req.query.orderValue || 1
    if (!!attributes) {
      const params = new URLSearchParams(attributes)
      var attributeObject = Object.fromEntries(params.entries())
    }
    if (!!limit) {
      options.limit = parseInt(limit)
    }
    if (!!orderBy) {
      options.sort = {
        [orderBy]: parseInt(orderValue),
      }
    }
    await Devices.find({ $and: [attributeObject] }, {}, options).exec(
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
