const mongoose = require('mongoose')

const ProcessSchema = new mongoose.Schema({
  processes: [
    {
      name: String,
      pid: Number,
    },
  ],
})

module.exports = Processes = mongoose.model('processes', ProcessSchema)
