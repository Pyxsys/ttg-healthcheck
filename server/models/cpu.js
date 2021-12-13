const mongoose = require('mongoose')

const CpuStaticSchema = new mongoose.Schema({
  baseSpeed: Number,
  sockets: Number,
  cores: Number,
  processors: Number,
  cacheSizeL1: Number,
  cacheSizeL2: Number,
  cacheSizeL3: Number,
})

const CpuDynamicSchema = new mongoose.Schema({
  usageSpeed: Number,
  numProcesses: Number,
  threadsSleeping: Number,
  aggregatedPercentage: Number,
})

const CpuProcessSchema = new mongoose.Schema({
  usagePercentage: Number,
})

module.exports = {
  CpuStaticSchema,
  CpuDynamicSchema,
  CpuProcessSchema,
}
