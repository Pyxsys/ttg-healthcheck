const express = require('express')
const router = express.Router()
const Cpu = require('../models/cpu.js')
const { filterData } = require('./shared/filter')
const auth = require('../middleware/auth.js')

// get X number of entries for single device (limit, deviceId)
router.get('/specific-device', auth, async (req, res) => {
  try {
    let limit = req.query.limit
    const id = String(req.query.deviceId)
    let query = { deviceId: id }
    if (limit) {
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

// get multiples entries within a timestamp ( optionalId, startTimeStamp, endTimeStamp)
router.get('/timestamp', auth, async (req, res) => {
  try {
    let optionalId = req.query.deviceId
    const startTimeStamp = String(req.query.startTimeStamp)
    const endTimeStamp = String(req.query.endTimeStamp)
    if (optionalId) {
      optionalId = String(req.query.deviceId)
      await Cpu.CpuLogs.find({
        deviceId: optionalId,
        timestamp: {
          $gte: startTimeStamp,
          $lte: endTimeStamp,
        },
      }).exec(function (err, cpuLogs) {
        return res.status(200).json(cpuLogs)
      })
    } else {
      await Cpu.CpuLogs.find({
        timestamp: {
          $gte: startTimeStamp,
          $lte: endTimeStamp,
        },
      }).exec(function (err, cpuLogs) {
        return res.status(200).json(cpuLogs)
      })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// get multiple entries given an attribute with the ability to add a limit and order by filter
router.get('/specific-attribute', auth, async (req, res) => {
  try {
    let [query, options] = filterData(req.query)
    await Cpu.CpuLogs.find({ $and: [query] }, {}, options).exec(
      (err, cpuLogs) => {
        return res.status(200).json(cpuLogs)
      }
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
