const mongoose = require('mongoose')

const wifiSchema = new mongoose.Schema({
  adapter_name: {
    type: String,
  },
  SSID: {
    type: String,
  },
  connection_type: {
    type: String,
  },
  ipv4_address: {
    type: String,
  },
  ipv6_address: {
    type: String,
  },
})

module.exports = Wifi = mongoose.model('wifi', wifiSchema)
