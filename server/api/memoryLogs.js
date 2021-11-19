const express = require('express')
const router = express.Router()
const Memory = require('../models/memory.js')
const { filterData, filterTimestampQuery } = require('./shared/filter')
const auth = require('../middleware/auth.js')

// get Memory Logs with any attribute of the MemoryLogs Model
router.get('/', auth, async (req, res) => {
  const [query, options] = filterData(req.query)
  const results = await Memory.MemoryLogs.find({ $and: [query] }, {}, options)
  return res.status(200).json({ Results: results })
})

// get Memory Logs with any attribute of the MemoryLogs Model and within a timestamp (startTimeStamp, endTimeStamp)
router.get('/timestamp', auth, async (req, res) => {
  try {
    const [query, options] = filterTimestampQuery(req.query)
    const results = await Memory.MemoryLogs.find(query, {}, options)
    return res.status(200).json({ Results: results })
  } catch (err) {
    return res.status(501).send('Server Error: ' + err.message)
  }
})

module.exports = router
