const express = require('express')
const router = express.Router()
const Memory = require('../models/memory.js')

// get X number of entries for single device (limit, deviceId)
router.get('/specific-device', async (req, res) => {
  try {
    let limit = req.query.limit
    const id = req.query.deviceId
    let query = { deviceId: parseInt(id) }
    if (!!limit) {
      limit = parseInt(limit)
    }
    await Memory.MemoryLogs.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec(function (err, MemoryLogs) {
        return res.status(200).json(MemoryLogs)
      })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// get multiples entries within a timestamp ( optionalId, startTimeStamp, endTimeStamp)
router.get('/timestamp', async (req, res) => {
  try {
    const optionalId = String(req.query.deviceId)
    const startTimeStamp = Date(req.query.startTimeStamp)
    const endTimeStamp = Date(req.query.endTimeStamp)
    if (optionalId) {
      await Memory.MemoryLogs.find({
        deviceId: optionalId,
        timestamp: {
          $gte: startTimeStamp,
          $lte: endTimeStamp,
        },
      }).exec(function (err, WifiLogs) {
        return res.status(200).json(WifiLogs)
      })
    } else {
      await Memory.MemoryLogs.find({
        timestamp: {
          $gte: startTimeStamp,
          $lte: endTimeStamp,
        },
      }).exec(function (err, WifiLogs) {
        return res.status(200).json(WifiLogs)
      })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
