const mongoose = require('mongoose')

const memorySchema = new mongoose.Schema({
  max_size: {
    type: Number,
  },
  form_factor: {
    type: String,
  },
})

module.exports = Memory = mongoose.model('memory', memorySchema)
