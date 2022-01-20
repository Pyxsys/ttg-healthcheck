const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

// setup middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// Define Routes
app.use('/api/user', require('./api/user'))
app.use('/api/daemon', require('./api/daemon').router)
app.use('/api/device', require('./api/device'))
app.use('/api/device-logs', require('./api/deviceLogs'))
app.use('/api/dashboard', require('./api/dashboard'))

module.exports = app
