const mongoose = require('mongoose')
const { CpuProcessSchema } = require('./cpu')
const { MemoryProcessSchema } = require('./memory')

const ProcessSchema = new mongoose.Schema({
  name: String,
  pid: Number,
  status: String,
  cpu: CpuProcessSchema,
  memory: MemoryProcessSchema,
})

module.exports = {
  ProcessSchema: ProcessSchema,
}
