const express = require('express')
const router = express.Router()
const Disk = require('../models/disk.js')

// String attributes list to check with req.query object
const stringAttributes = ['orderBy', 'deviceId', 'timestamp']

// Number attributes list to check with req.query object
const numberAttributes = [
  'limit',
  'orderValue',
  'activeTimePercent',
  'responseTime',
  'readSpeed',
  'writeSpeed',
]

// get X number of entries for single device (limit, deviceId)
router.get('/specific-device', async (req, res) => {
  try {
    let limit = req.query.limit
    const id = String(req.query.deviceId)
    let query = { deviceId: id }
    if (limit) {
      limit = parseInt(limit)
    }
    await Disk.DiskLogs.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec(function (err, diskLogs) {
        return res.status(200).json(diskLogs)
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
      await Disk.DiskLogs.find({
        deviceId: optionalId,
        timestamp: {
          $gte: startTimeStamp,
          $lte: endTimeStamp,
        },
      }).exec(function (err, diskLogs) {
        return res.status(200).json(diskLogs)
      })
    } else {
      await Disk.DiskLogs.find({
        timestamp: {
          $gte: startTimeStamp,
          $lte: endTimeStamp,
        },
      }).exec(function (err, diskLogs) {
        return res.status(200).json(diskLogs)
      })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// get multiple entries given an attribute with the ability to add a limit and order by filter
router.get('/specific-attribute', async (req, res) => {
  try {
    let options = {}
    let query = {}
    let queryObj = Object(req.query)
    for (let k in queryObj) {
      queryObj[k] = queryObj[k].split(',')
      if (stringAttributes.includes(k)) {
        query[String(k)] = queryObj[k]
      }
      if (numberAttributes.includes(k)) {
        query[String(k)] = queryObj[k].map(Number)
      }
    }
    if (query.limit) {
      options.limit = query.limit
      delete query.limit
    }
    if (query.orderBy) {
      var orderBy = query.orderBy
      delete query.orderBy
    }
    if (query.orderValue) {
      var orderValue = query.orderValue
      delete query.orderValue
    }
    if (orderValue && orderBy) {
      options.sort = {
        [orderBy]: orderValue,
      }
    }
    await Disk.DiskLogs.find({ $and: [query] }, {}, options).exec(
      (err, diskLogs) => {
        return res.status(200).json(diskLogs)
      }
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
