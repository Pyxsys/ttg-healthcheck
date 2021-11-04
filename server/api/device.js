const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth.js')

// signup
router.post('/register', async (req, res) => {
  try {
    const role = 'user'
    const { name, password, email } = req.body
    newUser = new User({
      name,
      password,
      email,
      role,
    })
    const salt = await bcrypt.genSalt(10)
    // Hash password
    newUser.password = await bcrypt.hash(password, salt)
    // check if email already in use
    let user = await User.findOne({ email: email })
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }
    // save new user, create JWT, store in cookie and send to front-end
    await newUser.save()
    const token = jwt.sign({ id: newUser.id }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: '1h',
    })
    return res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json({
        message: 'Registered successfully',
        user: { name: name, role: role },
      })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
