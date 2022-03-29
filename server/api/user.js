/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth.js')

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  // Hash password
  return bcrypt.hash(password, salt)
}

// signup
router.post('/register', async (req, res) => {
  try {
    const role = 'disabled'
    const avatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    const { name, password, email } = req.body
    const newUser = new User({
      name,
      password,
      email,
      role,
      avatar,
    })
    newUser.password = await encryptPassword(password)
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
        user: { _id: newUser._id, name: name, role: role, avatar: avatar },
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
        user: {
          _id: user._id,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        },
      })
  } catch (err) {
    res.status(500).send('Server Error: ' + err.message)
  }
})

// log out user
router.get('/logout', auth, (req, res) => {
  return res
    .clearCookie('access_token')
    .status(200)
    .json({ message: 'Successfully logged out' })
})

// verify authentication
router.get('/authenticate', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId })
    return res.status(200).json({
      isAuthenticated: true,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    })
  } catch (err) {
    res.status(501).send('Server Error: ' + err.message)
  }
})

// get all users for admin panel
router.get('/all', auth, async (req, res) => {
  const user = await User.findOne({ _id: req.userId })
  if (user.role === 'admin') {
    const results = await User.find(
      {},
      {
        _id: 1,
        name: 1,
        email: 1,
        role: 1,
        avatar: 1,
      }
    )
    return res.status(200).json({ Results: results, Total: results.length })
  }
  return res.status(401).send('Unauthorized access')
})

// get user profile
router.get('/profile', auth, async (req, res) => {
  const user = await User.findOne({ _id: req.userId })
  const query = Object(req.query)
  if (!query.userId) {
    return res.status(400).send('Bad request, no userId provided')
  }

  if (user.role === 'disabled' || (user.role === 'user' && String(user._id) !== query.userId)) {
    return res.status(401).send('Unauthorized access')
  }
  const results = await User.findOne(
    { _id: query.userId },
    {
      _id: 1,
      name: 1,
      email: 1,
      role: 1,
      avatar: 1,
    }
  )
  return res.status(200).json({ Results: results, Total: results.length })
})

// delete user
router.delete('/delete/:id', auth, async (req, res) => {
  const loggedUser = await User.findOne({ _id: req.userId })
  // user or disabled can only delete if their id matches url id
  if(loggedUser.role === 'disabled' || (loggedUser.role === 'user' && String(loggedUser._id) !== req.params.id)) {
    return res.status(401).send('Unauthorized access')
  } 

  // If deleting admin and there are no other admins
  const numOfOtherAdmins = await User.count({role: 'admin', _id: {$not: {$eq: req.params.id}}})
  if (numOfOtherAdmins === 0) {
    return res.status(400).send('Cannot delete, a minimum of 1 admin role is required')
  }

  await User.deleteOne({ _id: req.params.id })

  // if deleting yourself, remove cookie
  if(req.params.id === String(loggedUser._id)){
    return res
      .clearCookie('access_token')
      .status(200)
      .json({message: 'User deleted successfully',})
  } else {
    return res.status(200).json({
      message: 'User deleted successfully',
    })
  }
})

// edit user profile information
router.post('/editUserProfileInfo', auth , async (req, res) => {
  try {
    const { email, name, role, _id, avatar} = Object(req.body.formData)
    const loggedUser = await User.findOne({ _id: req.userId });
    if (!loggedUser) {
      return res.status(404).send('User not found')
    }

    // Disabled and Users cannot edit other profiles
    if(loggedUser.role === 'disabled' || (loggedUser.role === 'user' && String(loggedUser._id) !== _id)) {
      return res.status(401).send('Unauthorized access')
    }

    // If email or name is empty
    if (!email || !name){
      return res.status(400).send(`${!email ? 'Email' : 'Name'} cannot be empty`)
    }

    // Email exists for another user
    const emailExist = await User.count({email: email, _id: {$not: {$eq: _id}}})
    if (emailExist > 0) {
      return res.status(400).send('Email already exists')
    }

    // If changing to non-admin and there are no other admins
    const numOfOtherAdmins = await User.count({role: 'admin', _id: {$not: {$eq: _id}}})
    if (role !== 'admin' && numOfOtherAdmins === 0) {
      return res.status(400).send('Cannot change role, a minimum of 1 admin role is required')
    }

    // Update desired user
    await User.findOneAndUpdate({_id: _id}, {email: email, name: name, avatar: avatar, role: role})
    return res.status(200).json({
      message: 'Update successful',
      user: {_id: String(loggedUser._id), name: loggedUser.name, role: loggedUser.role, avatar: loggedUser.avatar}
    });
  } catch (err) {
    res.status(500).send('Server Error: ' + err.message)
  }
})

// edit user profile information
router.post('/editUserProfilePassword', auth , async (req, res) => {
  try {
    const { oldPassword, newPassword , newPassword1, _id } = Object(req.body.formData);
    // Verify found user
    const loggedUser = await User.findOne({ _id: req.userId });
    if (!loggedUser) {
      return res.status(404).send('User not found')
    }

    // users can only update their password
    if(loggedUser.role === 'disabled' || (loggedUser.role === 'user' && String(loggedUser._id) !== _id)) {
      return res.status(401).send('Unauthorized Access')
    }

    // check if both new password matches
    if (newPassword !== newPassword1){
      return res.status(400).send('New password and confirm password do not match')
    }

    // If password is incorrect
    if(!newPassword) {
      return res.status(400).send('password cannot be empty')
    }

    // Check if old password matches the one saved in db
    const isMatch = await bcrypt.compare(oldPassword, loggedUser.password)
    if (loggedUser.role === 'user' && !isMatch) {
      return res.status(400).send('Old password is incorrect')
    }

    const encryptedPassword = await encryptPassword(newPassword)
    await User.findOneAndUpdate({_id: _id}, {password: encryptedPassword})
    return res.status(200).json({
      message: 'Update successful',
      user: {_id: String(loggedUser._id), name: loggedUser.name, role: loggedUser.role, avatar: loggedUser.avatar}
    });

  } catch (err) {
    return res.status(500).send('Server Error: ' + err.message)
  }
})

module.exports = router
