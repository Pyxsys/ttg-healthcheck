const express = require('express')
const app = express()
const connectDB = require('./db/db_connection')
const cors = require('cors')
const cookieParser = require('cookie-parser')

// setup middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// connect database
connectDB()

// Define Routes
app.use('/api/user', require('./api/user'))

module.exports = app
