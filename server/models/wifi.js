const mongoose = require('mongoose')

const WifiStaticSchema = new mongoose.Schema({
  adapterName: String,
  SSID: String,
  connectionType: String,
  ipv4Address: String,
  ipv6Address: String,
})

const WifiDynamicSchema = new mongoose.Schema({
  sendSpeed: Number,
  receiveSpeed: Number,
  signalStrength: Number,
})

module.exports = {
  WifiStaticSchema,
  WifiDynamicSchema,
}
