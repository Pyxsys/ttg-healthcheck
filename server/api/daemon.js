const express = require('express')
const router = express.Router()
const {CpuLogs} = require('../models/cpu.js')
const Device = require('../models/device.js')

// receive report from daemon
router.post('/', async (req, res) => {
  try {
    const payload = req.body
    verifyDeviceIdFormat(payload.deviceId)
    let newCpuLog = processCpuLogInfo(payload)

    await newCpuLog.save()
    res.status(200).send()
  } catch (err) {
    res.status(500).send('Server Error: ' + err.message)
  }
})

// receive device report from daemon
router.post('/device', async (req, res) => {
  try {
    const payload = req.body
    verifyDeviceIdFormat(payload.deviceId)

    let newDevice = processDeviceInfo(payload)

    const filter = { deviceId: payload.deviceId.toString() }
    const flags = { upsert: true }
    await Device.findOneAndUpdate(filter, newDevice, flags)

    res.status(200).send()
  } catch (err) {
    res.status(500).send('Server Error: ' + err.message)
  }
})

function verifyDeviceIdFormat(deviceId) {
  const pattern = '^[0-9A-Z]{8}(?:\-[0-9A-Z]{4}){3}\-[0-9A-Z]{12}$'
  const regex = new RegExp(pattern, 'i')

  if (!regex.test(deviceId)) {
    throw new Error('deviceId [' + deviceId + '] is invalid')
  } else return true
}

function processDeviceInfo(payload) {
  const { deviceId, memory_ } = payload

  const name = null
  const description = null
  const connectionType = null
  const status = null
  const provider = null

  const hardware = null
  const cpu = null
  const memory = memory_
  const disk = null
  const wifi = null

  return {
    deviceId,
    name,
    description,
    connectionType,
    status,
    provider,
    hardware,
    cpu,
    memory,
    disk,
    wifi,
  }
}

function sumProcessCpuUsage(processes) {
  let sum = 0
  processes.forEach(function (proc) {
    if (proc.name !== 'System Idle Process') {
      sum += proc.cpu_percent
    }
  })
  return sum
}

function processCpuLogInfo(payload) {
  //load values
  const { deviceId, timestamp, processes } = payload

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

module.exports = {
  router,
  verifyDeviceIdFormat,
  processDeviceInfo,
  processCpuLogInfo,
}
