/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.js')
const { Dashboards, DashboardSchema } = require('../models/dashboard.js')
const { parseQuery } = require('./common/filter')

// save a dashboard with a userId and widgets
router.post('/', auth, async (req, res) => {
  const { userId, widgets } = req.body

  if (typeof userId !== 'string') {
    return res.status(400).send('Invalid: UserId must be a String')
  }
  if (!(widgets instanceof Array)) {
    return res.status(400).send('Invalid: Widgets must be an Array')
  }

  const invalidWidgets = widgets.filter(
    (widget) => !('widgetType' in widget && 'options' in widget)
  )
  if (invalidWidgets.length > 0) {
    return res
      .status(400)
      .send('Invalid: Widgets must have parameters: widgetType and options')
  }

  const query = { userId: userId }
  const update = { userId, widgets }
  const options = { upsert: true, new: true, setDefaultsOnInsert: true }

  await Dashboards.findOneAndUpdate(query, update, options)
  return res.status(200).send('Save Successful')
})

// get multiple dashboards with param options (limit, multiple attributes, orderBy)
router.get('/', auth, async (req, res) => {
  const [query, options] = parseQuery(Object(req.query), DashboardSchema)

  if (!query.userId) {
    return res.status(501).send('Server Error: must include userId parameter')
  }

  const results = await Dashboards.findOne({ $and: [query] }, {}, options)
  return res.status(200).json({ Results: [results] })
})

module.exports = router
