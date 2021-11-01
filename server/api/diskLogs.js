const express = require('express')
const router = express.Router()
const Disk = require('../models/disk.js')

// get X number of entries for single device
router.get('/specificDevice', async (req, res) => {
  try {
    const id = req.query.deviceId
    const limit = req.query.limit
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
    let optionalId = ''
    const startTimeStamp = req.query.startTimeStamp
    const endTimeStamp = req.query.endTimeStamp
    if (!!query.deviceId) {
      optionalId = query.deviceId
      await Disk.DiskLogs.find({
        deviceId: optionalId,
        timestamp: {
          $gte: ISODate(startTimeStamp),
          $lte: ISODate(endTimeStamp),
        },
      }).exec(function (err, DiskLogs) {
        res.status(200).json(DiskLogs)
        return
      })
    } else {
      await Disk.DiskLogs.find({
        timestamp: {
          $gte: ISODate(startTimeStamp),
          $lte: ISODate(endTimeStamp),
        },
      }).exec(function (err, DiskLogs) {
        res.status(200).json(DiskLogs)
        return
      })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})
