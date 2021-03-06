const express = require('express')
const router = express.Router()
const { parseQuery } = require('./common/filter')
const auth = require('../middleware/auth.js')
const { DeviceLogs, DeviceLogsSchema } = require('../models/device_logs.js')

// get device Logs with any attribute of the DeviceLogs Model
router.get('/', auth, async (req, res) => {
  const [query, options] = parseQuery(Object(req.query), DeviceLogsSchema)
  const results = await DeviceLogs.find({ $and: [query] }, {}, options)
  const deviceLogsResponse = { Results: results }
  if (req.query.Total) {
    deviceLogsResponse.Total = await DeviceLogs.countDocuments(query)
  }
  return res.status(200).json(deviceLogsResponse)
})

router.get('/afterDate', auth, async (req, res) => {
  const query = Object(req.query)
  const addDaysToToday = (i) => {
    let date1 = new Date();
    let date2 = new Date();
    date2.setDate(date1.getDate() + i)
    return date2
  }
  // If query does not have Ids attribute
  if (!query.Ids) {
    if (query.Ids === undefined) {
      return res.status(200).json({ Results: [] })
    }
  }

  const idsArray = String(query.Ids).split(',')
  const results = await Promise.all(
    idsArray.map(async (id) => {
      const devices = await DeviceLogs.find(
        { deviceId: id, timestamp: { $gte: addDaysToToday(-query.days) } },
        {},
        { sort: { timestamp: [-1] } }
      )
      return devices.length > 0 ? devices : null
    })
  )
  const nonEmptyResults = results.filter((deviceLog) => deviceLog)

  return res.status(200).json({ Results: nonEmptyResults })
})

module.exports = router
