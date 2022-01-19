const express = require('express')
const router = express.Router()
const { parseQuery, getAttributes } = require('./common/filter')
const auth = require('../middleware/auth.js')
const { DeviceLogs, DeviceLogsSchema } = require('../models/device_logs')

const CpuProjection = {
  _id: 0,
  deviceId: 1,
  ...getAttributes(DeviceLogsSchema)
    .filter((name) => name.startsWith('cpu.'))
    .reduce((obj, name) => ({ ...obj, [name]: 1 }), {}),
}

// get CPU Logs with any attribute of the CpuLogs Model
router.get('/', auth, async (req, res) => {
  const [query, options] = parseQuery(Object(req.query), DeviceLogsSchema)
  const results = await DeviceLogs.find(
    { $and: [query] },
    CpuProjection,
    options
  )
  const cpuResponse = { Results: results }
  if (req.query.Total) {
    cpuResponse.Total = await DeviceLogs.countDocuments(query)
  }
  return res.status(200).json(cpuResponse)
})

module.exports = router
