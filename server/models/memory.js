const mongoose = require('mongoose')

const MemorySchema = new mongoose.Schema({
  maxSize: {
    type: Number,
  },
  formFactor: [
    {
      type: String,
    },
  ],
})

const MemoryLogsSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  usagePercentage: {
    type: Number,
  },
  inUse: {
    type: Number,
  },
  available: {
    type: Number,
  },
  free: {
    type: Number,
  },
  cached: {
    type: Number,
  },
  timestamp: {
    type: Date,
  },
})

const MemoryLogs = mongoose.model('memory_logs', MemoryLogsSchema)

module.exports = {
  MemorySchema: MemorySchema,
  MemoryLogsSchema: MemoryLogsSchema,
  MemoryLogs: MemoryLogs,
}
