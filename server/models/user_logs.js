const mongoose = require('mongoose')

const userLogschema = new mongoose.Schema({
  timestamp: { type: Date, expires: 540, default: Date.now },
  userPerformingAction: String,
  affectedUser: String,
  event: String,
  description: String,
})

const userLog = mongoose.model('user_logs', userLogschema)
module.exports = userLog
