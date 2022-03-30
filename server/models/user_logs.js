const mongoose = require('mongoose')

const userLogschema = new mongoose.Schema({
  userId: String,
  timestamp: { type: Date, expires: 240, default: Date.now },
  event: String,
  message: String,
})

const userLog = mongoose.model('user_logs', userLogschema)
module.exports = userLog
