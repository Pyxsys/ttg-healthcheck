const mongoose = require('mongoose')
const { ProcessSchema } = require('./process')

const DeviceLogsSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
  },
  processes: [ProcessSchema],
})

const DeviceLogs = mongoose.model('device_logs', DeviceLogsSchema)

module.exports = DeviceLogs
