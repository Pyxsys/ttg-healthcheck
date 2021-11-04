const mongoose = require('mongoose')
const { exitProcess } = require('../destroyProcess')

// connect to database
const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log('MongoDB connected...'))
  } catch (err) {
    exitProcess(err.message, 1)
  }
}

module.exports = connectDB
