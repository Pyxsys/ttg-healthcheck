const mongoose = require('mongoose')

const resetPasswordSchema = new mongoose.Schema({
  key: String,
  userId: String,
  timestamp: {
    type: Date,
    default: Date.now(),
    expires: 1*60*20, // 20 mins
  }
})

const ResetPassword = mongoose.model('reset_password', resetPasswordSchema)
module.exports = ResetPassword
