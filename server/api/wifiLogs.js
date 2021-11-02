const express = require('express')
const router = express.Router()
const Wifi = require('../models/wifi.js')

// get X number of entries for single device (limit, deviceId)
router.get('/specific-device', async (req, res) => {
  try {
    let limit = req.query.limit
    const id = String(req.query.deviceId)
    let query = { deviceId: id }
    if (limit) {
      limit = parseInt(limit)
    }
    await Wifi.WifiLogs.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec(function (err, wifiLogs) {
        return res.status(200).json(wifiLogs)
      })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// get multiples entries within a timestamp ( optionalId, startTimeStamp, endTimeStamp)
router.get('/timestamp', async (req, res) => {
  try {
    let optionalId = req.query.deviceId
    const startTimeStamp = String(req.query.startTimeStamp)
    const endTimeStamp = String(req.query.endTimeStamp)
    if (optionalId) {
      optionalId = String(req.query.deviceId)
      await Wifi.WifiLogs.find({
        deviceId: optionalId,
        timestamp: {
          $gte: startTimeStamp,
          $lte: endTimeStamp,
        },
      }).exec(function (err, wifiLogs) {
        return res.status(200).json(wifiLogs)
      })
    } else {
      await Wifi.WifiLogs.find({
        timestamp: {
          $gte: startTimeStamp,
          $lte: endTimeStamp,
        },
      }).exec(function (err, wifiLogs) {
        return res.status(200).json(wifiLogs)
      })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
