const mongoose = require('mongoose')

const cpuSchema = new mongoose.Schema({
  base_speed: {
    type: Number,
  },
  sockets: {
    type: Number,
  },
  cores: {
    type: Number,
  },
  processors: {
    type: Number,
  },
  cahce_size_L1: {
    type: Number,
  },
  cahce_size_L2: {
    type: Number,
  },
  cahce_size_L3: {
    type: Date,
  },
})

module.exports = Cpu = mongoose.model('cpu', cpuSchema)
