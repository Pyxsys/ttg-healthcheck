const mongoose = require('mongoose')
const { HardwareSchema } = require('./hardware')
const { CpuSchema } = require('./cpu')
const { DiskSchema } = require('./disk')
const { MemorySchema } = require('./memory')
const { WifiSchema } = require('./wifi')

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
