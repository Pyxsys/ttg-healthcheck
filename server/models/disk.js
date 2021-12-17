const mongoose = require('mongoose')

const DiskStaticSchema = new mongoose.Schema({
  capacity: Number,
  type: String,
})

const DiskDynamicSchema = new mongoose.Schema({
  activeTimePercent: Number,
  responseTime: Number,
  readSpeed: Number,
  writeSpeed: Number,
})

module.exports = {
  DiskStaticSchema,
  DiskDynamicSchema,
}
