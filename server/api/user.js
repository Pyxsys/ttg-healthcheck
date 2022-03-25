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
  try {
    const user = await User.findOne({ _id: req.userId })
    let results
    user.role == 'admin'
      ? ((results = await User.find(
          {},
          {
            _id: 1,
            name: 1,
            email: 1,
            role: 1,
            avatar: 1,
          }
        )),
        res.status(200).json({ Results: results, Total: results.length }))
      : res.status(401).send('No admin privileges')
  } catch (err) {
    res.status(501).send('Server Error: ' + err.message)
  }
})

// get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId })
    const query = Object(req.query)
    let results
    query.userId
      ? user.role == 'user' && user._id != query.userId
        ? res.status(401).send('Unauthorized')
        : ((results = await User.findOne(
            { _id: query.userId },
            {
              _id: 1,
              name: 1,
              email: 1,
              role: 1,
              avatar: 1,
            }
          )),
          res.status(200).json({ Results: results }))
      : res.status(400).send('Bad request, no userId provided')
  } catch (err) {
    res.status(501).send('Server Error: ' + err.message)
  }
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
    // user or disabled can only delete if their id matches url id
    if(user.role == 'user' || user.role == 'disabled' && user._id != req.params.id) {
      res.status(401).send('Unauthorized')
    } 
    
    const adminCount = await User.count({ role: 'admin'})

    let deletingUser ;
    if(req.params.id === user._id) {
      deletingUser = user;
    } else {
      deletingUser = await User.findOne({ _id: req.params.id})
    }

    if(deletingUser.role == 'admin' && adminCount >= 2) {
      await User.deleteOne({ email: deletingUser.email })
    } else if (deletingUser.role == 'user' || deletingUser.role == 'disabled') {
      await User.deleteOne({ email: deletingUser.email })
    } else {
      return res.status(404).json({
        message: 'Unauthorized. Require a minimum of 1 admin',
      })
    }

    // if deleting yourself, remove cookie
    if(req.params.id === user._id){
      return res
        .clearCookie('access_token')
        .status(200)
        .json({message: 'User deleted successfully',})
    } else {
      return res.status(200).json({
        message: 'User deleted successfully',
      })
    }
  } catch (err) {
    res.status(500).send('Server error')
  }
})

// edit user profile information
router.post('/editUserProfileInfo', auth , async (req, res) => {
  try {
    const { email, name, role, _id, defaultAvatar} = Object(req.body.formData);
    let {avatar} = Object(req.body.formData);

    // if link is broken, use default avatar
    if (defaultAvatar) {
      avatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    }

    // requester user
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // disabled users are not allowed to edit
    if(user.role == 'disabled') {
      res.status(401).send('Unauthorized')
    } 

    if (email.length == 0){
      return res.status(400).json({ message: 'Email cannot be empty'})
    }

    if (name.length == 0){
      return res.status(400).json({ message: 'Name cannot be empty'})
    }

    // users can only edit their own information
    if(user.role == 'user' && user._id != _id) {
      res.status(401).send('Unauthorized')
    } else if (user.role == 'user') {
      // if email is not the same, check if email already in use
      if (user.email != email) {
        // check if email already in use
        const emailExist = await User.findOne({ email: email })
        if (emailExist) {
          return res.status(400).json({ message: 'Email already exists' })
        }
      }
      user.name = name;
      user.avatar = avatar;
      user.email = email;
      await User.findOneAndUpdate({_id: user._id},user)
      return res.status(200).json({
        message: 'Update successful',
        user: {_id: user._id, name: user.name, role: user.role, avatar: user.avatar}
      });
    } else if (user.role == 'admin') {
      const adminCount = await User.count({ role: 'admin'}) 

      let updatingUser ;
      if(user._id == _id) {
        updatingUser = user;
      } else {
        updatingUser = await User.findOne({ _id: _id})
      }

      if(updatingUser.email != email) { 
        const emailInUse = await User.findOne({ email: email })
        if (emailInUse) {
          return res.status(400).json({ message: 'Email already exists' })
        }
      }

      updatingUser.name = name;
      updatingUser.avatar = avatar;
      updatingUser.email = email;

      if(updatingUser.role == 'admin' && role != 'admin' && adminCount < 2) {
        return res.status(404).json({
          message: 'Unauthorized. Require a minimum of 1 admin role',
        })
      } else {
        updatingUser.role = role; 
      }

      await User.findOneAndUpdate({_id: updatingUser._id},updatingUser)

      return res.status(200).json({
        message: 'Update successful',
        user: {_id: updatingUser._id, name: updatingUser.name, role: updatingUser.role, avatar: updatingUser.avatar}
      });
    }
    } catch (err) {
    res.status(500).send('Server Error: ' + err.message)
  }
})

// edit user profile information
router.post('/editUserProfilePassword', auth , async (req, res) => {
  try {
    const { oldPassword, newPassword , newPassword1, _id } = Object(req.body.formData1);
    // Verify email
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if(oldPassword.length == 0 || newPassword.length == 0 || newPassword1.length == 0) {
      return res.status(400).json({ message: 'Name cannot be empty'})
    }
    // users can only update their password
    if(user.role == 'user' && user._id != _id) {
      res.status(401).send('Unauthorized')
    }

    // disabled users are not allowed to edit
    if(user.role == 'disabled') {
      res.status(401).send('Unauthorized')
    } 

    let updatingUser;
    if (_id === req.userId){
      updatingUser = user
    } else {
      updatingUser = await User.findOne({ _id:_id})
    }

    //if an admin or user is trying to edit their password
    if(updatingUser._id == _id && (req.role == 'admin' || req.role == 'user')) {
      // check if old password matches the one saved in db
      const isMatch = await bcrypt.compare(oldPassword, updatingUser.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Old password mismatch' })
      } 
      // check if new password is different from old password
      if (newPassword === oldPassword) {
        return res.status(400).json({ message: 'New password cannot be the same as the old password' })
      }
    }

    // check if both new password matches
    if (newPassword !== newPassword1){
      return res.status(400).json({ message: 'New passwords do not match'})
    }
    const salt = await bcrypt.genSalt(10)
    // Hash password
    updatingUser.password = await bcrypt.hash(newPassword, salt)

    updateRes = await User.findOneAndUpdate({_id: updatingUser._id}, {password: updatingUser.password})
    return res.status(200).json({
      message: 'Update successful',
      user: {_id: user._id, name: user.name, role: user.role, avatar: user.avatar}
    });

  } catch (err) {
    res.status(500).send('Server Error: ' + err.message)
  }
})

module.exports = router
