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
  processes: ProcessSchema,
})

const CpuLogs = mongoose.model('cpu_logs', CpuLogsSchema)

async function processCpuLogInfo(payload) {
  //load values
  const { deviceId, timestamp, processes } = payload

  //compute values
  const usagePercentage = 0
  const usageSpeed = 0
  const numProcesses = processes.length
  const threadsAlive = 0
  const threadsSleeping = 0
  const uptime = 0
  const newProcesses = new Processes({ processes })

  return new CpuLogs({
    deviceId,
    usagePercentage,
    usageSpeed,
    numProcesses,
    threadsAlive,
    threadsSleeping,
    uptime,
    timestamp,
    processes: newProcesses,
  })
}

module.exports = {
  CpuSchema: CpuSchema,
  CpuLogsSchema: CpuLogsSchema,
  CpuLogs: CpuLogs,

  processCpuLogInfo: processCpuLogInfo,
}
