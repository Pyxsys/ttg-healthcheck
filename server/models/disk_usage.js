const mongoose = require('mongoose')

const diskUsageSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
  },
  active_time_percent: {
    type: Number,
  },
  response_time: {
    type: Number,
  },
  read_speed: {
    type: Number,
  },
  write_speed: {
    type: Number,
  },
  timestamp: {
    type: Date,
  },
})

module.exports = DiskUsage = mongoose.model('disk_usage', diskUsageSchema)
