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

async function processCpuLogInfo(payload) {
  //load values
  const { deviceId, timestamp, processes } = payload

  //count number of running and stopped processes
  var runningProcs = 0,
    sleepingProcs = 0
  for (let i = 0; i < processes.length; i++) {
    if (processes[i].status === 'running') {
      runningProcs++
    } else {
      sleepingProcs++
    }
  }

  //compute values
  const usagePercentage = 0
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

module.exports = router
