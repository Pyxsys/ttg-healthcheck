const express = require('express')
const router = express.Router()
const Cpu = require('../models/cpu.js')
const { filterData, validateTimestamp } = require('./shared/filter')
const auth = require('../middleware/auth.js')

// get multiple entries given an attribute with the ability to add a limit and order by filter
router.get('/', auth, async (req, res) => {
  const [query, options] = filterData(req.query)
  const results = await Cpu.CpuLogs.find({ $and: [query] }, {}, options)
  return res.status(200).json({ Results: results })
})

// get multiples entries within a timestamp (startTimeStamp, endTimeStamp)
router.get('/timestamp', auth, async (req, res) => {
  try {
    validateTimestamp(req.query.startTimeStamp, req.query.endTimeStamp)
  } catch (err) {
    return res.status(501).send('Server Error: ' + err.message)
  }
  const startTimeStamp = String(req.query.startTimeStamp)
  const endTimeStamp = String(req.query.endTimeStamp)

  const [filteredQuery, options] = filterData(req.query)

  const query = {
    ...filteredQuery,
    timestamp: {
      $gte: startTimeStamp,
      $lte: endTimeStamp,
    },
  }

  const results = await Cpu.CpuLogs.find(query, {}, options)
  return res.status(200).json({ Results: results })
})

module.exports = router
