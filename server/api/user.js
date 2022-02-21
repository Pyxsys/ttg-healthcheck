/* eslint-disable new-cap */
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
    const newUser = new User({
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
        user: { _id: newUser._id, name: name, role: role },
      })
  } catch (err) {
    res.status(500).send('Server Error: ' + err.message)
  }
})

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    // Verify email
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(400).json({ message: 'Email does not exist' })
    }
    // Verify pw matches ( pw against encrypted pw)
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Password' })
    }
    // Create JWT, store in cookie and send to front-end
    const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: '1h',
    })
    return res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json({
        message: 'Logged in',
        user: { _id: user._id, name: user.name, role: user.role },
      })
  } catch (err) {
    res.status(500).send('Server Error: ' + err.message)
  }
})

// verify authentication
router.get('/authenticate', auth, async (req, res) => {
  const user = await User.findOne({ _id: req.userId })
  return res.status(200).json({
    isAuthenticated: true,
    user: { _id: user._id, name: user.name, role: user.role },
  })
})

// log out user
router.get('/logout', auth, (req, res) => {
  return res
    .clearCookie('access_token')
    .status(200)
    .json({ message: 'Successfully logged out' })
})

// delete user
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId })
    const email = String(req.params.id)
    // check admin role
    if (user.role == 'admin') {
      // verify email
      await User.deleteOne({ email: email })
      // delete user
      return res.status(200).json({
        message: 'User deleted successfully',
      })
    }
  } catch (err) {
    res.status(500).send('Server error')
  }
})

module.exports = router
