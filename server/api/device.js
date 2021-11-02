/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const Devices = require('../models/device.js')
const auth = require('../middleware/auth.js')

// String attributes list to check with req.query object
const stringAttributes = [
  'orderBy',
  'deviceId',
  'name',
  'description',
  'connectionType',
  'status',
  'provider',
  'memory.formFactor',
  'hardware.hardwareName',
  'disk.type',
]

// Number attributes list to check with req.query object
const numberAttributes = [
  'limit',
  'orderValue',
  'cpu.baseSpeed',
  'cpu.sockets',
  'cpu.cores',
  'cpu.processors',
  'cpu.cacheSizeL1',
  'cpu.cacheSizeL2',
  'cpu.cacheSizeL3',
  'wifi.adapterName',
  'wifi.SSID',
  'wifi.connectionType',
  'wifi.ipv4Address',
  'wifi.ipv6Address',
  'memory.maxSize',
  'disk.capacity',
]

// get a specific device, based on param option of either deviceId or name
router.get('/specific-device', async (req, res) => {
  try {
    const param = String(req.query.entry)
    await Devices.findOne({
      $or: [{ deviceId: param }, { name: param }],
    }).exec(function (err, device) {
      return res.status(200).json(device)
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// get multiple devices with param options (limit, multiple attributes, orderBy, orderValue)
router.get('/options', async (req, res) => {
  try {
    let options = {}
    let query = {}
    let queryObj = Object(req.query)
    for (let k in queryObj) {
      queryObj[k] = queryObj[k].split(',')
      if (stringAttributes.includes(k)) {
        query[String(k)] = queryObj[k]
      }
      if (numberAttributes.includes(k)) {
        query[String(k)] = queryObj[k].map(Number)
      }
    }
    if (query.limit) {
      options.limit = query.limit
      delete query.limit
    }
    if (query.orderBy) {
      var orderBy = query.orderBy
      delete query.orderBy
    }
    if (query.orderValue) {
      var orderValue = query.orderValue
      delete query.orderValue
    }
    if (orderValue && orderBy) {
      options.sort = {
        [orderBy]: orderValue,
      }
    }
    await Devices.find({ $and: [query] }, {}, options).exec((err, device) => {
      return res.status(200).json(device)
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
