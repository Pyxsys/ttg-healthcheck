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
app.use('/api/daemon_endpoint', require('./api/daemon_endpoint'))

module.exports = app
