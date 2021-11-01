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
app.use('/api/device', require('./api/device'))
app.use('/api/diskLogs', require('./api/diskLogs'))
app.use('/api/memoryLogs', require('./api/memoryLogs'))
app.use('/api/wifiLogs', require('./api/wifiLogs'))
app.use('/api/cpuLogs', require('./api/cpuLogs'))
app.use('/api/daemon_endpoint', require('./api/daemon_endpoint'))

module.exports = app
