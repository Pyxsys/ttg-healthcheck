const express = require('express')
const router = express.Router()
const Wifi = require('../models/wifi.js')

// get X number of entries for single device
router.get('/specificDevice', async (req, res) => {
  try {
    const id = req.query.deviceId
    const limit = req.query.limit
    if (!!limit) {
      limit = parseInt(limit)
    }
    await Wifi.WifiLogs.find({ deviceId: id })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec(function (err, WifiLogs) {
        res.status(200).json(WifiLogs)
        return
      })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// get multiples entries within a timestamp
router.get('/timestamp', async (req, res) => {
  try {
    let optionalId = ''
    const startTimeStamp = req.query.startTimeStamp
    const endTimeStamp = req.query.endTimeStamp
    if (!!query.deviceId) {
      optionalId = query.deviceId
      await Wifi.WifiLogs.find({
        deviceId: optionalId,
        timestamp: {
          $gte: ISODate(startTimeStamp),
          $lte: ISODate(endTimeStamp),
        },
      }).exec(function (err, WifiLogs) {
        res.status(200).json(WifiLogs)
        return
      })
    } else {
      await Wifi.WifiLogs.find({
        timestamp: {
          $gte: ISODate(startTimeStamp),
          $lte: ISODate(endTimeStamp),
        },
      }).exec(function (err, WifiLogs) {
        res.status(200).json(WifiLogs)
        return
      })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})
