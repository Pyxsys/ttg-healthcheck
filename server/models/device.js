const mongoose = require('mongoose')
const { HardwareSchema } = require('./hardware')
const { CpuSchema, CpuLogsSchema } = require('./cpu')
const { DiskSchema, DiskLogsSchema } = require('./disk')
const { MemorySchema, MemoryLogsSchema } = require('./memory')
const { WifiSchema, WifiLogsSchema } = require('./wifi')

const DeviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  connectionType: {
    type: String,
  },
  status: {
    type: String,
  },
  provider: {
    type: String,
  },
  hardware: HardwareSchema,
  cpu: CpuSchema,
  memory: MemorySchema,
  disk: DiskSchema,
  wifi: WifiSchema,
})

module.exports = Devices = mongoose.model('devices', DeviceSchema)
