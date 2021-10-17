const mongoose = require('mongoose')

const memoryUsageSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
  },
  usage_percentage: {
    type: Number,
  },
  in_use: {
    type: Number,
  },
  available: {
    type: Number,
  },
  cached: {
    type: Number,
  },
  paged_pool: {
    type: Number,
  },
  non_paged_pool: {
    type: Number,
  },
  timestamp: {
    type: Date,
  },
})

module.exports = MemoryUsage = mongoose.model('memory_usage', memoryUsageSchema)
