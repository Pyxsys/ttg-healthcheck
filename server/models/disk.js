const mongoose = require('mongoose')

const DiskSchema = new mongoose.Schema({
  capacity: {
    type: Number,
  },
  type: {
    type: String,
  },
})

const DiskLogsSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  activeTimePercent: {
    type: Number,
  },
  responseTime: {
    type: Number,
  },
  readSpeed: {
    type: Number,
  },
  writeSpeed: {
    type: Number,
  },
  timestamp: {
    type: Date,
  },
})

const DiskLogs = mongoose.model('disk_logs', DiskLogsSchema)

module.exports = {
  DiskSchema: DiskSchema,
  DiskLogsSchema: DiskLogsSchema,
  DiskLogs: DiskLogs,
}
