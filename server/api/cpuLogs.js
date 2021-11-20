const express = require('express')
const router = express.Router()
const Cpu = require('../models/cpu.js')
const { filterData, filterTimestampQuery } = require('./shared/filter')
const auth = require('../middleware/auth.js')

// get CPU Logs with any attribute of the CpuLogs Model
router.get('/', auth, async (req, res) => {
  const [query, options] = filterData(Object(req.query))
  const results = await Cpu.CpuLogs.find({ $and: [query] }, {}, options)
  return res.status(200).json({ Results: results })
})

// get CPU Logs with any attribute of the CpuLogs Model and within a timestamp (startTimeStamp, endTimeStamp)
router.get('/timestamp', auth, async (req, res) => {
  try {
    const [query, options] = filterTimestampQuery(Object(req.query))
    const results = await Cpu.CpuLogs.find(query, {}, options)
    return res.status(200).json({ Results: results })
  } catch (err) {
    return res.status(501).send('Server Error: ' + err.message)
  }
})

module.exports = router
