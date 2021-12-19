const mongoose = require('mongoose')
const { CpuStaticSchema } = require('./cpu')
const { DiskStaticSchema } = require('./disk')
const { HardwareStaticSchema } = require('./hardware')
const { MemoryStaticSchema } = require('./memory')
const { WifiStaticSchema } = require('./wifi')

const DeviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  name: String,
  description: String,
  connectionType: String,
  status: String,
  provider: String,
  hardware: HardwareStaticSchema,
  cpu: CpuStaticSchema,
  memory: MemoryStaticSchema,
  disk: DiskStaticSchema,
  wifi: WifiStaticSchema,
})

const Devices = mongoose.model('devices', DeviceSchema)

module.exports = { Devices, DeviceSchema }
