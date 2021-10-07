/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')

// signup
router.post('/', async (req, res) => {
  try {
    const { name, password, email, role } = req.body
    newUser = new User({
      name,
      password,
      email,
      role,
    })
    await newUser.save()
    res.send(newUser)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
