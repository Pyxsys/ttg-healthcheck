const mongoose = require('mongoose')

const ProcessSchema = new mongoose.Schema({
  processes: [
    {
      name: {
        type: String,
      },
      pid: {
        type: Number,
      },
    },
  ],
})

const Processes = mongoose.model('processes', ProcessSchema)

module.exports = {
  ProcessSchema: ProcessSchema,
  Processes: Processes,
}
