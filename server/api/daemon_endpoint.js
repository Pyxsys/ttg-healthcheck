/* eslint-disable new-cap */
const express = require('express')
const router = express.Router()
const cpu = require('../models/cpu.js')
const process = require('../models/process.js')

// receive report from daemon
router.post('/', async (req, res) => {
  try {
    const payload = req.body
    let newCpuLog = await processCpuLogInfo(payload)

    await newCpuLog.save()
    res.status(200).send()
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

function sumProcessCpuUsage(processes) { 
  let sum = 0
  processes.forEach(function(proc){
    sum += proc.cpu_percent
  })
  return sum
}

async function processCpuLogInfo(payload) {
  //load values
  const { deviceId, timestamp, processes } = payload

  //load computed values
  const usagePercentage = sumProcessCpuUsage(processes)
  const usageSpeed = 0
  const numProcesses = processes.length
  const threadsAlive = 0
  const threadsSleeping = 0
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
  processCpuLogInfo
}

