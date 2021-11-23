const mongoose = require('mongoose')

const MemorySchema = new mongoose.Schema({
  maxSize: {
    type: Number,
  },
  formFactor: [
    {
      type: String,
    },
  ],
})

const MemoryProcessSchema = new mongoose.Schema({
  usagePercentage: {
    type: Number,
  },
  inUse: {
    type: Number,
  },
  available: {
    type: Number,
  },
  cached: {
    type: Number,
  },
})

module.exports = {
  MemorySchema: MemorySchema,
  MemoryProcessSchema: MemoryProcessSchema,
}
