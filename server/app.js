const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./db/db_connection')
const { monitorAllChangeStreams } = require('./db/change_streams')

const app = express()

// setup middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// connect database
connectDB().then(() => {
  if (!process.env.TEST) {
    monitorAllChangeStreams()
  }
})

// Define Routes
app.use('/api/user', require('./api/user'))
app.use('/api/device', require('./api/device'))
app.use('/api/daemon_endpoint', require('./api/daemon_endpoint'))

module.exports = app
