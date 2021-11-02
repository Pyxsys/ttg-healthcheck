const express = require('express')
const router = express.Router()
const Cpu = require('../models/cpu.js')

// get X number of entries for single device
router.get('/specific-device', async (req, res) => {
  try {
    let limit = req.query.limit
    const id = req.query.deviceId
    let query = { deviceId: parseInt(id) }
    if (!!limit) {
      limit = parseInt(limit)
    }
    await Cpu.CpuLogs.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec(function (err, cpuLogs) {
        return res.status(200).json(cpuLogs)
      })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// get multiples entries within a timestamp
router.get('/timestamp', async (req, res) => {
  try {
    const optionalId = String(req.query.deviceId)
    const startTimeStamp = Date(req.query.startTimeStamp)
    const endTimeStamp = Date(req.query.endTimeStamp)
    if (optionalId) {
      await Cpu.CpuLogs.find({
        deviceId: optionalId,
        timestamp: {
          $gte: startTimeStamp,
          $lte: endTimeStamp,
        },
      }).exec(function (err, WifiLogs) {
        return res.status(200).json(WifiLogs)
      })
    } else {
      await Cpu.CpuLogs.find({
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
