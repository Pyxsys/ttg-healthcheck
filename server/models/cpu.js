const mongoose = require('mongoose')
const { ProcessSchema, Processes } = require('./process')

const CpuSchema = new mongoose.Schema({
  baseSpeed: {
    type: Number,
  },
  sockets: {
    type: Number,
  },
  cores: {
    type: Number,
  },
  processors: {
    type: Number,
  },
  cahceSizeL1: {
    type: Number,
  },
  cahceSizeL2: {
    type: Number,
  },
  cahceSizeL3: {
    type: Date,
  },
})

const CpuLogsSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  usagePercentage: {
    type: Number,
  },
  usageSpeed: {
    type: Number,
  },
  numProcesses: {
    type: Number,
  },
  threadsAlive: {
    type: Number,
  },
  threadsSleeping: {
    type: Number,
  },
  uptime: {
    type: Number,
  },
  timestamp: {
    type: Date,
  },
  processes: [ProcessSchema],
})

const CpuLogs = mongoose.model('cpu_logs', CpuLogsSchema)

module.exports = {
  CpuSchema: CpuSchema,
  CpuLogsSchema: CpuLogsSchema,
  CpuLogs: CpuLogs,
}
