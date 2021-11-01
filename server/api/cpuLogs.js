const express = require('express')
const router = express.Router()
const Cpu = require('../models/cpu.js')

// get X number of entries for single device
router.get('/specificDevice', async (req, res) => {
  try {
    const id = req.query.deviceId
    const limit = req.query.limit
    if (!!limit) {
      limit = parseInt(limit)
    }
    await Cpu.CpuLogs.find({ deviceId: id })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec(function (err, cpuLogs) {
        res.status(200).json(cpuLogs)
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
      await Cpu.CpuLogs.find({
        deviceId: optionalId,
        timestamp: {
          $gte: ISODate(startTimeStamp),
          $lte: ISODate(endTimeStamp),
        },
      }).exec(function (err, cpuLogs) {
        res.status(200).json(cpuLogs)
        return
      })
    } else {
      await Cpu.CpuLogs.find({
        timestamp: {
          $gte: ISODate(startTimeStamp),
          $lte: ISODate(endTimeStamp),
        },
      }).exec(function (err, cpuLogs) {
        res.status(200).json(cpuLogs)
        return
      })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})
