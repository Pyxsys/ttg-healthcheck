const mongoose = require('mongoose')

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
  cacheSizeL1: {
    type: Number,
  },
  cacheSizeL2: {
    type: Number,
  },
  cacheSizeL3: {
    type: Number,
  },
})

const CpuProcessSchema = new mongoose.Schema({
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
})

module.exports = {
  CpuSchema: CpuSchema,
  CpuProcessSchema: CpuProcessSchema,
}
