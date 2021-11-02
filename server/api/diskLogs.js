const express = require('express')
const router = express.Router()
const Disk = require('../models/disk.js')

// get X number of entries for single device
router.get('/specific-device', async (req, res) => {
  try {
    let limit = req.query.limit
    const id = req.query.deviceId
    let query = { deviceId: parseInt(id) }
    if (!!limit) {
      limit = parseInt(limit)
    }
    await Disk.DiskLogs.find({ deviceId: id })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec(function (err, DiskLogs) {
        res.status(200).json(DiskLogs)
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
    const optionalId = req.query.deviceId
    const startTimeStamp = Date(req.query.startTimeStamp)
    const endTimeStamp = Date(req.query.endTimeStamp)
    if (optionalId) {
      await Disk.DiskLogs.find({
        deviceId: optionalId,
        timestamp: {
          $gte: startTimeStamp,
          $lte: endTimeStamp,
        },
      }).exec(function (err, WifiLogs) {
        res.status(200).json(WifiLogs)
        return
      })
    } else {
      await Disk.DiskLogs.find({
        timestamp: {
          $gte: startTimeStamp,
          $lte: endTimeStamp,
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

module.exports = router
