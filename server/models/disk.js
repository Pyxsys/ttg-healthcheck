const mongoose = require('mongoose')

const diskSchema = new mongoose.Schema({
  capacity: {
    type: Number,
  },
  type: {
    type: String,
  },
})

module.exports = Disk = mongoose.model('disk', diskSchema)
