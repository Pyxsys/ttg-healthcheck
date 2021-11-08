const express = require('express')
const router = express.Router()
const cpu = require('../models/cpu.js')

// receive report from daemon
router.post('/', async (req, res) => {
  try {
    const payload = req.body
    let newCpuLog = processCpuLogInfo(payload)

    await newCpuLog.save()
    res.status(200).send()
  } catch (err) {
    res.status(500).send('Server Error ' + err.message)
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

module.exports = {
  router,
  processCpuLogInfo,
}
