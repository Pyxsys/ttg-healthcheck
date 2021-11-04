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
})

module.exports = {
  ProcessSchema: ProcessSchema,
}
