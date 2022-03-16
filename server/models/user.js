const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  },
})

const User = mongoose.model('user', userSchema)
module.exports = User
