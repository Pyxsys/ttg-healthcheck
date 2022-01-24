const request = require('supertest')
const mongoose = require('mongoose')

const app = require('../../app')
const connectDB = require('../../db/db_connection')
const { Devices } = require('../../models/device.js')
const { DeviceLogs } = require('../../models/device_logs')
const daemonFunctions = require('../../api/daemon')
const { mockStartupPayload, mockLogPayload1 } = require('./common.test')

beforeAll(async () => {
  await connectDB() // connect to local_db
  await Devices.deleteMany() //clear devices
  await DeviceLogs.deleteMany() //clear logs
})

describe('Test helper functions', () => {
  it('Verify good deviceId is of correct format', () => {
    const result = daemonFunctions.verifyDeviceIdFormat(
      mockStartupPayload.deviceId
    )
    expect(result).toBe(true)
  })

  it('Verify bad deviceId throws error', () => {
    expect(() => daemonFunctions.verifyDeviceIdFormat(null)).toThrow(
      'deviceId [' + null + '] is invalid'
    )
  })

  it('Sum correct amount of running processes', () => {
    const result = daemonFunctions.computeLiveSleepingProcesses(
      mockLogPayload1.processes
    )
    expect(result[0]).toBe(1)
  })

  it('Sum correct amount of non-running processes', () => {
    const result = daemonFunctions.computeLiveSleepingProcesses(
      mockLogPayload1.processes
    )
    expect(result[1]).toBe(1)
  })
})

describe('Test Device formatters', () => {
  const doc = daemonFunctions.processDeviceInfo(mockStartupPayload)

  //process values
  it('Process data is consistent', () => {
    expect(doc.deviceId).toBe(mockStartupPayload.deviceId)
    expect(doc.memory.maxSize).toBe(mockStartupPayload.memory_.maxSize)
    expect(doc.memory.formFactor[0]).toBe(
      mockStartupPayload.memory_.formFactor[0]
    )
    expect(doc.cpu.baseSpeed).toBe(mockStartupPayload.cpu_.baseSpeed)
    expect(doc.cpu.cacheSizeL1).toBe(mockStartupPayload.cpu_.cacheSizeL1)
    expect(doc.cpu.cacheSizeL2).toBe(mockStartupPayload.cpu_.cacheSizeL2)
    expect(doc.cpu.cacheSizeL3).toBe(mockStartupPayload.cpu_.cacheSizeL3)
    expect(doc.cpu.cores).toBe(mockStartupPayload.cpu_.cores)
    expect(doc.cpu.processors).toBe(mockStartupPayload.cpu_.processors)
    expect(doc.cpu.sockets).toBe(mockStartupPayload.cpu_.sockets)

    expect(doc.wifi.adapterName).toBe(mockStartupPayload.wifi_.adapterName)
    expect(doc.wifi.SSID).toBe(mockStartupPayload.wifi_.SSID)
    expect(doc.wifi.connectionType).toBe(
      mockStartupPayload.wifi_.connectionType
    )
    expect(doc.wifi.ipv4Address).toBe(mockStartupPayload.wifi_.ipv4Address)
    expect(doc.wifi.ipv6Address).toBe(mockStartupPayload.wifi_.ipv6Address)
  })
})

describe('Test CPU log formatter', () => {
  const doc = daemonFunctions.processCpuLogInfo(mockLogPayload1)
  //computed values
  it('Sum of processes', () => {
    expect(doc.numProcesses).toBe(2)
  })

  it('Sum of CPU usage', () => {
    expect(doc.aggregatedPercentage).toBe(2.23)
  })

  it.skip('Running processes - no longer applicable with #156', () => {
    expect(doc.threadsAlive).toBe(1)
  })

  it('Sleeping processes', () => {
    expect(doc.threadsSleeping).toBe(1)
  })

  it.skip('Process data is consistent - no longer applicable with #156', () => {
    expect(doc.processes[0].name).toBe(mockLogPayload1.processes[0].name)
    expect(doc.processes[0].pid).toBe(mockLogPayload1.processes[0].pid)
    expect(doc.processes[0].status).toBe(mockLogPayload1.processes[0].status)
    expect(doc.processes[0].cpu_percent).toBe(
      mockLogPayload1.processes[0].cpu_percent
    )
  })
})

describe('Test Memory log formatter', () => {
  const doc = daemonFunctions.processMemoryLogInfo(mockLogPayload1)

  it('Sum of Cache memory', () => {
    expect(doc.cached).toBe(28346769)
  })

  it('Sum of percentage memory', () => {
    expect(doc.aggregatedPercentage).toBe(9.97)
  })
})

describe('Test Disk log formatter', () => {
  const doc = daemonFunctions.processDiskLogInfo(mockLogPayload1)

  it('Should return correct disk partitionInfo', () => {
    expect(doc.partitions[0].percent).toBe(70)
    expect(doc.partitions[0].path).toBe('C:\\')
  })

  it('Should return correct physical disk IO info', () => {
    expect(doc.disks[0].name).toBe('PhysicalDrive0')
    expect(doc.disks[0].responseTime).toBe(0.125)
    expect(doc.disks[0].readSpeed).toBe(1024)
    expect(doc.disks[0].writeSpeed).toBe(1024)
  })
})

describe('Save daemon device to DB', () => {
  const devicePath = '/api/daemon/device'

  it('should insert the device to the DB', async () => {
    const response = await request(app)
      .post(devicePath)
      .send(mockStartupPayload)
    expect(response.statusCode).toBe(200)

    const devices = await Devices.find()
    expect(devices.length).toBe(1)
    expect(devices[0].name).toBe('test device')
  })

  it('should update the device in the DB', async () => {
    const updatedDevice = { ...mockStartupPayload, name: 'another name' }
    const response = await request(app).post(devicePath).send(updatedDevice)
    expect(response.statusCode).toBe(200)

    const devices = await Devices.find()
    expect(devices.length).toBe(1)
    expect(devices[0].name).toBe('another name')
  })

  it('should not insert a device with incorrect deviceId to the DB', async () => {
    const invalidDevice = { ...mockStartupPayload, deviceId: 'invalid' }
    const response = await request(app).post(devicePath).send(invalidDevice)
    expect(response.statusCode).toBe(501)

    const devices = await Devices.find()
    expect(devices.length).toBe(1)
  })
})

describe('Save daemon log payload to DB', () => {
  const logPath = '/api/daemon'
  const invalidIDLog = { ...mockLogPayload1, deviceId: 'invalid' }

  afterEach(async () => {
    await DeviceLogs.deleteMany()
  })

  it.skip('Should save the CPU log to the DB - no longer applicable with #156', async () => {
    const response_good = await request(app).post(logPath).send(mockLogPayload1)
    expect(response_good.statusCode).toBe(200)

    const cpus = await CpuLogs.find()
    expect(cpus.length).toBe(1)
  })

  it('Should not insert the Log with incorrect deviceId to the DB', async () => {
    const response_bad = await request(app).post(logPath).send(invalidIDLog)
    expect(response_bad.statusCode).toBe(501)

    const device_logs = await DeviceLogs.find()
    expect(device_logs.length).toBe(0)
  })

  it.skip('Should save the Memory log to the DB - no longer applicable with #156', async () => {
    const response_good = await request(app).post(logPath).send(mockLogPayload1)
    expect(response_good.statusCode).toBe(200)

    const mems = await MemoryLogs.find()
    expect(mems.length).toBe(1)
  })
})

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})
