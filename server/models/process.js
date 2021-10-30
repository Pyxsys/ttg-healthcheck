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

module.exports = {
  ProcessSchema: ProcessSchema,
}
