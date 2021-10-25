const mongoose = require('mongoose')

const WifiSchema = new mongoose.Schema({
  adapterName: {
    type: String,
  },
  SSID: {
    type: String,
  },
  connectionType: {
    type: String,
  },
  ipv4Address: {
    type: String,
  },
  ipv6Address: {
    type: String,
  },
})

const WifiLogsSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  sendSpeed: {
    type: Number,
  },
  receiveSpeed: {
    type: Number,
  },
  signalStrength: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
})

const WifiLogs = mongoose.model('wifi_logs', WifiLogsSchema)

module.exports = {
  WifiSchema: WifiSchema,
  WifiLogsSchema: WifiLogsSchema,
  WifiLogs: WifiLogs,
}
