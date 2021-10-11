/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()

// receive report from daemon
router.post('/', async (req, res) => {
  try {
    res.status(200).send()
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
