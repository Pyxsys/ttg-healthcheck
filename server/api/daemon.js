const express = require('express')
const router = express.Router()
const cpu = require('../models/cpu.js')
const Device = require('../models/device.js')

/*
 * Insert static Device information to the datbase.
 *
 * If there already exists a device with the same deviceID
 * attribute, then update the existing device with the
 * new information.
 */
router.post('/device', async (req, res) => {
  const payload = Object(req.body)
  const key = { deviceId: String(payload.deviceId) }
  await Device.updateOne(key, payload, { upsert: true })
  return res.status(200).send()
})

// receive report from daemon
router.post('/', async (req, res) => {
  const payload = req.body
  const newCpuLog = processCpuLogInfo(payload)

  await newCpuLog.save()
  return res.status(200).send()
})

// Helper Functions

const sumProcessCpuUsage = (processes) => {
  let sum = 0
  processes.forEach((proc) => {
    if (proc.name !== 'System Idle Process') {
      sum += proc.cpu_percent
    }
  })
  return sum
}

const processCpuLogInfo = (payload) => {
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

  return new cpu.CpuLogs({
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
  processCpuLogInfo,
}
