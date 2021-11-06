const mongoose = require('mongoose')

const ProcessSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  pid: {
    type: Number,
  },
  status: {
    type: String,
  },
  cpu_percent: {
    type: Number,
  },
})

module.exports = {
  ProcessSchema: ProcessSchema,
}
