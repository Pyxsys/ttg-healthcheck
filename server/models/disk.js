const mongoose = require('mongoose')

const DiskSchema = new mongoose.Schema({
  capacity: {
    type: Number,
  },
  type: {
    type: String,
  },
})

const DiskProcessSchema = new mongoose.Schema({
  activeTimePercent: {
    type: Number,
  },
  responseTime: {
    type: Number,
  },
  readSpeed: {
    type: Number,
  },
  writeSpeed: {
    type: Number,
  },
})

module.exports = {
  DiskSchema: DiskSchema,
  DiskProcessSchema: DiskProcessSchema,
}
