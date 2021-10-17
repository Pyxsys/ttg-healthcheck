const mongoose = require('mongoose')

const wifiUsageSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
  },
  send_speed: {
    type: Number,
  },
  receive_speed: {
    type: Number,
  },
  signal_strength: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
})

module.exports = WifiUsage = mongoose.model('wifi_usage', wifiUsageSchema)
