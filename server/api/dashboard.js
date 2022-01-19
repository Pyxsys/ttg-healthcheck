/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.js')
const { Dashboards, DashboardSchema } = require('../models/dashboard.js')
const { parseQuery } = require('./common/filter')

// get multiple devices with param options (limit, multiple attributes, orderBy, orderValue)
router.post('/', auth, async (req, res) => {
  const { userId, widgets } = req.body
  const dashboard = Dashboards.findOne({ userId: userId })
  
  if (!dashboard) {
    return res.status(400).json({ message: 'User does not exist' })
  }
  dashboard.update({}, {dashboardWidgets: widgets})
})

// get multiple devices with param options (limit, multiple attributes, orderBy, orderValue)
router.get('/', auth, async (req, res) => {
  const [query, options] = parseQuery(Object(req.query), DashboardSchema)

  if (!query.userId) {
    return res.status(501).send('Server Error: must include userId parameter')
  }

  const results = await Dashboards.find({ $and: [query] }, {}, options)
  return res.status(200).json({ Results: results })
})

module.exports = router
