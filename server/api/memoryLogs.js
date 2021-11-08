const express = require('express')
const router = express.Router()
const Memory = require('../models/memory.js')
const { filterData } = require('./shared/filter')
const auth = require('../middleware/auth.js')

// get X number of entries for single device (limit, deviceId)
router.get('/specific-device', auth, async (req, res) => {
  try {
    if (!req.query.deviceId) {
      throw new Error('DeviceId not found')
    }
    let limit = req.query.limit
    const id = String(req.query.deviceId)
    let query = { deviceId: id }
    if (limit) {
      limit = parseInt(limit)
    }
    await Memory.MemoryLogs.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec(function (err, memoryLogs) {
        return res.status(200).json(memoryLogs)
      })
  } catch (err) {
    res.status(500).send('Server Error ' + err.message)
  }
})

// get multiples entries within a timestamp ( optionalId, startTimeStamp, endTimeStamp)
router.get('/timestamp', auth, async (req, res) => {
  try {
    let optionalId = req.query.deviceId
    if (!req.query.startTimeStamp || !req.query.endTimeStamp) {
      throw new Error('StartTimeStamp or endTimestamp not found')
    }

    const startTimeStamp = String(req.query.startTimeStamp)
    const endTimeStamp = String(req.query.endTimeStamp)
    if (optionalId) {
      optionalId = String(req.query.deviceId)
      await Memory.MemoryLogs.find({
        deviceId: optionalId,
        timestamp: {
          $gte: startTimeStamp,
          $lte: endTimeStamp,
        },
      }).exec(function (err, memoryLogs) {
        return res.status(200).json(memoryLogs)
      })
    } else {
      await Memory.MemoryLogs.find({
        timestamp: {
          $gte: startTimeStamp,
          $lte: endTimeStamp,
        },
      }).exec(function (err, memoryLogs) {
        return res.status(200).json(memoryLogs)
      })
    }
  } catch (err) {
    res.status(500).send('Server Error ' + err.message)
  }
})

// get multiple entries given an attribute with the ability to add a limit and order by filter
router.get('/specific-attribute', auth, async (req, res) => {
  let [query, options] = filterData(req.query)
  await Memory.MemoryLogs.find({ $and: [query] }, {}, options).exec(
    (err, memoryLogs) => {
      return res.status(200).json(memoryLogs)
    }
  )
})

module.exports = router
