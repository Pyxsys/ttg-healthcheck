const express = require('express')
const app = express()
const connectDB = require('./db/db_connection')

// setup middlewares
app.use(express.json())

// connect database
connectDB()

// Define Routes
app.use('/api/user', require('./api/user'))

// Define Routes
app.use('/api/daemon_endpoint', require('./api/daemon_endpoint'))

module.exports = app
