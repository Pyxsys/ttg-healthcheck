const express = require('express')
const router = express.Router()
const { filterData, filterTimestampQuery } = require('./common/filter')
const auth = require('../middleware/auth.js')
const DeviceLogs = require('../models/device_logs.js')

// get device Logs with any attribute of the DeviceLogs Model
router.get('/', auth, async (req, res) => {
  const [query, options] = filterData(Object(req.query))
  const results = await DeviceLogs.find({ $and: [query] }, {}, options)
  return res.status(200).json({ Results: results })
})

// get device Logs with any attribute of the DeviceLogs Model and within a timestamp (startTimeStamp, endTimeStamp)
router.get('/timestamp', auth, async (req, res) => {
  try {
    const [query, options] = filterTimestampQuery(Object(req.query))
    const results = await DeviceLogs.find(query, {}, options)
    return res.status(200).json({ Results: results })
  } catch (err) {
    return res.status(501).send('Server Error: ' + err.message)
  }
})

// get latest device logs from a list of device Ids
router.get('/latest', auth, async (req, res) => {
  const query = Object(req.query)
  
  // If query does not have Ids attribute
  if (!query.Ids) {
    return res.status(501).json({ Results: [] })
  }

  const idsArray = String(query.Ids).split(',')
  const results = await Promise.all(idsArray.map(async id => {
    const res = await DeviceLogs.find({deviceId: id}, {}, {limit: 1, sort: {timestamp: [-1]}})
    return res.length > 0 ? res[0] : null
  }));
  const nonEmptyResults = results.filter(deviceLog => deviceLog)

  return res.status(200).json({ Results: nonEmptyResults })
})

module.exports = router
