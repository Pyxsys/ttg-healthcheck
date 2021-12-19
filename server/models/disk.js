const mongoose = require('mongoose')

const DiskStaticSubSchema = mongoose.Schema({
  type: String,
  model: String,
  size: Number,
})

const DiskStaticSchema = new mongoose.Schema({
  capacity: Number,
  disks: [DiskStaticSubSchema],
})

const DiskDynamicPartitionSubSchema = mongoose.Schema({
  path: String,
  percent: Number,
})

const DiskDynamicPhysicalSubSchema = mongoose.Schema({
  name: String,
  responseTime: Number,
  readSpeed: Number,
  writeSpeed: Number,
})

const DiskDynamicSchema = new mongoose.Schema({
  partitions: [DiskDynamicPartitionSubSchema],
  disks: [DiskDynamicPhysicalSubSchema],
})

module.exports = {
  DiskStaticSchema,
  DiskDynamicSchema,
}
