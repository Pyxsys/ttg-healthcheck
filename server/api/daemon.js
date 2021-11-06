/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const cpu = require('../models/cpu.js')
const process = require('../models/process.js')
const wifi = require('../models/wifi.js')

// receive report from daemon
router.post('/', async (req, res) => {
  try {
    const payload = req.body
    let newCpuLog = processCpuLogInfo(payload)
    let newWifiLog = processWifiLogInfo(payload)

    await newWifiLog.save()
    await newCpuLog.save()
    res.status(200).send()
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

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

function processWifiLogInfo(payload) {
  //load values
  const { deviceId, timestamp, processes } = payload

  //compute values
  const sendSpeed = 0
  const receiveSpeed = 0
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
  processCpuLogInfo,
  processWifiLogInfo,
}
