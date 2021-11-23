const mongoose = require('mongoose')
const { CpuProcessSchema } = require('./cpu')
const { DiskProcessSchema } = require('./disk')
const { MemoryProcessSchema } = require('./memory')
const { WifiProcessSchema } = require('./wifi')

const ProcessSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  pid: {
    type: Number,
  },
  status: {
    type: String,
  },
  cpu: CpuProcessSchema,
  memory: MemoryProcessSchema,
  disk: DiskProcessSchema,
  wifi: WifiProcessSchema,
})

module.exports = {
  ProcessSchema: ProcessSchema,
}
