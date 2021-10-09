/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// signup
router.post('/register', async (req, res) => {
  try {
    const role = 'none'
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
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
    }
    // save new user, create JWT, store in cookie and send to front-end
    await newUser.save()
    const token = jwt.sign(
      { name: name, role: role },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: '1h',
      }
    )
    return res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json({ message: 'Registered successfully' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    // Verify email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Email does not exist' }] })
    }
    // Verify pw matches ( pw against encrypted pw)
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Password' }] })
    }
    // Create JWT, store in cookie and send to front-end
    const token = jwt.sign(
      { name: user.name, role: user.role },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: '1h',
      }
    )
    return res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json({ message: 'Logged in' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// log out user
router.get('/logout', (req, res) => {
  return res
    .clearCookie('access_token')
    .status(200)
    .json({ message: 'Successfully logged out' })
})

module.exports = router
