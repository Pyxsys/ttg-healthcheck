const mongoose = require('mongoose')

const hardwareSchema = new mongoose.Schema({
  hardware_name: {
    type: String,
  },
})

module.exports = Hardware = mongoose.model('hardware', hardwareSchema)
