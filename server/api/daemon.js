const express = require('express')
const router = express.Router()
const { CpuLogs } = require('../models/cpu.js')
const Device = require('../models/device.js')
const wifi = require('../models/wifi.js')

// receive device report from daemon
router.post('/device', async (req, res) => {
  try {
    const payload = req.body
    verifyDeviceIdFormat(payload.deviceId)
    const newDevice = processDeviceInfo(payload)

    const filter = { deviceId: payload.deviceId.toString() }
    const flags = { upsert: true }
    await Device.findOneAndUpdate(filter, newDevice, flags)

    res.status(200).send()
  } catch (err) {
    res.status(501).send('Server Error: ' + err.message)
  }
})

// receive report from daemon
router.post('/', async (req, res) => {
  try {
    const payload = req.body
    verifyDeviceIdFormat(payload.deviceId)
    const newCpuLog = processCpuLogInfo(payload)
    const newWifiLog = processWifiLogInfo(payload)

    await newCpuLog.save()
    await newWifiLog.save()
    res.status(200).send()
  } catch (err) {
    res.status(501).send('Server Error: ' + err.message)
  }
})

/*
 * ==================
 * Helper Functions
 * ==================
 */

const verifyDeviceIdFormat = (deviceId) => {
  const pattern = '^[0-9A-Z]{8}(?:-[0-9A-Z]{4}){3}-[0-9A-Z]{12}$'
  const regex = new RegExp(pattern, 'i')

  if (!regex.test(deviceId)) {
    throw new Error('deviceId [' + deviceId + '] is invalid')
  } else return true
}

const sumProcessCpuUsage = (processes) => {
  let sum = 0
  processes.forEach((proc) => {
    if (proc.name !== 'System Idle Process') {
      sum += proc.cpu_percent
    }
  })
  return sum
}

const processDeviceInfo = (payload) => {
  const {
    deviceId,
    name,
    description,
    connectionType,
    status,
    provider,
    hardware,
    cpu,
    memory_,
    disk,
    wifi,
  } = payload

  return {
    deviceId,
    name,
    description,
    connectionType,
    status,
    provider,
    hardware,
    cpu,
    memory: memory_,
    disk,
    wifi,
  }
}

const processCpuLogInfo = (payload) => {
  //load values
  const { deviceId, timestamp, processes,} = payload

  //count number of running and stopped processes
  var runningProcs = 0,
    sleepingProcs = 0
  for (const proc of processes) {
    if (proc.status === 'running') {
      runningProcs++
    } else {
      sleepingProcs++
    }
  }

  //compute values
  const usagePercentage = sumProcessCpuUsage(processes)
  const usageSpeed = 0
  const numProcesses = processes.length
  const threadsAlive = runningProcs
  const threadsSleeping = sleepingProcs
  const uptime = 0

  return new CpuLogs({
    deviceId,
    usagePercentage,
    usageSpeed,
    numProcesses,
    threadsAlive,
    threadsSleeping,
    uptime,
    timestamp,
    processes,
  })
}

const processWifiLogInfo = (payload) => {
  //load values
  const { deviceId, timestamp, network } = payload

  //compute values
  const sendSpeed = network[0]
  const receiveSpeed = network[1]
  const signalStrength = 0

  return new wifi.WifiLogs({
    deviceId,
    sendSpeed,
    receiveSpeed,
    signalStrength,
    timestamp,
  })
}

module.exports = {
  router,
  verifyDeviceIdFormat,
  processDeviceInfo,
  processCpuLogInfo,
  processWifiLogInfo,
}
