const mongoose = require('mongoose')

const piDeviceSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  connection_type: {
    type: String,
  },
  status: {
    type: String,
  },
  provider: {
    type: String,
  },
  hardware_id: {
    type: String,
  },
  cpu_id: {
    type: String,
  },
  memory_id: {
    type: String,
  },
  disk_id: {
    type: String,
  },
  wifi_id: {
    type: String,
  },
})

module.exports = PiDevice = mongoose.model('pi_device', piDeviceSchema)
