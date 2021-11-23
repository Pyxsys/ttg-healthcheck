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

const WifiProcessSchema = new mongoose.Schema({
  sendSpeed: {
    type: Number,
  },
  receiveSpeed: {
    type: Number,
  },
  signalStrength: {
    type: String,
  },
})

module.exports = {
  WifiSchema: WifiSchema,
  WifiProcessSchema: WifiProcessSchema,
}
