const mongoose = require('mongoose')

const cpuUsageSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
  },
  usage_percentage: {
    type: Number,
  },
  usage_speed: {
    type: Number,
  },
  num_processes: {
    type: Number,
  },
  threads_alive: {
    type: Number,
  },
  threads_sleeping: {
    type: Number,
  },
  uptime: {
    type: Number,
  },
  timestamp: {
    type: Date,
  },
})

module.exports = CpuUsage = mongoose.model('cpu_usage', cpuUsageSchema)
