const express = require('express')
const router = express.Router()
const Device = require('../models/device.js')
const DeviceLogs = require('../models/device_logs.js')
const { CpuLogs } = require('../models/cpu.js')
const { MemoryLogs } = require('../models/memory.js')
const wifiModel = require('../models/wifi.js')

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
    newDeviceLog = processDeviceLogInfo(payload)

    await newDeviceLog.save()

    res.status(200).send()
  } catch (err) {
    res.status(501).send('Server Error: ' + err.message)
  }
})

/*
 * ==================
 * Loading Functions
 * ==================
 */

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

const processDeviceLogInfo = (payload) => {
  const { deviceId, timestamp } = payload

  const newCpuLog = processCpuLogInfo(payload)
  const newMemoryLog = processMemoryLogInfo(payload)
  //const newDiskLog = processDiskLogInfo(payload)
  const newWifiLog = processWifiLogInfo(payload)
  const newProcessLogArray = processProcessLogInfo(payload)

  return new DeviceLogs({
    deviceId,
    timestamp,
    cpu: newCpuLog,
    memory: newMemoryLog,
    //disk: newDiskLog,
    wifi: newWifiLog,
    processes: newProcessLogArray,
  })
}

const processCpuLogInfo = (payload) => {
  //load values
  const { processes } = payload

  //compute values
  const usageSpeed = 0
  const numProcesses = processes.length
  const threadsSleeping = computeLiveSleepingProcesses(processes)[1]
  const aggregatedPercentage = sumCpuPercentUsage(processes)

  return {
    usageSpeed,
    numProcesses,
    threadsSleeping,
    aggregatedPercentage,
  }
}

const processMemoryLogInfo = (payload) => {
  //load values
  const { memory, processes } = payload

  //compute values
  const inUse = memory.used
  const available = memory.available
  const cached = sumProcessVMSUsage(processes)
  const aggregatedPercentage = sumMemoryPercentUsage(processes)

  return {
    inUse,
    available,
    cached,
    aggregatedPercentage,
  }
}

const processWifiLogInfo = (payload) => {
  //load values
  const { network } = payload

  //compute values
  const sendSpeed = network[0]
  const receiveSpeed = network[1]
  const signalStrength = 0

  return {
    sendSpeed,
    receiveSpeed,
    signalStrength,
  }
}

const processProcessLogInfo = (payload) => {
  //load values
  const { processes } = payload

  //compute values
  processArray = new Array()

  processes.forEach((element) => {
    processArray.push(processSingleProcess(element))
  })

  return processArray
}

const processSingleProcess = (process) => {
  //load values
  const { name, pid, status, cpu_percent, memory_percent } = process

  return {
    name,
    pid,
    status,
    cpu: {
      usagePercentage: cpu_percent,
    },
    memory: {
      usagePercentage: memory_percent,
    },
  }
}

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

const sumCpuPercentUsage = (processes) => {
  let aggregatedPercentage = 0
  processes.forEach((proc) => {
    if (proc.name !== 'System Idle Process') {
      aggregatedPercentage += proc.cpu_percent
    }
  })
  return aggregatedPercentage
}

const sumProcessVMSUsage = (processes) => {
  let sum = 0
  processes.forEach((proc) => {
    sum += proc.vms
  })
  return sum
}

const computeLiveSleepingProcesses = (processes) => {
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

  return runningProcs, sleepingProcs
}

const sumMemoryPercentUsage = (processes) => {
  let aggregatedPercentage = 0

  processes.forEach((proc) => {
    aggregatedPercentage += proc.memory_percent
  })

  return aggregatedPercentage
}

module.exports = {
  router,
  verifyDeviceIdFormat,
  processDeviceInfo,
  processDeviceLogInfo,
  processCpuLogInfo,
  processMemoryLogInfo,
  processWifiLogInfo,
  processProcessLogInfo,
  processSingleProcess,
}
