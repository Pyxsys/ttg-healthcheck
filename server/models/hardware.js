const mongoose = require('mongoose')

const HardwareStaticSchema = new mongoose.Schema({
  hardwareName: String,
})

module.exports = { HardwareStaticSchema }
