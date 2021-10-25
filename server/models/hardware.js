const mongoose = require('mongoose')

const HardwareSchema = new mongoose.Schema({
  hardwareName: {
    type: String,
  },
})

module.exports = { HardwareSchema: HardwareSchema }
