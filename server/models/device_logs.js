const mongoose = require('mongoose')
const { CpuDynamicSchema } = require('./cpu')
const { DiskDynamicSchema } = require('./disk')
const { MemoryDynamicSchema } = require('./memory')
const { ProcessSchema } = require('./process')
const { WifiDynamicSchema } = require('./wifi')
const { PeripheralSchema } = require('./peripheral')

const DeviceLogsSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  cpu: CpuDynamicSchema,
  memory: MemoryDynamicSchema,
  disk: DiskDynamicSchema,
  wifi: WifiDynamicSchema,
  processes: [ProcessSchema],
  peripherals: [PeripheralSchema],
})

const DeviceLogs = mongoose.model('device_logs', DeviceLogsSchema)

module.exports = { DeviceLogs, DeviceLogsSchema }
