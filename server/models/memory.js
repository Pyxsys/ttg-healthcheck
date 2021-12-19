const mongoose = require('mongoose')

const MemoryStaticSchema = new mongoose.Schema({
  maxSize: Number,
  formFactor: [String],
})

const MemoryDynamicSchema = new mongoose.Schema({
  inUse: Number,
  available: Number,
  cached: Number,
  aggregatedPercentage: Number,
})

const MemoryProcessSchema = new mongoose.Schema({
  usagePercentage: Number,
})

module.exports = {
  MemoryStaticSchema,
  MemoryDynamicSchema,
  MemoryProcessSchema,
}
